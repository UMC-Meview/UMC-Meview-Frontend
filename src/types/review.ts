import { User } from "./Auth";

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

export interface ReviewSummaryResponseDto {
    totalPositiveScore: number;
    totalNegativeScore: number;
    positiveCount: number;
    negativeCount: number;
    avgPositiveScore: number;
    avgNegativeScore: number;
}
