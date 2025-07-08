export interface Store {
    _id: string;
    latitude: number;
    longitude: number;
    name: string;
    category: string;
    description: string;
    address: string;
    operatingHours: string;
    mainImage?: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}

// 가게 디테일 화면용 확장 타입
export interface StoreDetail extends Store {
    isFavorite?: boolean; // 찜 여부
    bonusAverage: number;
    reviewCount: number;
    distance: number;
    favoriteCount: number;
    menus: string[];
}

export interface CreateStoreDto {
    latitude: number;
    longitude: number;
    name: string;
    category: string;
    description: string;
    address: string;
    operatingHours: string;
    mainImage?: string;
    images?: string[];
}

export type StoreResponseDto = Store[];

export type SortType =
    | "보너스금액 많은 순"
    | "리뷰 많은 순"
    | "가까운 순"
    | "찜 많은 순";
