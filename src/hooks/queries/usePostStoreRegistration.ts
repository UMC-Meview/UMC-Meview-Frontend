import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { StoreRegistrationRequest, StoreRegistrationResponse } from "../../types/store";

// 가게 등록 API 함수
const registerStore = async (storeData: StoreRegistrationRequest): Promise<StoreRegistrationResponse> => {
    try {
        const response = await axiosClient.post<StoreRegistrationResponse>("/stores", storeData);
        return response.data;
    } catch (error: unknown) {
        // 413 Request Entity Too Large 에러 처리 (이미지가 너무 클 때)
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 'status' in error.response &&
            error.response.status === 413) {
            // 이미지 필드를 제거하고 재시도
            const retryData = { ...storeData };
            delete retryData.mainImage;
            delete retryData.images;
            
            const retryResponse = await axiosClient.post<StoreRegistrationResponse>("/stores", retryData);
            return retryResponse.data;
        }
        
        // 기타 에러의 경우 에러를 다시 던짐
        throw error;
    }
};

// 가게 등록 mutation 훅 반환 타입
export interface UseStoreRegistrationResult {
    mutate: (storeData: StoreRegistrationRequest) => void;
    mutateAsync: (storeData: StoreRegistrationRequest) => Promise<StoreRegistrationResponse>;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: string | null;
    data: StoreRegistrationResponse | undefined;
    reset: () => void;
}

/**
 * 가게 등록 mutation 훅
 */
export const useStoreRegistration = (): UseStoreRegistrationResult => {
    const queryClient = useQueryClient();

    const mutation = useMutation<StoreRegistrationResponse, Error, StoreRegistrationRequest>({
        mutationFn: registerStore,
        onSuccess: (data) => {
            console.log("가게 등록 완료:", data);
            
            // 가게 목록 캐시 무효화 (새로운 가게가 추가되었으므로)
            queryClient.invalidateQueries({ queryKey: ["stores"] });
            
            // 새로 등록된 가게 정보를 캐시에 추가
            queryClient.setQueryData(["store", data._id], data);
        },
        onError: (error) => {
            console.error("가게 등록 실패:", error);
        },
    });

    return {
        mutate: mutation.mutate,
        mutateAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
        error: mutation.error?.message || null,
        data: mutation.data,
        reset: mutation.reset,
    };
}; 