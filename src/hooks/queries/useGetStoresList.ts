import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { StoreDetail, SortType } from "../../types/store";

export interface LocationSearchParams {
    latitude: number;
    longitude: number;
    radius?: number;
}

// Store 타입 확장 (거리 포함)
export interface ExtendedStore extends StoreDetail {
    distance: number;
}

export interface UseStoresResult {
    stores: ExtendedStore[];
    loading: boolean;
    error: string | null;
    sortedStores: ExtendedStore[];
    sortBy: (sortType: SortType) => void;
    fetchStoresByLocation: (params: LocationSearchParams) => void;
}

// 서울시청 기본 좌표
const DEFAULT_LOCATION = {
    latitude: 35.84662,
    longitude: 127.136609,
    radius: 2000, // 2km
};

// 거리 계산 함수
const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리 (km)
};

// API 요청 함수
const fetchStoresByLocation = async (
    params: LocationSearchParams
): Promise<ExtendedStore[]> => {
    const { latitude, longitude } = params;

    const response = await axiosClient.get("/stores");

    const data: StoreDetail[] = response.data;
    console.log(data);

    // API 응답 데이터 구조에 맞게 변환
    return data.map((item: StoreDetail) => ({
        ...item,
        distance: calculateDistance(
            latitude,
            longitude,
            item.location.coordinates[0],
            item.location.coordinates[1]
        ),
        bonusAverage: Math.random() * 5, // 임시 랜덤 값 (추후 실제 API 데이터로 변경)
    }));
};

// 더미 데이터 정의
const DUMMY_STORE: StoreDetail[] = [
    {
        _id: "64f7a1b2c3d4e5f6a7b8c9d0",
        location: {
            type: "Point",
            coordinates: [126.978, 37.5665],
        },
        name: "홍대 맛집",
        category: "술집",
        description: "분위기 좋은 홍대 맛집입니다.",
        address: "서울시 마포구 홍대길 123",
        operatingHours: "월-금 18:00-02:00, 토-일 17:00-03:00",
        mainImage: "https://example.com/main-image.jpg",
        images: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
        ],
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
        menus: [
            {
                _id: "64f7a1b2c3d4e5f6a7b8c9d0",
                name: "김치찌개",
                image: "https://example.com/menu-image.jpg",
                description: "정통 김치찌개입니다.",
                price: 12000,
                storeId: "64f7a1b2c3d4e5f6a7b8c9d0",
                createdAt: "2023-01-01T00:00:00.000Z",
                updatedAt: "2023-01-01T00:00:00.000Z",
            },
        ],
        reviews: [
            {
                _id: "64f7a1b2c3d4e5f6a7b8c9d0",
                store: "64f7a1b2c3d4e5f6a7b8c9d0",
                user: "64f7a1b2c3d4e5f6a7b8c9d0",
                isPositive: true,
                score: 8,
                foodReviews: ["음식이 맛있어요", "양이 푸짐해요"],
                storeReviews: ["매장이 청결해요", "직원이 친절해요"],
                imageUrl: "https://example.com/image.jpg",
                createdAt: "2025-07-11T12:31:43.263Z",
                updatedAt: "2025-07-11T12:31:43.263Z",
            },
        ],
        averagePositiveScore: 8.5,
        averageNegativeScore: 3.2,
        favoriteCount: 15,
        isFavorited: true,
    },
];

export const useGetStoresList = (
    searchParams: LocationSearchParams = DEFAULT_LOCATION,
    enabled: boolean = true
): UseStoresResult => {
    const [sortedStores, setSortedStores] = useState<ExtendedStore[]>([]);

    // searchParams를 직접 사용하되, queryKey는 안정화
    const stableQueryKey = useMemo(
        () => [
            "stores",
            searchParams.latitude,
            searchParams.longitude,
            searchParams.radius,
        ],
        [searchParams.latitude, searchParams.longitude, searchParams.radius]
    );

    const {
        data: rawStores,
        isLoading: loading,
        error: queryError,
    } = useQuery({
        queryKey: stableQueryKey,
        queryFn: () => fetchStoresByLocation(searchParams),
        staleTime: 5 * 60 * 1000, // 5분
        retry: 1,
        enabled: enabled, // BottomSheet가 확장된 상태일 때만 쿼리 실행
    });

    // 에러 발생 시 더미 데이터 사용, 성공 시 실제 데이터 사용
    const stores: ExtendedStore[] = useMemo(() => {
        return queryError
            ? DUMMY_STORE.map((item: StoreDetail) => ({
                  ...item,
                  distance: calculateDistance(
                      searchParams.latitude,
                      searchParams.longitude,
                      item.location.coordinates[0],
                      item.location.coordinates[1]
                  ),
                  bonusAverage: Math.random() * 5, // 임시 랜덤 값
              }))
            : rawStores || [];
    }, [queryError, rawStores, searchParams.latitude, searchParams.longitude]);

    // 에러 상태 처리
    const error = queryError
        ? queryError instanceof Error
            ? queryError.message
            : "데이터를 가져오는 중 오류가 발생했습니다."
        : null;

    // 정렬 함수
    const sortBy = useCallback(
        (sortType: SortType) => {
            const sorted = [...stores].sort((a, b) => {
                switch (sortType) {
                    case "보너스금액 많은 순":
                        return (
                            (b.averagePositiveScore || 0) -
                            (a.averagePositiveScore || 0)
                        );
                    case "리뷰 많은 순":
                        return Math.random() - 0.5;
                    case "가까운 순":
                        return (a.distance || 0) - (b.distance || 0);
                    case "찜 많은 순":
                        return Math.random() - 0.5;
                    default:
                        return 0;
                }
            });
            setSortedStores(sorted);
        },
        [stores]
    );

    // 위치 기반 가게 재검색 함수 - refetch 제거
    const fetchStoresByLocationHandler = useCallback(
        (params: LocationSearchParams) => {
            // 새로운 params로 컴포넌트를 다시 렌더링하도록 상위에서 처리
            console.log("새로운 위치로 검색:", params);
        },
        []
    );

    // stores가 변경될 때마다 sortedStores 업데이트
    const effectiveSortedStores =
        sortedStores.length > 0 ? sortedStores : stores;

    return {
        stores,
        loading,
        error,
        sortedStores: effectiveSortedStores,
        sortBy,
        fetchStoresByLocation: fetchStoresByLocationHandler,
    };
};
