import { create } from "zustand";
import { toast } from "sonner";
import type { AuthState } from "@/types/store";
import { authService } from "@/services/authService";


export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  roles: [],
  user: null,
  loading: false,

  signUp: async (email, password, firstName, lastName, phone) => {
    try {
      set({ loading: true });
      await authService.signUp(email, password, firstName, lastName, phone);
      // Register không trả token → gọi signIn luôn
      await get().signIn(email, password);
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
  signIn: async (email, password) => {
    try {
      set({ loading: true });
      const data = await authService.signIn(email, password);

      // data = phần bên trong "data" của response
      set({
        accessToken: data.accessToken,
        user: {
          id: data.account.id,
          email: data.account.email,
          roles: data.account.roles,
          display_name: data.full_name, // backend chưa trả displayName
          account: {
            id: data.account.id,
            email: data.account.email,
            roles: data.account.roles,
          },
        },
        roles: data.account.roles,
      });

      toast.success("Đăng nhập thành công");
    } catch {
      toast.error("Email hoặc mật khẩu không đúng");
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
