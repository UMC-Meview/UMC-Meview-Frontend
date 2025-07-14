import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { SignupRequest, SignupResponse, SignupError } from "../../types/auth";
import { AxiosError } from "axios";
import { setUserInfo, UserInfo } from "../../utils/auth";

// 회원가입 API 요청
const signupUser = async (signupData: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await axiosClient.post("/users/signup", signupData);
    return response.data;
  } catch (error: unknown) {
    console.error("회원가입 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      
      // 409 Conflict: 중복된 닉네임
      if (status === 409) {
        throw new Error("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
      }
      
      throw new Error(errorData?.message || `회원가입 실패 (${status})`);
    }
    
    throw new Error("네트워크 에러가 발생했습니다. 다시 시도해주세요.");
  }
};

export interface UsePostSignupResult {
  signup: (data: SignupRequest) => void;
  isLoading: boolean;
  error: SignupError | null;
  isSuccess: boolean;
  data: SignupResponse | undefined;
}

export const usePostSignup = (): UsePostSignupResult => {
  const mutation = useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signupUser,
    onSuccess: (data) => {
      console.log("회원가입 성공, 사용자 정보 저장");
      
      if (!data) {
        console.error("회원가입 응답 데이터가 없습니다");
        return;
      }
      
      // 사용자 정보 저장
      const userInfo: UserInfo = {
        id: data._id,
        nickname: data.nickname,
        tastePreferences: data.tastePreferences,
        birthYear: data.birthYear,
        gender: data.gender,
      };
      setUserInfo(userInfo);
    },
    onError: (error) => {
      console.error("회원가입 에러:", error);
    },
  });

  return {
    signup: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? { message: mutation.error.message } : null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}; 