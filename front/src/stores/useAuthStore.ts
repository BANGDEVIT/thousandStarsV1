import { create } from "zustand";
import { toast } from "sonner";
import type { AuthState } from "@/types/store";
import { authService } from "@/services/authService";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  roles: null,
  user: null,
  loading: false,

  signup: async (firstName, lastName, email, password, phone) => {
    try {
      set({ loading: true });
      // goi APi
      const data = await authService.signUp(email, password, firstName, lastName, phone);
      toast.success("Đăng kí thành công");
    } catch (error) {
      console.log(error);
      toast.error("Đăng kí không thành công");
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
