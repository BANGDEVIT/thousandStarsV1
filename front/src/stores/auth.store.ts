import { create } from "zustand";
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

  setAccessToken: (
    accessToken: string
  ) => void;

  setInitialized: () => void;

  signUp: (
    payload: RegisterRequest
  ) => Promise<void>;

  signIn: (
    payload: LoginRequest
  ) => Promise<void>;

  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  roles: [],
  user: null,
  loading: false,

  signUp: async (payload: RegisterRequest) => {
    try {
      set({ loading: true });
      await authService.signUp(payload);
      // Register không trả token → gọi signIn luôn
      await get().signIn({email: payload.email, password: payload.password});
      //toast.success("Đăng ký thành công");
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        toast.error("Email này đã được sử dụng");
      } else if (status === 400) {
        toast.error("Dữ liệu không hợp lệ");
      } else {
        toast.error("Đăng ký không thành công");
      }
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (payload: LoginRequest) => {
    try {
      set({ loading: true });
      const data = await authService.signIn(payload);

      // data = phần bên trong "data" của response
      set({
        accessToken: data.accessToken,
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
        roles: data.account.roles,
      });

      toast.success("Đăng nhập thành công");
    } catch (error) {
      const status =(error as AxiosError)?.response?.status;
      switch (status) {
        case 400:
          toast.error("Dữ liệu không hợp lệ");
          break;

        case 401:
          toast.error("Email hoặc mật khẩu không đúng");
          break;

        default:
          toast.error("Không thể kết nối máy chủ");
      }
    } finally {
      set({ loading: false });
    }
  },
  setAccessToken: (accessToken) => set({ accessToken }),

  signOut: async () => {
    try {
      await authService.signOut(); // gọi API để invalidate refresh token bên backend
    } catch {
      // bỏ qua lỗi, vẫn clear state
    } finally {
      set({ accessToken: null, user: null, roles: [] });
    }
  },
  isInitialized: false,
  setInitialized: () => set({ isInitialized: true }),
}));
