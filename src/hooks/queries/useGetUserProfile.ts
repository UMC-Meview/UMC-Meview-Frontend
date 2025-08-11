import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { UserProfileResponse, ApiError } from "../../types/auth";
import { AxiosError } from "axios";

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
      
      if (status === 404) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      
      // 기타 서버 에러 처리
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

export const useGetUserProfile = (userId: string): UseGetUserProfileResult => {
  const query = useQuery<UserProfileResponse, Error>({
    queryKey: ["userProfile", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("사용자 ID가 없습니다.");
      }
      return getUserProfile(userId);
    },
    enabled: !!userId, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 5 * 60 * 1000, 
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (error.message === "사용자를 찾을 수 없습니다.") {
        return false;
      }
      // 기타 에러는 1번만 재시도
      return failureCount < 1;
    },
    refetchOnWindowFocus: false, 
    refetchOnMount: true, 
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error ? { message: query.error.message } : null,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}; 