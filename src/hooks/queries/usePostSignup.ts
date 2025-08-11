import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { SignupRequest, SignupResponse, SignupError } from "../../types/auth";
import { AxiosError } from "axios";
import { setUserInfo } from "../../utils/auth";
import { UserInfo } from "../../types/auth";

// 회원가입 요청
const signupUser = async (signupData: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await axiosClient.post("/users/signup", signupData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      // 409: 닉네임 중복
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
      onSuccess: async (data, variables) => {
        if (data && data.user) {
          const userInfo: UserInfo = {
            id: data.user._id,
            nickname: data.user.nickname,
            tastePreferences: data.user.tastePreferences,
            birthYear: data.user.birthYear,
            gender: data.user.gender,
          };
          setUserInfo(userInfo);
          return;
        }

        // 서버가 user를 안 주면 로그인으로 보완
        try {
          const loginRes = await axiosClient.post("/users/login", { nickname: variables.nickname });
          const loginData = loginRes.data as SignupResponse;
          if (loginData?.user) {
            const userInfo: UserInfo = {
              id: loginData.user._id,
              nickname: loginData.user.nickname,
              tastePreferences: loginData.user.tastePreferences,
              birthYear: loginData.user.birthYear,
              gender: loginData.user.gender,
            };
            setUserInfo(userInfo);
          }
        } catch {
          // 무시: 사용자가 재시도 가능
        }
    },
    onError: () => {},
  });

  return {
    signup: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? { message: mutation.error.message } : null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}; 