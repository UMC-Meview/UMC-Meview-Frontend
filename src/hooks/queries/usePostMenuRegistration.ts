import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { MenuRegistrationRequest, MenuResponseDto } from "../../types/menu";

// 메뉴 등록 API 함수
const registerMenu = async (menuData: MenuRegistrationRequest): Promise<MenuResponseDto> => {
    try {
        const response = await axiosClient.post<MenuResponseDto>("/menus", menuData);
        return response.data;
    } catch (error: unknown) {
        // 413 Request Entity Too Large 에러 처리 (이미지가 너무 클 때)
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 'status' in error.response &&
            error.response.status === 413) {
            // 이미지 필드를 제거하고 재시도
            const retryData = { ...menuData };
            delete retryData.image;
            
            const retryResponse = await axiosClient.post<MenuResponseDto>("/menus", retryData);
            return retryResponse.data;
        }
        
        // 기타 에러의 경우 에러를 다시 던짐
        throw error;
    }
};

// 메뉴 등록 mutation 훅 반환 타입
export interface UseMenuRegistrationResult {
    registerMenu: (menuData: MenuRegistrationRequest) => void;
    registerMenuAsync: (menuData: MenuRegistrationRequest) => Promise<MenuResponseDto>;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: string | null;
    data: MenuResponseDto | undefined;
    reset: () => void;
}

/**
 * 메뉴 등록 mutation 훅
 */
export const usePostMenuRegistration = (): UseMenuRegistrationResult => {
    const queryClient = useQueryClient();

    const mutation = useMutation<MenuResponseDto, Error, MenuRegistrationRequest>({
        mutationFn: registerMenu,
        onSuccess: (data) => {
            // console.log("메뉴 등록 완료:", data);
            
            // 메뉴 목록 캐시 무효화 (새로운 메뉴가 추가되었으므로)
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            
            // 특정 가게의 메뉴 목록 캐시도 무효화
            queryClient.invalidateQueries({ queryKey: ["store", data.storeId, "menus"] });
            
            // 새로 등록된 메뉴 정보를 캐시에 추가
            queryClient.setQueryData(["menu", data._id], data);
        },
        onError: (error) => {
            console.error("메뉴 등록 실패:", error);
        },
    });

    return {
        registerMenu: mutation.mutate,
        registerMenuAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
        error: mutation.error?.message || null,
        data: mutation.data,
        reset: mutation.reset,
    };
}; 