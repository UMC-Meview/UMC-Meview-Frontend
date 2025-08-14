import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { UserReviewsResponse, UseGetUserReviewsResult, DisplayReview, Review, PopulatedStoreInReview } from "../../types/review";
import { AxiosError } from "axios";
import { extractStoreIdFromReview, resolveReviewThumbnail, truncateAddressToTown } from "../../lib/reviewUtils";
import { getStoreLevel, getStoreIconPath } from "../../lib/storeUtils";

// 사용자 리뷰 목록 조회 API 함수
const getUserReviews = async (userId: string): Promise<UserReviewsResponse> => {
  try {
    const response = await axiosClient.get<UserReviewsResponse>(`/users/${userId}/reviews`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const statusCode = error.response.status;
      // 404: 사용자 없음 → 빈 목록과 0점 요약으로 처리
      if (statusCode === 404) {
        return { reviews: [], averagePositiveScore: 0, averageNegativeScore: 0 };
      }
      // 기타 서버 에러는 상위에서 처리할 수 있도록 메시지 포함하여 throw
      const message = (error.response.data as { message?: string } | undefined)?.message;
      throw new Error(message || `사용자 리뷰 목록 조회 실패 (${statusCode})`);
    }
    throw new Error("네트워크 에러가 발생했습니다.");
  }
};

// 사용자 리뷰 목록 조회 커스텀 훅
export const useGetUserReviews = (userId: string): UseGetUserReviewsResult => {
  const query = useQuery<UserReviewsResponse, Error>({
    queryKey: ["userReviews", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("사용자 ID가 없습니다.");
      }
      return getUserReviews(userId);
    },
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하다고 간주
    gcTime: 10 * 60 * 1000, // 10분간 캐시 보관
    retry: (failureCount) => {
      // 기타 에러는 2번까지 재시도
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    refetchOnMount: true, // 마운트 시 항상 리페치
  });

  // 원본 응답 그대로 사용 + 참조 안정화를 위해 reviews만 메모
  const userReviews = query.data ?? null;
  const reviews = useMemo(() => userReviews?.reviews ?? [], [userReviews?.reviews]);
  // 평균 점수는 사용처에서 userReviews로 접근

  // populate된 스토어 정보를 그대로 활용하여 표시 데이터 구성
  const displayReviews: DisplayReview[] = useMemo((): DisplayReview[] => {
    return (reviews as (Review & { store: string | PopulatedStoreInReview })[]).map((rev) => {
      const storeId = extractStoreIdFromReview(rev);
      const populated: PopulatedStoreInReview | undefined =
        typeof rev.store === "object" ? (rev.store as PopulatedStoreInReview) : undefined;
      const storeName = populated?.name || "가게명";
      const storeAddress = populated?.address || "";
      const storeAddressShort = truncateAddressToTown(storeAddress);
      const storeCategory = populated?.category;
      const imageUrl = resolveReviewThumbnail(rev);
      const storeLevel = getStoreLevel(populated?.averagePositiveScore);
      const storeIconPath = getStoreIconPath(storeLevel);
      return {
        ...rev,
        storeId,
        storeName,
        storeAddress,
        storeAddressShort,
        storeCategory,
        storeLevel,
        storeIconPath,
        imageUrl,
      } as DisplayReview;
    });
  }, [reviews]);

  return {
    userReviews,
    displayReviews,
    isLoading: query.isLoading,
    error: query.error ? query.error.message : null,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}; 