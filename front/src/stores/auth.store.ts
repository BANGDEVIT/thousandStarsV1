import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import type { RegisterRequest, LoginRequest } from "@/types/auth.type";
import type { User } from "@/types/user.type";
import type { AxiosError } from "axios";

interface AuthState {
  accessToken: string | null;
  roles: string[];
  user: User | null;
  loading: boolean;
  isInitialized: boolean;

  setAccessToken: (accessToken: string, roles?: string[]) => void;
  setInitialized: () => void;
  signUp: (payload: RegisterRequest) => Promise<void>;
  signIn: (payload: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      roles: [],
      user: null,
      loading: false,
      isInitialized: false,

      setAccessToken: (accessToken, roles) =>
        set((state) => ({
          accessToken,
          roles: roles ?? state.roles,
        })),

      setInitialized: () => set({ isInitialized: true }),

      signUp: async (payload) => {
        try {
          set({ loading: true });
          await authService.signUp(payload);
          await get().signIn({ email: payload.email, password: payload.password });
        } catch (error: unknown) {
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status === 409) toast.error("Email này đã được sử dụng");
          else if (status === 400) toast.error("Dữ liệu không hợp lệ");
          else toast.error("Đăng ký không thành công");
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (payload) => {
        try {
          set({ loading: true });
          const data = await authService.signIn(payload);
          set({
            accessToken: data.accessToken,
            roles: data.account.roles,
            user: {
              id: data.account.id,
              email: data.account.email,
              roles: data.account.roles,
              account: {
                id: data.account.id,
                email: data.account.email,
                roles: data.account.roles,
              },
            },
          });
          toast.success("Đăng nhập thành công");
        } catch (error) {
          const status = (error as AxiosError)?.response?.status;
          switch (status) {
            case 400: toast.error("Dữ liệu không hợp lệ"); break;
            case 401: toast.error("Email hoặc mật khẩu không đúng"); break;
            default:  toast.error("Không thể kết nối máy chủ");
          }
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          await authService.signOut();
        } catch {
          // bỏ qua lỗi mạng, vẫn clear state
        } finally {
          set({ accessToken: null, user: null, roles: [] });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        roles: state.roles,
        // accessToken KHÔNG persist — lấy lại qua refresh mỗi reload
      }),
    },
  ),
);