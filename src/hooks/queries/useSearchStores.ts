import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { StoreDetail } from "../../types/store";

// 검색 파라미터 인터페이스
export interface SearchStoresParams {
    keyword: string; // 필수
    category?: string; // 선택사항
    latitude?: number; // 선택사항
    longitude?: number; // 선택사항
    radius?: number; // 선택사항 (km)
}

// 검색 결과 인터페이스
export interface UseSearchStoresResult {
    stores: StoreDetail[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// API 요청 함수
const searchStores = async (
    params: SearchStoresParams
): Promise<StoreDetail[]> => {
    const { keyword, category, latitude, longitude, radius } = params;

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams();
    queryParams.append("keyword", keyword);

    if (category) queryParams.append("category", category);
    if (latitude !== undefined)
        queryParams.append("latitude", latitude.toString());
    if (longitude !== undefined)
        queryParams.append("longitude", longitude.toString());
    if (radius !== undefined) queryParams.append("radius", radius.toString());

    const response = await axiosClient.get(`/stores?${queryParams.toString()}`);
    return response.data;
};

// 통합 검색 hook
export const useSearchStores = (
    params: SearchStoresParams,
    enabled: boolean = true
): UseSearchStoresResult => {
    const {
        data: stores = [],
        isLoading: loading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: [
            "searchStores",
            params.keyword,
            params.category,
            params.latitude,
            params.longitude,
            params.radius,
        ],
        queryFn: () => searchStores(params),
        enabled: enabled && !!params.keyword, // keyword가 있을 때만 실행
        staleTime: 5 * 60 * 1000, // 5분
        retry: 1,
    });

    // 에러 상태 처리
    const error = queryError
        ? queryError instanceof Error
            ? queryError.message
            : "검색 중 오류가 발생했습니다."
        : null;

    return {
        stores,
        loading,
        error,
        refetch,
    };
};
