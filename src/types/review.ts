import { User } from "./auth";

// 기존 타입들 (하위 호환성 유지)
export interface CreateReviewDto {
    storeId: string;
    userId: string;
    isPositive: boolean;
    score: number;
    foodReviews: string[];
    storeReviews: string[];
    imageUrls: string[]; 
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
    imageUrls: string[]; 
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

// 사용자 리뷰 조회 API 스펙에 맞춘 타입 정의
export type PopulatedStoreInReview = {
    _id: string;
    name: string;
    category: string;
    address: string;
    averagePositiveScore?: number;
    averageNegativeScore?: number;
};

export type Review = {
    _id: string;
    // 백엔드에서 populate된 경우 객체, 과거 호환을 위해 string도 허용
    store: string | PopulatedStoreInReview;
    // 과거 일부 화면에서 사용하던 자유 텍스트는 선택값으로 유지
    content?: string;
    score: number;
    isPositive: boolean;
    foodReviews?: string[];
    storeReviews?: string[];
    imageUrls?: string[];
    createdAt: string;
};

export type UserReviewsResponse = {
    reviews: Review[];
    averagePositiveScore: number;
    averageNegativeScore: number;
};

// UI 표시용 리뷰 타입: 스토어명과 썸네일 등 표시 전용 필드 포함
export type DisplayReview = Review & {
    storeId: string;
    storeName: string;
    storeAddress: string;
    storeAddressShort: string;
    storeCategory?: string;
    storeLevel?: number;
    storeIconPath?: string;
    imageUrl?: string;
    storeReviews?: string[];
    foodReviews?: string[];
};

export interface UseGetUserReviewsResult {
    userReviews: UserReviewsResponse | null;
    displayReviews: DisplayReview[];
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
    _id: string;
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