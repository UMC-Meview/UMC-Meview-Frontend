import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { 
  PatchProfileRequest, 
  PatchProfileResponse, 
  ApiError, 
  UserProfileResponse 
} from "../../types/auth";
import { AxiosError } from "axios";
import { getUserInfo, setUserInfo } from "../../utils/auth";
import { UserInfo } from "../../types/auth";

// 사용자 프로필 수정 API 함수
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
      
      // 스웨거 문서에 명시된 404 에러 처리
      if (status === 404) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      
      // 기타 서버 에러 처리
      throw new Error(errorData?.message || `프로필 수정 실패 (${status})`);
    }
    
    // 네트워크 에러 처리
    throw new Error("네트워크 에러가 발생했습니다.");
  }
};

// 훅 반환 타입 정의
export interface UsePatchUserProfileEditResult {
  patchProfile: (data: PatchProfileRequest) => void;
  isLoading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  data: PatchProfileResponse | undefined;
  reset: () => void;
}

// 사용자 프로필 수정 커스텀 훅
export const usePatchUserProfileEdit = (): UsePatchUserProfileEditResult => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PatchProfileResponse, Error, PatchProfileRequest>({
    mutationFn: (updateData: PatchProfileRequest) => {
      const userInfo = getUserInfo();
      if (!userInfo?.id) {
        throw new Error("로그인이 필요합니다.");
      }
      return patchUserProfile(userInfo.id, updateData);
    },
    onSuccess: (data) => {
      console.log("프로필 수정 성공:", data.nickname);
      
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
      const userInfo = getUserInfo();
      if (userInfo?.id) {
        // 새로운 데이터로 캐시 설정
        const updatedData: UserProfileResponse = {
          id: data.id,
          nickname: data.nickname,
          introduction: data.introduction,
          profileImageUrl: data.profileImageUrl,
          tastePreferences: data.tastePreferences,
          reviewCount: data.reviewCount || 0,
          favoriteCount: data.favoriteCount || 0,
        };
        
        // 캐시 업데이트
        queryClient.setQueryData<UserProfileResponse>(
          ["userProfile", userInfo.id], 
          updatedData
        );
        
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
    patchProfile: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? { message: mutation.error.message } : null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}; 