import { create } from "zustand";
import { toast } from "sonner";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  roles: null,
  user: null,
  loading: false,

  signup: async (firstName, lastName, email, password, phone) => {
    try {
      set({ loading: true });
      // goi APi
      toast.success("Đăng kí thành công");
    } catch (error) {
      console.log(error);
      toast.error("Đăng kí không thành công");
    } finally {
      set({ loading: false });
    }
  },
}));
