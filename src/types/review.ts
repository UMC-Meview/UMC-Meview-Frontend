import { User } from "./auth";

// 기존 타입들 (하위 호환성 유지)
export interface CreateReviewDto {
    storeId: string;
    userId: string;
    isPositive: boolean;
    score: number;
    foodReviews: string[];
    storeReviews: string[];
    imageUrl: string;
}

export interface ReviewResponseDto {
    _id: string;
    store: string;
    user: User;
    isPositive: boolean;
    score: number;
    foodReviews: string[];
    storeReviews: string[];
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

// 리뷰 요약 응답 타입
export interface ReviewSummaryResponseDto {
    totalPositiveScore: number;
    totalNegativeScore: number;
    positiveCount: number;
    negativeCount: number;
    avgPositiveScore: number;
    avgNegativeScore: number;
}


