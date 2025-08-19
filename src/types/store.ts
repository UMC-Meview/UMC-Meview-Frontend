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
    mainImage?: string[]; // 대표 이미지들 (배열)
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
    distance?: number;
}

export interface StoreRegistrationRequest {
    location: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
    };
    name: string;
    category: string;
    description: string;
    address: string;
    operatingHours: string;
    mainImage?: string[]; 
    images?: string[];  
    qrPrefix: string; 
}

export interface StoreRegistrationResponse {
    _id: string;
    location: Location;
    name: string;
    category: string;
    description: string;
    address: string;
    operatingHours: string;
    mainImage: string[];
    images: string[];
    createdAt: string;
    updatedAt: string;
    menus: MenuResponseDto[];
    reviews: ReviewResponseDto[];
    reviewCount: number;
    averagePositiveScore: number;
    averageNegativeScore: number;
    favoriteCount: number;
    isFavorited: boolean;
    qrCodeBase64: string;
    distance: number;
}

export type SortType =
    | "보너스금액 많은 순"
    | "리뷰 많은 순"
    | "가까운 순"
    | "찜 많은 순";

export interface StoreFormData {
  storeName: string;
  category: string;
  description: string;
  address: string;
  detailAddress: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  openingHours: string[];
  mainImages: File[];
  menuList: {
    name: string;
    price: string;
    detail: string;
    image: File | null;
  }[];
}
