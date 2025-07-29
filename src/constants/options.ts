// 회원가입용 입맛 옵션들
export const SIGNUP_TASTE_OPTIONS = [
    "매운맛", "짠맛", "단맛", "새콤한",
    "담백한", "느끼한", "자극적인", "기름진", 
    "회", "해산물", "채식", "향신료",
    "양식", "한식", "일식", "중식", "고기"
] as const;

// 프로필 수정용 입맛 옵션들
export const PROFILE_TASTE_OPTIONS = [
    "자극적인", "기름진", "달달한", "짭짤한",
    "새콤한", "날 것", "채식", "싱거운", "고소한",
    "매운맛", "맵고수", "맵찔이", "건강한",
    "담백한", "느끼한", "향신료"
] as const;

// 음식 종류 옵션들
export const FOOD_TYPE_OPTIONS = [
    { name: "한식", emoji: "🍚" },
    { name: "일식", emoji: "🍣" },
    { name: "중식", emoji: "🥮" },
    { name: "양식", emoji: "🍝" },
    { name: "아시안식", emoji: "🍜" },
    { name: "고기", emoji: "🥩" },
    { name: "채식", emoji: "🥦" },
    { name: "분식", emoji: "🍲" },
    { name: "해산물", emoji: "🦀" },
    { name: "야식", emoji: "🌙" },
    { name: "패스트푸드", emoji: "🍔" },
    { name: "술", emoji: "🍺" },
    { name: "디저트", emoji: "🍰" },
] as const;

// 레이아웃 설정 타입
export interface LayoutConfig {
    type: 'auto' | 'custom';
    rowDistribution?: readonly number[] | number[];
}

// 레이아웃 설정 상수들
export const LAYOUT_CONFIGS: Record<string, LayoutConfig> = {
    // 회원가입 입맛 선택
    SIGNUP_TASTE: {
        type: 'custom',
        rowDistribution: [4, 4, 4, 5]
    },
    
    // 프로필 입맛 선택
    PROFILE_TASTE: {
        type: 'custom',
        rowDistribution: [4, 5, 4, 3]
    },
    
    // 음식 종류 선택
    FOOD_TYPE: {
        type: 'custom',
        rowDistribution: [4, 4, 3, 2]
    },
    
    // 매장 평가 선택
    STORE_REVIEW: {
        type: 'custom',
        rowDistribution: [2, 2, 2, 2, 2]
    },
    
    // 음식 평가 선택
    FOOD_REVIEW: {
        type: 'custom',
        rowDistribution: [3, 3, 3, 3, 3]
    },
    
    // 자동 레이아웃
    AUTO: {
        type: 'auto'
    }
};

// 매장 평가 태그
export const STORE_REVIEW_TAGS = [
    "친절해요", "불친절해요", "위생이 깔끔해요", "위생이 더러워요", "서비스가 좋아요", "서비스가 별로에요",
    "또 오고 싶어요", "다신 안올거에요", "분위기가 좋아요", "독특해요"
] as const;

// 음식 평가 태그
export const FOOD_REVIEW_TAGS = [
    "맛있어요", "별로에요", "자극적이에요",
    "취향저격", "양이 많아요", "양이 적어요",
    "적당히 매워요", "너무 매워요", "평범해요",
    "달콤해요", "싱거워요", "호불호가 있어요",
    "신선해요", "느끼해요", "향이 좋아요"
] as const;

export type SignupTasteOption = typeof SIGNUP_TASTE_OPTIONS[number];
export type ProfileTasteOption = typeof PROFILE_TASTE_OPTIONS[number];
export type FoodTypeOption = typeof FOOD_TYPE_OPTIONS[number]; 

export type StoreReviewTag = typeof STORE_REVIEW_TAGS[number];
export type FoodReviewTag = typeof FOOD_REVIEW_TAGS[number]; 