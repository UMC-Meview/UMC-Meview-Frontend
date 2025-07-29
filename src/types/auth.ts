// 인증 관련 타입 정의

// 공통 에러 타입
export interface ApiError {
    message: string;
    error?: string;
    statusCode?: number;
}

// 사용자 정보 기본 구조
export interface User {
    _id: string;
    nickname: string;
    tastePreferences: string[];
    birthYear: string;
    gender: string;
}

// 백엔드에서 반환되는 사용자 정보 (MongoDB 필드 포함)
export interface UserApiResponse extends User {
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// 프로필 조회 API 응답 타입 (스웨거 문서 기준)
export interface UserProfileResponse {
    id: string; // 스웨거 문서에서 사용하는 필드명
    nickname: string;
    introduction: string;
    profileImageUrl: string;
    tastePreferences: string[];
    reviewCount: number;
    favoriteCount: number;
}

// 프로필 수정 API 요청 타입 (스웨거 문서 기준)
export interface PatchProfileRequest {
    nickname?: string;
    introduction?: string;
    profileImageUrl?: string;
    tastePreferences?: string[];
}

// 프로필 수정 API 응답 타입 (실제 서버 응답 기준)
export interface PatchProfileResponse {
    id: string;
    nickname: string;
    introduction: string;
    profileImageUrl: string;
    tastePreferences: string[];
    reviewCount?: number;
    favoriteCount?: number;
}

// 회원가입 관련 타입
export type SignupRequest = User;

export type SignupResponse = UserApiResponse;

// 로그인 관련 타입
export interface LoginRequest {
    nickname: string;
}

export interface LoginResponse {
    message: string; // "로그인 성공" 또는 "신규 회원"
    user: UserApiResponse | null; // 신규 회원일 때는 null
    isNewUser?: boolean; // 신규 회원 여부
}

// 타입 별칭으로 일관성 유지
export type SignupData = User;
export type SignupError = ApiError;
export type LoginError = ApiError;

// localStorage용 UserInfo 타입 (id 필드 사용)
export interface UserInfo {
    id: string;
    nickname: string;
    tastePreferences: string[];
    birthYear: string;
    gender: string;
}
