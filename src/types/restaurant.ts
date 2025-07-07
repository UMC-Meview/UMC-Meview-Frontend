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

export type StoreResponseDto = Restaurant[];

export type SortType =
    | "보너스금액 많은 순"
    | "리뷰 많은 순"
    | "가까운 순"
    | "찜 많은 순";


