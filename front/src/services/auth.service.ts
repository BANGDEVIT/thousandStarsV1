import api from "@/lib/axios";
import type { LoginRequest, RegisterRequest } from "@/types/auth.type";

export const authService = {
  signUp: async (
    data: RegisterRequest 
  ) => {
    const res = await api.post(
      "/auth/register",
      data,
      { withCredentials: true },
    );
    return res.data;
  },
  signIn: async (payload: LoginRequest) => {
    console.log("Đang gửi yêu cầu đăng nhập với payload:", payload);
    const res = await api.post(
      "/auth/login",
      payload,
      { withCredentials: true },
    );
    return res.data.data;
  },
  signOut: async () => {
    return api.post("/auth/logout", { withCredentials: true });
  },
  refresh: async () => {
    const res = await api.post("/auth/refresh",{}, { withCredentials: true });
    return { accessToken: res.data.data.accessToken,
            roles: res.data.data.roles,};
  },
};
