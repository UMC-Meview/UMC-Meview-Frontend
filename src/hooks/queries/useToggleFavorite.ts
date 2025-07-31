import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import {
    ToggleFavoriteRequest,
    EnableFavoriteResponse,
    DisableFavoriteResponse,
    FavoriteList,
} from "../../types/favorite";
import { StoreDetail } from "../../types/store";
import { getUserInfo } from "../../utils/auth";
import { AxiosError } from "axios";

// 찜하기 API 요청
const addFavorite = async (
    request: ToggleFavoriteRequest
): Promise<EnableFavoriteResponse> => {
    try {
        const response = await axiosClient.post("/favorites", request);
        return response.data;
    } catch (error: unknown) {
        console.error("찜하기 API 호출 실패:", error);

        if (error instanceof AxiosError && error.response) {
            const errorData = error.response.data;
            throw new Error(errorData?.message || "찜하기에 실패했습니다.");
        }

        throw new Error("네트워크 에러가 발생했습니다. 다시 시도해주세요.");
    }
};

// 찜해제 API 요청
const removeFavorite = async (
    request: ToggleFavoriteRequest
): Promise<DisableFavoriteResponse> => {
    try {
        const response = await axiosClient.delete("/favorites", {
            data: request,
        });
        return response.data;
    } catch (error: unknown) {
        console.error("찜해제 API 호출 실패:", error);

        if (error instanceof AxiosError && error.response) {
            const errorData = error.response.data;
            throw new Error(errorData?.message || "찜해제에 실패했습니다.");
        }

        throw new Error("네트워크 에러가 발생했습니다. 다시 시도해주세요.");
    }
};

// Context 타입 정의
interface MutationContext {
    previousFavorites?: FavoriteList;
    previousStoreDetail?: StoreDetail;
}

export interface UseAddFavoriteResult {
    addFavorite: (storeId: string) => void;
    isLoading: boolean;
    error: { message: string } | null;
}

export interface UseRemoveFavoriteResult {
    removeFavorite: (storeId: string) => void;
    isLoading: boolean;
    error: { message: string } | null;
}

// 찜하기 훅
export const useAddFavorite = (): UseAddFavoriteResult => {
    const queryClient = useQueryClient();
    const userInfo = getUserInfo();
    const userId = userInfo?.id || "";

    const mutation = useMutation<
        EnableFavoriteResponse,
        Error,
        string,
        MutationContext
    >({
        mutationFn: (storeId: string) => addFavorite({ storeId, userId }),

        onMutate: async (storeId: string) => {
            // 모든 관련 쿼리 무효화 취소
            await queryClient.cancelQueries({
                queryKey: ["favoriteStores", userId],
            });
            await queryClient.cancelQueries({
                queryKey: ["store", storeId],
            });

            // 이전 데이터 백업
            const previousFavorites = queryClient.getQueryData<FavoriteList>([
                "favoriteStores",
                userId,
            ]);
            const previousStoreDetail = queryClient.getQueryData<StoreDetail>([
                "store",
                storeId,
                userId,
            ]);

            // Optimistic Update: store detail의 isFavorited 상태 업데이트
            if (previousStoreDetail) {
                queryClient.setQueryData<StoreDetail>(
                    ["store", storeId, userId],
                    {
                        ...previousStoreDetail,
                        isFavorited: true,
                        favoriteCount:
                            (previousStoreDetail.favoriteCount || 0) + 1,
                    }
                );
            }

            return { previousFavorites, previousStoreDetail };
        },

        onError: (error, storeId, context) => {
            // 에러 발생 시 이전 상태로 rollback
            if (context?.previousFavorites) {
                queryClient.setQueryData(
                    ["favoriteStores", userId],
                    context.previousFavorites
                );
            }
            if (context?.previousStoreDetail) {
                queryClient.setQueryData(
                    ["store", storeId, userId],
                    context.previousStoreDetail
                );
            }
            console.error("찜하기 실패:", error);
        },

        onSettled: (storeId) => {
            // 성공/실패와 관계없이 쿼리 다시 가져오기
            queryClient.invalidateQueries({
                queryKey: ["favoriteStores", userId],
            });
            queryClient.invalidateQueries({
                queryKey: ["store", storeId],
            });
        },
    });

    return {
        addFavorite: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error ? { message: mutation.error.message } : null,
    };
};

// 찜해제 훅
export const useRemoveFavorite = (): UseRemoveFavoriteResult => {
    const queryClient = useQueryClient();
    const userInfo = getUserInfo();
    const userId = userInfo?.id || "";

    const mutation = useMutation<
        DisableFavoriteResponse,
        Error,
        string,
        MutationContext
    >({
        mutationFn: (storeId: string) => removeFavorite({ storeId, userId }),

        onMutate: async (storeId: string) => {
            // 모든 관련 쿼리 무효화 취소
            await queryClient.cancelQueries({
                queryKey: ["favoriteStores", userId],
            });
            await queryClient.cancelQueries({
                queryKey: ["store", storeId],
            });

            // 이전 데이터 백업
            const previousFavorites = queryClient.getQueryData<FavoriteList>([
                "favoriteStores",
                userId,
            ]);
            const previousStoreDetail = queryClient.getQueryData<StoreDetail>([
                "store",
                storeId,
                userId,
            ]);

            // Optimistic Update: 찜 목록에서 제거
            queryClient.setQueryData<FavoriteList>(
                ["favoriteStores", userId],
                (old) => {
                    if (!old) return old;
                    return old.filter((store) => store._id !== storeId);
                }
            );

            // Optimistic Update: store detail의 isFavorited 상태 업데이트
            if (previousStoreDetail) {
                queryClient.setQueryData<StoreDetail>(
                    ["store", storeId, userId],
                    {
                        ...previousStoreDetail,
                        isFavorited: false,
                        favoriteCount: Math.max(
                            (previousStoreDetail.favoriteCount || 0) - 1,
                            0
                        ),
                    }
                );
            }

            return { previousFavorites, previousStoreDetail };
        },

        onError: (error, storeId, context) => {
            // 에러 발생 시 이전 상태로 rollback
            if (context?.previousFavorites) {
                queryClient.setQueryData(
                    ["favoriteStores", userId],
                    context.previousFavorites
                );
            }
            if (context?.previousStoreDetail) {
                queryClient.setQueryData(
                    ["store", storeId, userId],
                    context.previousStoreDetail
                );
            }
            console.error("찜해제 실패:", error);
        },

        onSettled: (storeId) => {
            queryClient.invalidateQueries({
                queryKey: ["favoriteStores", userId],
            });
            queryClient.invalidateQueries({
                queryKey: ["store", storeId],
            });
        },
    });

    return {
        removeFavorite: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error ? { message: mutation.error.message } : null,
    };
};

// 통합 toggle 훅 (찜 상태에 따라 자동으로 add/remove 결정)
export interface UseToggleFavoriteResult {
    toggleFavorite: (storeId: string, isFavorited: boolean) => void;
    isLoading: boolean;
    error: { message: string } | null;
}

export const useToggleFavorite = (): UseToggleFavoriteResult => {
    const {
        addFavorite,
        isLoading: isAddLoading,
        error: addError,
    } = useAddFavorite();
    const {
        removeFavorite,
        isLoading: isRemoveLoading,
        error: removeError,
    } = useRemoveFavorite();

    const toggleFavorite = (storeId: string, isFavorited: boolean) => {
        if (isFavorited) {
            removeFavorite(storeId);
        } else {
            addFavorite(storeId);
        }
    };

    return {
        toggleFavorite,
        isLoading: isAddLoading || isRemoveLoading,
        error: addError || removeError,
    };
};
