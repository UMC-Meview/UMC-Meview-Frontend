import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { MenuRegistrationRequest, MenuRegistrationResponse } from "../../types/store";
import { AxiosError } from "axios";

// 메뉴 등록 API 요청
const registerMenu = async (menuData: MenuRegistrationRequest): Promise<MenuRegistrationResponse> => {
  try {
    const response = await axiosClient.post("/menus", menuData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return response.data;
  } catch (error: unknown) {
    console.error("메뉴 등록 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      
      if (status === 400) {
        throw new Error("메뉴 정보를 확인해주세요.");
      }
      
      if (status === 401) {
        throw new Error("로그인이 필요합니다.");
      }
      
      throw new Error(errorData?.message || `메뉴 등록 실패 (${status})`);
    }
    
    throw new Error("네트워크 에러가 발생했습니다. 다시 시도해주세요.");
  }
};

// 메뉴 등록 훅 반환 타입
export interface UsePostMenuRegistrationResult {
  registerMenu: (data: MenuRegistrationRequest) => void;
  isLoading: boolean;
  error: { message: string } | null;
  isSuccess: boolean;
  data: MenuRegistrationResponse | undefined;
}

export const usePostMenuRegistration = (): UsePostMenuRegistrationResult => {
  const mutation = useMutation<MenuRegistrationResponse, Error, MenuRegistrationRequest>({
    mutationFn: registerMenu,
    onSuccess: (data) => {
      console.log("메뉴 등록 성공:", data);
    },
    onError: (error) => {
      console.error("메뉴 등록 에러:", error);
    },
  });

  return {
    registerMenu: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? { message: mutation.error.message } : null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}; 