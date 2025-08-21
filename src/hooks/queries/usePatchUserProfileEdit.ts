import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import {
  PatchProfileRequest,
  PatchProfileResponse,
  ApiError,
  UserProfileResponse,
} from "../../types/auth";
import { AxiosError } from "axios";
import { getUserInfo, setUserInfo } from "../../utils/auth";
import { UserInfo } from "../../types/auth";

const patchUserProfile = async (
  userId: string, 
  updateData: PatchProfileRequest
): Promise<PatchProfileResponse> => {
  try {
    const response = await axiosClient.patch<PatchProfileResponse>(
      `/users/${userId}/profile`, 
      updateData
    );
    return response.data;
  } catch (error: unknown) {
    console.error("사용자 프로필 수정 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      
      if (status === 404) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      
      // 기타 서버 에러 처리
      throw new Error(errorData?.message || `프로필 수정 실패 (${status})`);
    }
    
    throw new Error("네트워크 에러가 발생했습니다.");
  }
};

type PatchVariables = { userId: string; updateData: PatchProfileRequest };

export interface UsePatchUserProfileEditResult {
  patchProfile: (userId: string, data: PatchProfileRequest) => void;
  isLoading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  data: PatchProfileResponse | undefined;
  reset: () => void;
}

export const usePatchUserProfileEdit = (): UsePatchUserProfileEditResult => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PatchProfileResponse, Error, PatchVariables>({
    mutationFn: ({ userId, updateData }: PatchVariables) => {
      if (!userId) {
        throw new Error("유효하지 않은 사용자 ID 입니다.");
      }
      return patchUserProfile(userId, updateData);
    },
    onSuccess: (data, variables) => {
      // console.log("프로필 수정 성공:", data.nickname);
      
      // localStorage에 기본 사용자 정보 업데이트
      const currentUserInfo = getUserInfo();
      if (currentUserInfo) {
        const updatedUserInfo: UserInfo = {
          ...currentUserInfo,
          nickname: data.nickname,
          tastePreferences: data.tastePreferences,
        };
        setUserInfo(updatedUserInfo);
      }
      
      // React Query 캐시 업데이트
      const targetUserId = variables?.userId;
      if (targetUserId) {
        // 기존 캐시값 보존
        const previousProfile = queryClient.getQueryData<UserProfileResponse>([
          "userProfile",
          targetUserId,
        ]);

        // 서버가 reviewCount/favoriteCount를 주지 않는 경우 기존 값을 유지
        const updatedData: UserProfileResponse = {
          id: data.id,
          nickname: data.nickname,
          introduction: data.introduction,
          profileImageUrl: data.profileImageUrl,
          tastePreferences: data.tastePreferences,
          reviewCount: data.reviewCount ?? previousProfile?.reviewCount,
          favoriteCount: data.favoriteCount ?? previousProfile?.favoriteCount,
        };

        // 캐시 업데이트
        queryClient.setQueryData<UserProfileResponse>([
          "userProfile",
          targetUserId,
        ], updatedData);
        
        // 관련 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ["userProfile"],
          exact: false,
        });
      }
    },
    onError: (error) => {
      console.error("프로필 수정 에러:", error);
    },
  });

  return {
    patchProfile: (userId: string, data: PatchProfileRequest) =>
      mutation.mutate({ userId, updateData: data }),
    isLoading: mutation.isPending,
    error: mutation.error ? { message: mutation.error.message } : null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}; 