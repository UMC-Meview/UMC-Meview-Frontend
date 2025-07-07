// src/services/api/axiosClient.ts
import axios from "axios";

export const axiosClient = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? "/api"
            : "https://miview-api.vercel.app",
    timeout: 10000,
});
