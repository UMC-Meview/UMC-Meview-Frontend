import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { FavoriteList } from "../../types/favorite";
import { DUMMY_STORES } from "./useGetStoreList";
import { StoreDetail } from "../../types/store";
import { getUserInfo } from "../../utils/auth";

export interface UseGetFavoriteStoresResult {
    favoriteStores: FavoriteList;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// API 요청 함수
const fetchFavoriteStores = async (userId: string): Promise<FavoriteList> => {
    try {
        const response = await axiosClient.get(`/favorites/${userId}/stores`);
        return response.data;
    } catch (error) {
        console.error("찜한 가게 목록 조회 API 호출 실패:", error);
        throw error;
    }
};

// 더미 데이터 (API 오류 시 사용)
const DUMMY_FAVORITE_STORES: StoreDetail[] = DUMMY_STORES;

export const useGetFavoriteStores = (
    enabled: boolean = true
): UseGetFavoriteStoresResult => {
    // 로컬 스토리지에서 유저 정보 가져오기
    const userInfo = getUserInfo();
    const userId = userInfo?.id || "";

    const {
        data: favoriteStores = [],
        isLoading: loading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: ["favoriteStores", userId],
        queryFn: () => fetchFavoriteStores(userId),
        enabled: enabled && !!userId, // userId가 있고 enabled일 때만 쿼리 실행
        staleTime: 5 * 60 * 1000, // 5분
        retry: 1,
    });

    // 에러 발생 시 더미 데이터 사용
    const effectiveFavoriteStores = queryError
        ? DUMMY_FAVORITE_STORES
        : favoriteStores;

    // 에러 상태 처리
    const error = queryError
        ? queryError instanceof Error
            ? queryError.message
            : "찜한 가게 목록을 가져오는 중 오류가 발생했습니다."
        : null;

    return {
        favoriteStores: effectiveFavoriteStores,
        loading,
        error,
        refetch,
    };
};
