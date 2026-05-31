import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/api/types";

const ACCESS_TOKEN_KEY = "access_token";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  refreshQueue = [];
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    const url = originalRequest?.url ?? "";

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axiosInstance.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
      const newToken = res.data.data.accessToken;
      setAccessToken(newToken);

      const { useCustomerAuthStore } = await import(
        "@/features/customer/store/customerAuthStore"
      );
      useCustomerAuthStore.getState().setAccessToken(newToken);

      try {
        const { useAuthStore } = await import("@/features/auth/store/authStore");
        useAuthStore.getState().setAccessToken(newToken);
      } catch {
        /* admin store optional */
      }

      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAccessToken(null);

      const { useCustomerAuthStore } = await import(
        "@/features/customer/store/customerAuthStore"
      );
      useCustomerAuthStore.getState().clearAuth();

      try {
        const { useAuthStore } = await import("@/features/auth/store/authStore");
        useAuthStore.getState().clearAuth();
      } catch {
        /* ignore */
      }

      if (!window.location.pathname.startsWith("/signin")) {
        window.location.href = "/signin";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
