export interface Restaurant {
    _id: string;
    latitude: number;
    longitude: number;
    name: string;
    category: string;
    description: string;
    address: string;
    operatingHours: string;
    mainImage: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

// 레스토랑 디테일 화면용 확장 타입
export interface RestaurantDetail extends Restaurant {
    phone?: string;
    bonusAverage: number;
    menu: string[]; // 메뉴 리스트
    rating?: number;
    reviewCount?: number;
    isFavorite?: boolean; // 찜 여부
    operatingHoursDetail?: {
        weekdays?: string; // 월-금
        saturday?: string; // 토요일
        sunday?: string; // 일요일
        holiday?: string; // 공휴일
        notice?: string; // 특별 공지 (연중무휴 등)
    };
    reviews?: Array<{
        id: string;
        author: string;
        rating: number;
        content: string;
        date: string;
    }>;
}

export type StoreResponseDto = Restaurant[];

export type SortType =
    | "보너스금액 많은 순"
    | "리뷰 많은 순"
    | "가까운 순"
    | "찜 많은 순";
