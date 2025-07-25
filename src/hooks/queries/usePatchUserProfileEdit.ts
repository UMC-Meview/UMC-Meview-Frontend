import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { PatchProfileResponse, ApiError, UserProfileResponse } from "../../types/auth";
import { AxiosError } from "axios";
import { getUserInfo, setUserInfo, UserInfo } from "../../utils/auth";

// 프로필 수정 요청 타입
export interface PatchProfileRequest {
  nickname?: string;
  introduction?: string;
  profileImageUrl?: string;
  tastePreferences?: string[];
}

// 사용자 프로필 수정 API
const patchUserProfile = async (updateData: PatchProfileRequest): Promise<PatchProfileResponse> => {
  const userInfo = getUserInfo();
  
  if (!userInfo?.id) {
    throw new Error("로그인이 필요합니다.");
  }

  // 디버깅용 로그
  console.log("프로필 수정 요청 데이터:", updateData);
  console.log("사용자 ID:", userInfo.id);

  try {
    const response = await axiosClient.patch(`/users/${userInfo.id}/profile`, updateData);
    console.log("프로필 수정 응답:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("사용자 정보 수정 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      console.error("에러 상세 정보:", error.response);
      
      if (status === 404) {
        throw new Error("사용자를 찾을 수 없습니다.");
      } else if (status === 409) {
        throw new Error("이미 사용 중인 닉네임입니다.");
      } else if (status === 500) {
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else if (status >= 400 && status < 500) {
        throw new Error(errorData?.message || "잘못된 요청입니다. 입력 정보를 확인해주세요.");
      }
      
      throw new Error(errorData?.message || `프로필 수정 실패 (${status})`);
    }
    
    if (error instanceof AxiosError && error.request) {
      throw new Error("네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.");
    }
    
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export interface UsePatchUserProfileEditResult {
  patchProfile: (data: PatchProfileRequest) => void;
  isLoading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  data: PatchProfileResponse | undefined;
  reset: () => void;
}

// 사용자 프로필 수정 훅
export const usePatchUserProfileEdit = (): UsePatchUserProfileEditResult => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PatchProfileResponse, Error, PatchProfileRequest>({
    mutationFn: patchUserProfile,
    onSuccess: (data) => {
      console.log("프로필 수정 성공:", data.message);
      
      if (!data?.user) {
        console.error("프로필 수정 응답에 사용자 데이터가 없습니다");
        return;
      }
      
      // localStorage에 기본 사용자 정보 업데이트 (기존 정보 유지하면서 닉네임과 취향만 업데이트)
      const currentUserInfo = getUserInfo();
      if (currentUserInfo) {
        const updatedUserInfo: UserInfo = {
          ...currentUserInfo,
          nickname: data.user.nickname,
          tastePreferences: data.user.tastePreferences,
        };
        setUserInfo(updatedUserInfo);
      }
      
      // React Query 캐시 강제 업데이트
      const userInfo = getUserInfo();
      if (userInfo?.id) {
        // 기존 캐시 완전 제거
        queryClient.removeQueries({ 
          queryKey: ["userProfile"], 
          exact: false 
        });
        
        // 새로운 데이터로 캐시 설정
        const updatedData: UserProfileResponse = {
          _id: userInfo.id,
          nickname: data.user.nickname,
          introduction: data.user.introduction,
          profileImageUrl: data.user.profileImageUrl,
          tastePreferences: data.user.tastePreferences,
          reviewCount: data.user.reviewCount || 0,
          favoriteCount: data.user.favoriteCount || 0,
        };
        
        console.log("새로운 캐시 데이터 설정:", updatedData);
        
        // 새 데이터로 캐시 설정
        queryClient.setQueryData<UserProfileResponse>(["userProfile", userInfo.id], updatedData);
        
        // 강제로 모든 프로필 관련 쿼리 즉시 리페치
        setTimeout(() => {
          queryClient.refetchQueries({ 
            queryKey: ["userProfile"],
            exact: false,
            type: 'active'
          });
        }, 50);
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