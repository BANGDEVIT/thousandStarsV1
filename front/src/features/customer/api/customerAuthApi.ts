import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/api/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthAccount {
  id: string;
  email: string;
  roles: string[];
}

export const customerAuthApi = {
  login: async (payload: LoginPayload) => {
    const res = await axiosInstance.post<
      ApiResponse<{ accessToken: string; account: AuthAccount }>
    >("/auth/login", payload);
    return res.data.data;
  },

  register: async (payload: RegisterPayload) => {
    const res = await axiosInstance.post<
      ApiResponse<{
        user: {
          id: string;
          first_name: string;
          last_name: string;
          email: string | null;
        };
      }>
    >("/auth/register", payload);
    return res.data.data;
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
  },

  refresh: async () => {
    const res = await axiosInstance.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
    return res.data.data.accessToken;
  },
};
