import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { StoreRegistrationRequest, StoreRegistrationResponse } from "../../types/store";
import { AxiosError } from "axios";

// 가게 등록 API 요청
const registerStore = async (storeData: StoreRegistrationRequest): Promise<StoreRegistrationResponse> => {
  try {
    const response = await axiosClient.post("/stores", storeData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return response.data;
  } catch (error: unknown) {
    console.error("가게 등록 API 호출 실패:", error);
    
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`API 에러 - Status: ${status}`, errorData);
      
      // 400 Bad Request: 잘못된 요청 데이터
      if (status === 400) {
        throw new Error("입력 정보를 확인해주세요.");
      }
      
      // 401 Unauthorized: 인증 실패
      if (status === 401) {
        throw new Error("로그인이 필요합니다.");
      }
      
      // 409 Conflict: 중복된 가게명
      if (status === 409) {
        throw new Error("이미 등록된 가게명입니다.");
      }
      
      throw new Error(errorData?.message || `가게 등록 실패 (${status})`);
    }
    
    throw new Error("네트워크 에러가 발생했습니다. 다시 시도해주세요.");
  }
};

// 가게 등록 훅 반환 타입
export interface UsePostStoreRegistrationResult {
  registerStore: (data: StoreRegistrationRequest) => void;
  isLoading: boolean;
  error: { message: string } | null;
  isSuccess: boolean;
  data: StoreRegistrationResponse | undefined;
}

export const usePostStoreRegistration = (): UsePostStoreRegistrationResult => {
  const mutation = useMutation<StoreRegistrationResponse, Error, StoreRegistrationRequest>({
    mutationFn: registerStore,
    onSuccess: (data) => {
      console.log("가게 등록 성공:", data);
    },
    onError: (error) => {
      console.error("가게 등록 에러:", error);
    },
  });

  return {
    registerStore: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? { message: mutation.error.message } : null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}; 