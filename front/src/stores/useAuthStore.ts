import { authApi } from "@/services/authService";
import type { ApiError } from "@/types/apiError";
import type { AuthState } from "@/types/store";
import type { AuthUser } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      setAccessToken: (accessToken) => set({ accessToken }),

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(payload);
          const { accessToken, account } = res.data;

          // ← Đảm bảo roles luôn là array
          const user: AuthUser = {
            id: account.id,
            email: account.email,
            roles: Array.isArray(account.roles) ? account.roles : [],
          };

          localStorage.setItem("access_token", accessToken);
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          const apiError = err as ApiError;
          set({
            error: apiError.response?.data?.message || "Đăng nhập thất bại",
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(payload);
          const { accessToken, account } = res.data;

          const user: AuthUser = {
            id: account.id,
            email: account.email,
            roles: Array.isArray(account.roles) ? account.roles : [],
          };

          localStorage.setItem("access_token", accessToken);
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          const apiError = err as ApiError;
          set({
            error: apiError.response?.data?.message || "Đăng ký thất bại",
            isLoading: false,
          });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // ignore
        } finally {
          localStorage.removeItem("access_token");
          localStorage.removeItem("auth-storage");
          set({ user: null, accessToken: null, isAuthenticated: false });
          window.location.href = "/login";
        }
      },

      refresh: async () => {
        try {
          const res = await authApi.refreshToken();
          const newToken = res.data.accessToken;
          localStorage.setItem("access_token", newToken);
          set({ accessToken: newToken });
        } catch (err) {
          console.log(err);
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      // ← Helpers
      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.includes(role) ?? false;
      },

      isAdmin: () => get().hasRole("admin"),
      isManager: () => get().hasRole("manager") || get().hasRole("admin"),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
