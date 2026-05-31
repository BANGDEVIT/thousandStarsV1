import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { setAccessToken } from "@/api/axiosInstance";
import { getErrorMessage } from "@/api/types";
import { authApi } from "@/features/auth/api/authApi";
import type { AuthUser, LoginPayload, RegisterPayload, UserRole } from "@/features/auth/types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAccessToken: (token: string | null) => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
  clearAuth: () => void;
  hasRole: (role: UserRole | string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

function decodeRolesFromToken(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as { roles?: string[] };
    return payload.roles ?? [];
  } catch {
    return [];
  }
}

function buildUser(accessToken: string, account?: { id: string; email: string; roles?: string[] }): AuthUser {
  const roles = account?.roles?.length ? account.roles : decodeRolesFromToken(accessToken);
  return {
    id: account?.id ?? "",
    email: account?.email ?? "",
    roles,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAccessToken: (token) => {
        setAccessToken(token);
        set({
          accessToken: token,
          isAuthenticated: Boolean(token),
        });
      },

      login: async (payload) => {
        try {
          set({ isLoading: true, error: null });
          const { accessToken, account } = await authApi.login(payload);
          const user = buildUser(accessToken, account);
          get().setAccessToken(accessToken);
          set({ user, isAuthenticated: true });
          toast.success("Đăng nhập thành công");
        } catch (error) {
          const message = getErrorMessage(error, "Đăng nhập thất bại");
          set({ error: message });
          toast.error(message);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (payload) => {
        try {
          set({ isLoading: true, error: null });
          await authApi.register(payload);
          toast.success("Đăng ký thành công");
        } catch (error) {
          const message = getErrorMessage(error, "Đăng ký thất bại");
          set({ error: message });
          toast.error(message);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await authApi.logout();
        } catch {
          /* ignore */
        } finally {
          get().clearAuth();
          set({ isLoading: false });
          toast.success("Đã đăng xuất");
        }
      },

      refresh: async () => {
        try {
          set({ isLoading: true, error: null });
          const { accessToken } = await authApi.refresh();
          const user = get().user;
          get().setAccessToken(accessToken);
          if (user) {
            set({ user: buildUser(accessToken, user) });
          }
        } catch (error) {
          get().clearAuth();
          const message = getErrorMessage(error, "Phiên đăng nhập đã hết hạn");
          set({ error: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      clearAuth: () => {
        setAccessToken(null);
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      hasRole: (role) => get().user?.roles.includes(role) ?? false,

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
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessToken(state.accessToken);
        }
      },
    },
  ),
);
