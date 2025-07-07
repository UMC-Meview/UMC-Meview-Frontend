import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../services/apis/axiosClients";
import { Restaurant, SortType } from "../../types/restaurant";

export interface LocationSearchParams {
    latitude: number;
    longitude: number;
    radius?: number;
}

// Restaurant 타입 확장 (거리와 보너스 평점 포함)
export interface ExtendedRestaurant extends Restaurant {
    distance: number;
    bonusAverage: number;
}

export interface UseRestaurantsResult {
    restaurants: ExtendedRestaurant[];
    loading: boolean;
    error: string | null;
    sortedRestaurants: ExtendedRestaurant[];
    sortBy: (sortType: SortType) => void;
    fetchRestaurantsByLocation: (params: LocationSearchParams) => void;
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
const fetchRestaurantsByLocation = async (
    params: LocationSearchParams
): Promise<ExtendedRestaurant[]> => {
    const { latitude, longitude } = params;

    const response = await axiosClient.get("/stores", {
        // params: {
        //     latitude: latitude.toString(),
        //     longitude: longitude.toString(),
        //     radius: radius.toString(),
        // },
    });

    const data: Restaurant[] = response.data;

    // API 응답 데이터 구조에 맞게 변환
    return data.map((item: Restaurant) => ({
        ...item,
        distance: calculateDistance(
            latitude,
            longitude,
            item.latitude,
            item.longitude
        ),
        bonusAverage: Math.random() * 5, // 임시 랜덤 값 (추후 실제 API 데이터로 변경)
    }));
};

// 더미 데이터 정의
const DUMMY_RESTAURANTS: Restaurant[] = [
    {
        _id: "686928268368dd40403f609f",
        latitude: 35.84662,
        longitude: 127.136609,
        name: "공대 7호관",
        category: "지식 맛집",
        description: "많은 것을 배워갈 수 있는 꿈의 공간입니다.",
        address: "전북특별자치도 전주시 덕진구 백제대로 567",
        operatingHours: "월-금 0:00-24:00, 토-일 00:00-24:00",
        mainImage:
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npJ442WJZHH8gTz1y6u9btL3Io3cBDgS5dXnYxPyUw90gO1iiGd-eOgtuLSgsoQj34Lp2aE_OQ-n32rm7O84IR64brl9jlC9CbrbExMyLChxqF8qSUeEB-qwdh3PFi7n-u4Tybicw=s1360-w1360-h1020-rw",
        createdAt: "2025-07-05T13:27:02.689Z",
        updatedAt: "2025-07-05T14:48:14.851Z",
        images: [
            "https://www.jbnu.ac.kr/resources/user/web/img/sub/campus_guide_map_20241021_3.jpg",
        ],
    },
];

export const useGetRestaurantsList = (
    searchParams: LocationSearchParams = DEFAULT_LOCATION
): UseRestaurantsResult => {
    const [sortedRestaurants, setSortedRestaurants] = useState<
        ExtendedRestaurant[]
    >([]);
    const [currentSearchParams, setCurrentSearchParams] =
        useState(searchParams);

    const {
        data: rawRestaurants,
        isLoading: loading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: ["restaurants", currentSearchParams],
        queryFn: () => fetchRestaurantsByLocation(currentSearchParams),
        staleTime: 5 * 60 * 1000, // 5분
        retry: 1,
    });

    // 에러 발생 시 더미 데이터 사용, 성공 시 실제 데이터 사용
    const restaurants: ExtendedRestaurant[] = useMemo(() => {
        return queryError
            ? DUMMY_RESTAURANTS.map((item: Restaurant) => ({
                  ...item,
                  distance: calculateDistance(
                      currentSearchParams.latitude,
                      currentSearchParams.longitude,
                      item.latitude,
                      item.longitude
                  ),
                  bonusAverage: Math.random() * 5, // 임시 랜덤 값
              }))
            : rawRestaurants || [];
    }, [
        queryError,
        rawRestaurants,
        currentSearchParams.latitude,
        currentSearchParams.longitude,
    ]);

    // 에러 상태 처리
    const error = queryError
        ? queryError instanceof Error
            ? queryError.message
            : "데이터를 가져오는 중 오류가 발생했습니다."
        : null;

    // 정렬 함수
    const sortBy = useCallback(
        (sortType: SortType) => {
            const sorted = [...restaurants].sort((a, b) => {
                switch (sortType) {
                    case "보너스금액 많은 순":
                        return (b.bonusAverage || 0) - (a.bonusAverage || 0);
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
            setSortedRestaurants(sorted);
        },
        [restaurants]
    );

    // 위치 기반 레스토랑 재검색 함수
    const fetchRestaurantsByLocationHandler = useCallback(
        (params: LocationSearchParams) => {
            setCurrentSearchParams(params);
            refetch();
        },
        [refetch]
    );

    // restaurants가 변경될 때마다 sortedRestaurants 업데이트
    const effectiveSortedRestaurants =
        sortedRestaurants.length > 0 ? sortedRestaurants : restaurants;

    return {
        restaurants,
        loading,
        error,
        sortedRestaurants: effectiveSortedRestaurants,
        sortBy,
        fetchRestaurantsByLocation: fetchRestaurantsByLocationHandler,
    };
};
