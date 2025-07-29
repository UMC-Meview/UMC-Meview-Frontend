import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { UserProfileResponse, ApiError } from "../../types/auth";
import { AxiosError } from "axios";
import { getUserInfo } from "../../utils/auth";

// 사용자 프로필 정보 조회 API 함수
const getUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  try {
    const response = await axiosClient.get<UserProfileResponse>(`/users/${userId}/profile`);
    return response.data;
  } catch (error: unknown) {
    console.error("사용자 프로필 조회 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      
      // 스웨거 문서에 명시된 404 에러 처리
      if (status === 404) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      
      // 기타 서버 에러 처리
      throw new Error(errorData?.message || `사용자 정보 조회 실패 (${status})`);
    }
    
    // 네트워크 에러 처리
    throw new Error("네트워크 에러가 발생했습니다.");
  }
};

// 훅 반환 타입 정의
export interface UseGetUserProfileResult {
  data: UserProfileResponse | undefined;
  isLoading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  refetch: () => void;
}

// 사용자 프로필 조회 커스텀 훅
export const useGetUserProfile = (): UseGetUserProfileResult => {
  const userInfo = getUserInfo();
  const userId = userInfo?.id;

  const query = useQuery<UserProfileResponse, Error>({
    queryKey: ["userProfile", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("사용자 ID가 없습니다.");
      }
      return getUserProfile(userId);
    },
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 0, // 항상 최신 데이터를 요청하도록 설정
    gcTime: 5 * 60 * 1000, // 5분간 캐시 보관
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음 (사용자가 존재하지 않는 경우)
      if (error.message === "사용자를 찾을 수 없습니다.") {
        return false;
      }
      // 기타 에러는 1번만 재시도
      return failureCount < 1;
    },
    refetchOnWindowFocus: true, // 윈도우 포커스 시 자동 리페치 활성화
    refetchOnMount: true, // 마운트 시 항상 리페치
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error ? { message: query.error.message } : null,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}; 