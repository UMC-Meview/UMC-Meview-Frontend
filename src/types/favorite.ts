import { StoreDetail } from "./store";

// FavoriteResponseDto 타입 정의
export interface FavoriteResponseDto {
    _id: string;
    user: string;
    store: string;
    createdAt: string;
    updatedAt: string;
}

// 찜하기/해제 요청 타입
export interface ToggleFavoriteRequest {
    storeId: string;
    userId: string;
}

// 찜해제 응답 타입
export interface DisableFavoriteResponse {
    statusCode?: number;
    message: string;
}

// 찜하기 응답 타입
export type EnableFavoriteResponse =
    | FavoriteResponseDto // 성공
    | {
          message: string;
          error?: string;
          statusCode?: number;
      }; // 실패

export type FavoriteList = StoreDetail[];
