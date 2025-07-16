import { MenuResponseDto } from "./menu";
import { ReviewResponseDto } from "./review";

export interface Location {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
}

export interface StoreDetail {
    _id: string;
    location: Location;
    name: string;
    category: string;
    description: string;
    address: string;
    operatingHours: string;
    mainImage?: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
    menus?: MenuResponseDto[];
    reviews?: ReviewResponseDto[];
    reviewCount?: number;
    averagePositiveScore?: number;
    averageNegativeScore?: number;
    favoriteCount?: number;
    isFavorited?: boolean;
}

export type StoreResponseDto = StoreDetail[];

export type SortType =
    | "보너스금액 많은 순"
    | "리뷰 많은 순"
    | "가까운 순"
    | "찜 많은 순";
