import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { LoginRequest, LoginResponse, LoginError } from "../../types/auth";
import { AxiosError } from "axios";
import { setUserInfo, UserInfo } from "../../utils/auth";

// 닉네임으로 로그인 요청 (신규 회원 여부 체크 포함)
const loginWithNickname = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post("/users/login", loginData);
    return response.data;
  } catch (error: unknown) {
    console.error("로그인 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      
      // 409 Conflict 또는 404 Not Found: 존재하지 않는 닉네임 (신규 회원)
      // 백엔드에서 신규 회원을 404로 응답하므로 정상적인 플로우로 처리
      if (status === 409 || status === 404) {
        console.log("신규 회원으로 판단 - 회원가입 플로우로 이동");
        return {
          message: "신규 회원",
          user: null,
          isNewUser: true
        };
      }
      
      throw new Error(errorData?.message || `로그인 실패 (${status})`);
    }
    
    throw new Error("네트워크 에러가 발생했습니다.");
  }
};

export interface UsePostLoginResult {
  login: (data: LoginRequest) => void;
  isLoading: boolean;
  error: LoginError | null;
  isSuccess: boolean;
  data: LoginResponse | undefined;
  isNewUser: boolean; // 신규 회원 여부
}

// 로그인 훅 (닉네임 체크 및 사용자 정보 저장)
export const usePostLogin = (): UsePostLoginResult => {
  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginWithNickname,
    onSuccess: (data) => {
      // 기존 회원인 경우에만 사용자 정보 저장
      if (data?.user && !data.isNewUser) {
        console.log("기존 회원 로그인 성공, 사용자 정보 저장");
        const userInfo: UserInfo = {
          id: data.user._id, // 백엔드 _id 필드 사용
          nickname: data.user.nickname,
          tastePreferences: data.user.tastePreferences,
          birthYear: data.user.birthYear,
          gender: data.user.gender,
        };
        setUserInfo(userInfo);
      }
    },
    onError: (error) => {
      console.error("로그인 에러:", error);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? { message: mutation.error.message } : null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    isNewUser: mutation.data?.isNewUser === true,
  };
}; 