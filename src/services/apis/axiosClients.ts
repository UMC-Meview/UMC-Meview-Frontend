// src/services/api/axiosClient.ts
import axios from "axios";
import { logout } from "../../utils/auth";

export const axiosClient = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "/api"
            : "https://miview.p-e.kr",
    timeout: 10000,
});

// 요청 인터셉터: 로그인 상태 확인 (필요한 경우)
axiosClient.interceptors.request.use(
    (config) => {
        // 현재는 사용자 정보 기반 인증이므로 특별한 헤더 추가 없음
        // 필요시 사용자 정보를 헤더에 추가하거나 다른 처리 가능
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401 에러시 자동 로그아웃
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // 인증 실패시 로그아웃 처리
            console.warn("인증 실패 - 로그아웃 처리");
            logout();
            // 필요하면 로그인 페이지로 리다이렉트
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
