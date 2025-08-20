// 인증 관련 localStorage 관리 유틸리티
import { SignupData, UserInfo } from "../types/auth";

// 사용자 정보 관리
export const getUserInfo = (): UserInfo | null => {
  const userInfo = localStorage.getItem("user_info");
  return userInfo ? JSON.parse(userInfo) : null;
};

export const setUserInfo = (userInfo: UserInfo): void => {
  localStorage.setItem("user_info", JSON.stringify(userInfo));
};

export const removeUserInfo = (): void => {
  localStorage.removeItem("user_info");
};

// 로그인 상태 확인 (사용자 정보 기반)
export const isLoggedIn = (): boolean => {
  const info = getUserInfo();
  // ID가 유효할 때만 로그인 상태로 인정
  return !!(info && typeof info.id === "string" && info.id.trim().length > 0);
};

// 로그아웃 (모든 인증 데이터 삭제)
export const logout = (): void => {
  removeUserInfo();
  clearTempSignupData();
};

// 회원가입 임시 데이터 관리 (요청 스펙과 동일한 구조)
const initialSignupData: SignupData = {
  nickname: "",
  tastePreferences: [],
  birthYear: "",
  gender: "",
};

export const getTempSignupData = (): SignupData => {
  const data = localStorage.getItem("signup_temp_data");
  return data ? JSON.parse(data) : initialSignupData;
};

export const setTempSignupData = (data: Partial<SignupData>): void => {
  const current = getTempSignupData();
  localStorage.setItem("signup_temp_data", JSON.stringify({ ...current, ...data }));
};

export const clearTempSignupData = (): void => {
  localStorage.removeItem("signup_temp_data");
};

// 개별 필드 업데이트 함수들
export const updateTempNickname = (nickname: string): void => {
  setTempSignupData({ nickname });
};

export const updateTempPreferences = (tastePreferences: string[]): void => {
  setTempSignupData({ tastePreferences });
};

export const updateTempProfile = (birthYear: string, gender: string): void => {
  setTempSignupData({ birthYear, gender });
}; 

// 리뷰 임시 저장/복원 유틸
export interface ReviewDraftData {
  storeId: string;
  storeName?: string;
  isPositive: boolean;
  score: number;
  foodReviews: string[];
  storeReviews: string[];
  imageDataUrls: string[]; // File 객체를 JSON으로 저장할 수 없으므로 Data URL로 저장
}

const REVIEW_DRAFT_KEY = "review_draft";

export const saveReviewDraft = (draft: ReviewDraftData): void => {
  try {
    localStorage.setItem(REVIEW_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // 저장 실패 시 무시 (용량 초과 등)
  }
};

export const getReviewDraft = (): ReviewDraftData | null => {
  try {
    const raw = localStorage.getItem(REVIEW_DRAFT_KEY);
    if (!raw) return null;
    
    const draft = JSON.parse(raw) as ReviewDraftData;
    
    // 데이터 유효성 검사
    if (!draft.storeId || !Array.isArray(draft.imageDataUrls)) {
      console.warn("Invalid review draft data found, clearing...");
      clearReviewDraft();
      return null;
    }
    
    // 이미지 데이터 URL 유효성 검사
    const validImageUrls = draft.imageDataUrls.filter(url => {
      if (!url || typeof url !== 'string') return false;
      if (!url.startsWith('data:')) return false;
      
      // Base64 부분 존재 확인
      const parts = url.split(',');
      if (parts.length !== 2 || !parts[1]) return false;
      
      return true;
    });
    
    // 유효하지 않은 이미지가 있다면 필터링된 데이터로 업데이트
    if (validImageUrls.length !== draft.imageDataUrls.length) {
      console.warn("Found invalid image data URLs, filtering...");
      draft.imageDataUrls = validImageUrls;
      saveReviewDraft(draft);
    }
    
    return draft;
  } catch {
    console.warn("Failed to parse review draft, clearing...");
    clearReviewDraft();
    return null;
  }
};

export const clearReviewDraft = (): void => {
  try {
    localStorage.removeItem(REVIEW_DRAFT_KEY);
  } catch {
    // 무시
  }
};