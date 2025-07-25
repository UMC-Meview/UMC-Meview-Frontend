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

// 가게 등록 관련 타입들 (백엔드 API 명세에 맞춤)
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
    mainImage?: string; // 선택사항으로 변경
    images?: string[];  // 선택사항으로 변경
}

export interface StoreRegistrationResponse {
    _id: string;
    location: Location;
    name: string;
    category: string;
    description: string;
    address: string;
    operatingHours: string;
    mainImage: string;
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
    qrCodeFilePath: string;
}

export type StoreResponseDto = StoreDetail[];

export type SortType =
    | "보너스금액 많은 순"
    | "리뷰 많은 순"
    | "가까운 순"
    | "찜 많은 순";

// 메뉴 등록 요청 타입
export interface MenuRegistrationRequest {
  name: string;
  image?: string;
  description: string;
  price: number;
  storeId: string;
}

// 메뉴 등록 응답 타입
export interface MenuRegistrationResponse {
  _id: string;
  name: string;
  image?: string;
  description: string;
  price: number;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}
