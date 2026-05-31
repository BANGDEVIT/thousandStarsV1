import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/api/types";
import type {
  LoginPayload,
  LoginResponseData,
  RefreshResponseData,
  RegisterPayload,
} from "@/features/auth/types";

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await axiosInstance.post<ApiResponse<LoginResponseData>>("/auth/login", payload);
    return res.data.data;
  },

  register: async (payload: RegisterPayload) => {
    const res = await axiosInstance.post<ApiResponse<unknown>>("/auth/register", {
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
    });
    return res.data.data;
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
  },

  refresh: async () => {
    const res = await axiosInstance.post<ApiResponse<RefreshResponseData>>("/auth/refresh");
    return res.data.data;
  },
};
