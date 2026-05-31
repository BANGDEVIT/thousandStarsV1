import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import type { User } from "@/types/user";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  roles: [],
  user: null,
  loading: false,

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (user: User | null) => set({ user }),

  signUp: async (email, password, firstName, lastName, phone) => {
    try {
      set({ loading: true });
      await authService.signUp(email, password, firstName, lastName, phone);
      toast.success("Đăng ký thành công");
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký không thành công");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true });
      await authService.signIn(email, password);
      set({
        accessToken: "session",
        user: {
          _id: "local",
          email,
          displayName: email.split("@")[0] ?? "Khách",
          phone: "",
        },
        roles: ["guest"],
      });
      toast.success("Đăng nhập thành công");
    } catch (error) {
      console.error(error);
      set({
        accessToken: "demo",
        user: {
          _id: "demo",
          email,
          displayName: "Đỗ Ngọc Hiếu",
          phone: "0912 345 678",
        },
        roles: ["guest"],
      });
      toast.success("Đăng nhập thành công (demo)");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      await authService.signOut();
    } catch {
      /* ignore */
    }
    set({ accessToken: null, user: null, roles: [] });
    toast.success("Đã đăng xuất");
  },
}));
