import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { StoreDetail } from "../../types/store";
import { getUserInfo } from "../../utils/auth";

export interface UseStoreDetailResult {
    store: StoreDetail | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// API 요청 함수 - userId를 쿼리 파라미터로 전달
const fetchStoreDetail = async (
    storeId: string,
    userId?: string
): Promise<StoreDetail> => {
    const params = userId ? { userId } : {};
    const response = await axiosClient.get(`/stores/${storeId}`, { params });
    console.log(response.data);
    return response.data;
};

// 더미 데이터 (API 실패 시 사용)
const createDummyStoreDetail = (storeId: string): StoreDetail => ({
    _id: storeId,
    location: {
        type: "Point",
        coordinates: [127.136609, 35.84662],
    },
    name: "맛있는 한식당",
    category: "한식",
    address: "전북특별자치도 전주시 덕진구 백제대로 567",
    operatingHours: "월-토 10:00 ~ 20:00, 일 10:00 ~ 20:00",
    mainImage: "https://via.placeholder.com/300x200",
    images: [
        "https://via.placeholder.com/300x200/FF6B6B",
        "https://via.placeholder.com/300x200/4ECDC4",
        "https://via.placeholder.com/300x200/45B7D1",
        "https://via.placeholder.com/300x200/96CEB4",
    ],
    description:
        "정통 한식을 맛볼 수 있는 맛집입니다. 신선한 재료로 정성스럽게 만든 음식을 제공합니다.",
    reviewCount: 128,
    averagePositiveScore: 4.2,
    averageNegativeScore: 3.8,
    favoriteCount: 128,
    isFavorited: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
});

export const useGetStoreDetail = (storeId: string): UseStoreDetailResult => {
    // 로컬 스토리지에서 유저 정보 가져오기
    const userInfo = getUserInfo();
    const userId = userInfo?.id;

    const {
        data: rawStore,
        isLoading: loading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: ["store", storeId, userId], // userId도 쿼리 키에 포함
        queryFn: () => fetchStoreDetail(storeId, userId),
        enabled: !!storeId, // storeId가 있을 때만 쿼리 실행
        staleTime: 5 * 60 * 1000, // 5분
        retry: 1,
    });

    // 에러 발생 시 더미 데이터 사용, 성공 시 실제 데이터 사용
    const store: StoreDetail | null = useMemo(() => {
        if (!storeId) return null;

        return queryError ? createDummyStoreDetail(storeId) : rawStore || null;
    }, [queryError, rawStore, storeId]);

    // 에러 상태 처리
    const error = queryError
        ? queryError instanceof Error
            ? queryError.message
            : "가게 상세 정보를 가져오는 중 오류가 발생했습니다."
        : null;

    return {
        store,
        loading,
        error,
        refetch,
    };
};
