import { create } from "zustand";
import { toast } from "sonner";
import type { AuthState } from "@/types/store";
import { authService } from "@/services/authService";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  roles: null,
  user: null,
  loading: false,

  signUp: async (email, password, firstName, lastName, phone) => {
  try {
    set({ loading: true });
    await authService.signUp(email, password, firstName, lastName, phone);
    // Register không trả token → gọi signIn luôn
    await get().signIn(email, password);
    toast.success("Đăng ký thành công");
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
        _id: data.account.id,
        email: data.account.email,
        displayName: data.account.email, // backend chưa trả displayName
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
}));
