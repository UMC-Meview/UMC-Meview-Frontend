import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { UserReviewsResponse, UseGetUserReviewsResult } from "../../types/review";
import { AxiosError } from "axios";

// 사용자 리뷰 목록 조회 API 함수
const getUserReviews = async (userId: string): Promise<UserReviewsResponse> => {
  try {
    const response = await axiosClient.get<UserReviewsResponse>(`/users/${userId}/reviews`);
    return response.data;
  } catch (error: unknown) {
    console.error("사용자 리뷰 목록 조회 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      
      // 스웨거 문서에 명시된 404 에러 처리
      if (status === 404) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      
      // 기타 서버 에러 처리
      throw new Error(errorData?.message || `사용자 리뷰 목록 조회 실패 (${status})`);
    }
    
    // 네트워크 에러 처리
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
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음 (사용자가 존재하지 않는 경우)
      if (error.message === "사용자를 찾을 수 없습니다.") {
        return false;
      }
      // 기타 에러는 2번까지 재시도
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    refetchOnMount: true, // 마운트 시 항상 리페치
  });

  // 성공 시 평균 점수와 리뷰 리스트를 분리해서 반환
  const reviews = query.data?.reviews || [];
  const averagePositiveScore = query.data?.averagePositiveScore || 0;
  const averageNegativeScore = query.data?.averageNegativeScore || 0;

  return {
    reviews,
    averagePositiveScore,
    averageNegativeScore,
    isLoading: query.isLoading,
    error: query.error ? query.error.message : null,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}; 