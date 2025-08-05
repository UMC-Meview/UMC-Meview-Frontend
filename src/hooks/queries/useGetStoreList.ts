import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { StoreDetail } from "../../types/store";

// 서버 API에 맞는 정렬 타입
export type ServerSortType =
    | "reviews"
    | "favorites"
    | "distance"
    | "positiveScore";

// 검색/목록 조회 파라미터 인터페이스
export interface StoresParams {
    keyword?: string; // 검색 키워드 (이름, 카테고리, 설명에서 검색)
    category?: string; // 카테고리 필터
    latitude?: number; // 위도 (거리순 정렬 또는 위치 기반 검색 시 필요)
    longitude?: number; // 경도 (거리순 정렬 또는 위치 기반 검색 시 필요)
    radius?: number; // 반경(km) (위치 기반 검색 시 필요)
    sortBy?: ServerSortType; // 정렬 기준
    userId?: string; // 사용자 ID (찜 여부 확인용)
}

// 결과 인터페이스
export interface UseStoresResult {
    stores: StoreDetail[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// 클라이언트 정렬 타입을 서버 정렬 타입으로 매핑
export const mapClientSortToServer = (clientSort: string): ServerSortType => {
    const sortMapping: Record<string, ServerSortType> = {
        "보너스금액 많은 순": "positiveScore",
        "리뷰 많은 순": "reviews",
        "가까운 순": "distance",
        "찜 많은 순": "favorites",
    };
    return sortMapping[clientSort] || "positiveScore";
};

// API 요청 함수
const fetchStores = async (params: StoresParams): Promise<StoreDetail[]> => {
    const { keyword, category, latitude, longitude, radius, sortBy, userId } =
        params;

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams();

    if (keyword) queryParams.append("keyword", keyword);
    if (category) queryParams.append("category", category);
    if (latitude !== undefined)
        queryParams.append("latitude", latitude.toString());
    if (longitude !== undefined)
        queryParams.append("longitude", longitude.toString());
    if (radius !== undefined) queryParams.append("radius", radius.toString());
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (userId) queryParams.append("userId", userId);

    const response = await axiosClient.get(`/stores?${queryParams.toString()}`);
    return response.data;
};

// 더미 데이터 (API 오류 시 사용)
export const DUMMY_STORES: StoreDetail[] = [
    {
        _id: "1",
        location: {
            type: "Point",
            coordinates: [126.978, 37.5665],
        },
        name: "모토이시",
        category: "술집",
        description: "분위기 좋은 일본식 술집입니다.",
        address: "서울시 마포구 홍대길 123",
        operatingHours: "월-금 18:00-02:00, 토-일 17:00-03:00",
        mainImage:
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        images: [
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        ],
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
        reviewCount: 12328,
        averagePositiveScore: 58293,
        averageNegativeScore: 3.2,
        favoriteCount: 15,
        isFavorited: false,
        distance: 0,
    },
    {
        _id: "2",
        location: {
            type: "Point",
            coordinates: [126.977, 37.566],
        },
        name: "이자카야 센",
        category: "술집",
        description: "정통 일본식 이자카야입니다.",
        address: "서울시 마포구 홍대길 456",
        operatingHours: "월-일 17:00-02:00",
        mainImage:
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        images: [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        ],
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
        reviewCount: 8521,
        averagePositiveScore: 45124,
        averageNegativeScore: 2.8,
        favoriteCount: 32,
        isFavorited: true,
        distance: 1000,
    },
    {
        _id: "3",
        location: {
            type: "Point",
            coordinates: [126.976, 37.5655],
        },
        name: "카페 블루",
        category: "카페",
        description: "조용하고 아늑한 카페입니다.",
        address: "서울시 마포구 홍대길 789",
        operatingHours: "월-일 08:00-22:00",
        mainImage:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        images: [
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        ],
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
        reviewCount: 2156,
        averagePositiveScore: 42156,
        averageNegativeScore: 1.5,
        favoriteCount: 8,
        isFavorited: false,
        distance: 2000,
    },
];

// 통합 가게 목록 조회 hook
export const useStores = (
    params: StoresParams = {},
    enabled: boolean = true
): UseStoresResult => {
    const {
        data: stores = [],
        isLoading: loading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: [
            "stores",
            params.keyword,
            params.category,
            params.latitude,
            params.longitude,
            params.radius,
            params.sortBy,
            params.userId,
        ],
        queryFn: () => fetchStores(params),
        enabled: enabled,
        staleTime: 5 * 60 * 1000, // 5분
        retry: 1,
    });

    // 에러 발생 시 더미 데이터 사용
    const effectiveStores = queryError ? DUMMY_STORES : stores;

    // 에러 상태 처리
    const error = queryError
        ? queryError instanceof Error
            ? queryError.message
            : "데이터를 가져오는 중 오류가 발생했습니다."
        : null;

    return {
        stores: effectiveStores,
        loading,
        error,
        refetch,
    };
};

// 각 페이지별 편의 함수들
export const useRankingStores = (enabled: boolean = true) => {
    return useStores({ sortBy: "positiveScore" }, enabled);
};

export const useHomeStores = (
    sortBy: ServerSortType,
    location?: { latitude: number; longitude: number },
    enabled: boolean = true
) => {
    return useStores(
        {
            sortBy,
            latitude: location?.latitude,
            longitude: location?.longitude,
        },
        enabled
    );
};

export const useSearchStores = (
    keyword: string,
    category?: string,
    enabled: boolean = true
) => {
    return useStores({ keyword, category }, enabled && !!keyword);
};
