import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { LoginRequest, LoginResponse, LoginError } from "../../types/auth";
import { AxiosError } from "axios";
import { setUserInfo } from "../../utils/auth";
import { UserInfo } from "../../types/auth";

// 닉네임 로그인 (신규 회원 분기 포함)
const loginWithNickname = async (
    loginData: LoginRequest
): Promise<LoginResponse> => {
    try {
        const response = await axiosClient.post("/users/login", loginData);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            // 404 Not Found 또는 409 Conflict: 존재하지 않는 닉네임 (신규 회원)
            if (status === 404 || status === 409) {
                return {
                    message: "신규 회원",
                    user: null,
                    isNewUser: true,
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

// 로그인 훅
export const usePostLogin = (): UsePostLoginResult => {
    const mutation = useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginWithNickname,
        onSuccess: (data) => {
            if (data?.user && !data.isNewUser) {
                const userInfo: UserInfo = {
                    id: data.user._id,
                    nickname: data.user.nickname,
                    tastePreferences: data.user.tastePreferences,
                    birthYear: data.user.birthYear,
                    gender: data.user.gender,
                };
                setUserInfo(userInfo);
            }
        },
        onError: () => {},
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
