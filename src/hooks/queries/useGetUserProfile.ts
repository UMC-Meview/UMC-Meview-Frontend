import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { UserProfileResponse, ApiError } from "../../types/auth";
import { AxiosError } from "axios";
import { getUserInfo } from "../../utils/auth";

// 사용자 프로필 정보 조회 API
const getUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  try {
    const response = await axiosClient.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error: unknown) {
    console.error("사용자 프로필 조회 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      
      if (status === 404) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      
      throw new Error(errorData?.message || `사용자 정보 조회 실패 (${status})`);
    }
    
    throw new Error("네트워크 에러가 발생했습니다.");
  }
};

export interface UseGetUserProfileResult {
  data: UserProfileResponse | undefined;
  isLoading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  refetch: () => void;
}

// 사용자 프로필 조회 훅
export const useGetUserProfile = (): UseGetUserProfileResult => {
  const userInfo = getUserInfo();
  const userId = userInfo?.id;

  const query = useQuery<UserProfileResponse, Error>({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 0, // 항상 최신 데이터를 요청하도록 설정
    gcTime: 5 * 60 * 1000, // 5분간 캐시 보관
    retry: 1, // 실패시 1번만 재시도
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