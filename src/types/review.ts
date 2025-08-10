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
    content: string; // 리뷰 텍스트 내용
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

// 시각적 효과 관련 타입들
export interface VisualProps {
    clickCount: number;
    maxClicks: number;
    onStoreClick: () => void;
}

export interface VisualReturn {
    topEffect: React.ReactNode;
    buildingImage: React.ReactNode;
    bottomImage: React.ReactNode;
}

export interface FloatingItem {
    id: number;
    x: number;
    y: number;
    type: 'coin' | 'money';
}

export interface DustParticle {
    id: number;
    x: number;
    y: number;
    index: number;
}

export interface UserReview {
    _id: string;
    store: string;
    content: string;
    score: number;
    isPositive: boolean;
    createdAt: string;
}

export interface UserReviewsResponse {
    reviews: UserReview[];
    averagePositiveScore: number;
    averageNegativeScore: number;
}

export interface UseGetUserReviewsResult {
    reviews: UserReview[];
    averagePositiveScore: number;
    averageNegativeScore: number;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
    refetch: () => void;
}

export interface ReviewSubmissionRequest {
    storeId: string;
    userId: string;
    isPositive: boolean;
    score: number;
    foodReviews: string[];
    storeReviews: string[];
    imageUrls: string[];
}

export interface ReviewSubmissionResponse {
    id: string;
    store: string;
    user: string;
    isPositive: boolean;
    score: number;
    foodReviews: string[];
    storeReviews: string[];
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ReviewSubmissionError {
    message: string;
}

// 리뷰 페이지 간 데이터 전달을 위한 타입
export interface ReviewLocationState {
    storeId?: string;
    storeName?: string;
    isPositive?: boolean;
    score?: number;
}


