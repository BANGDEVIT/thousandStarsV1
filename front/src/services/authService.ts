import api from "@/lib/axios";

import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RefreshTokenResponse,
} from "../types/auth";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const { data } = await api.post<RefreshTokenResponse>("/auth/refresh");
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
