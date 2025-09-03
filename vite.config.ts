import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./", "");
  const apiTarget = (env.VITE_API_BASE_URL || "https://miview.p-e.kr").replace(/\/+$/, "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          // 개발 시 백엔드 프록시: .env의 VITE_API_BASE_URL 우선 사용
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
