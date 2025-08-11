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