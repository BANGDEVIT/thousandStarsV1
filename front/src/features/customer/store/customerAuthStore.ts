import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { setAccessToken as persistAccessToken } from "@/api/axiosInstance";
import { getErrorMessage } from "@/api/types";
import { customerAuthApi } from "@/features/customer/api/customerAuthApi";
import { customerProfileApi } from "@/features/customer/api/customerProfileApi";
import type { User } from "@/types/user";

interface CustomerAuthState {
  accessToken: string | null;
  roles: string[];
  user: User | null;
  customerId: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearAuth: () => void;
}

function profileToUser(
  profile: Awaited<ReturnType<typeof customerProfileApi.getProfile>>,
  accountId: string,
): User {
  return {
    _id: accountId,
    email: profile.email ?? "",
    displayName: profile.full_name,
    phone: profile.phone ?? "",
    createdAt: profile.updated_at,
  };
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      roles: [],
      user: null,
      customerId: null,
      loading: false,
      isAuthenticated: false,

      setAccessToken: (token) => {
        persistAccessToken(token);
        set({
          accessToken: token,
          isAuthenticated: Boolean(token),
        });
      },

      setUser: (user) => set({ user }),

      refreshProfile: async () => {
        const profile = await customerProfileApi.getProfile();
        const current = get().user;
        set({
          customerId: profile.id,
          user: current
            ? {
                ...current,
                displayName: profile.full_name,
                email: profile.email ?? current.email,
                phone: profile.phone ?? current.phone,
              }
            : {
                _id: "",
                email: profile.email ?? "",
                displayName: profile.full_name,
                phone: profile.phone ?? "",
              },
        });
      },

      signIn: async (email, password) => {
        try {
          set({ loading: true });
          const { accessToken, account } = await customerAuthApi.login({ email, password });
          get().setAccessToken(accessToken);
          set({ roles: account.roles });

          if (!account.roles.includes("customer")) {
            get().clearAuth();
            toast.error("Tài khoản này không phải khách hàng. Vui lòng dùng trang quản trị.");
            throw new Error("Not a customer account");
          }

          const profile = await customerProfileApi.getProfile();
          set({
            customerId: profile.id,
            user: profileToUser(profile, account.id),
            isAuthenticated: true,
          });
          toast.success("Đăng nhập thành công");
        } catch (error) {
          const message = getErrorMessage(error, "Đăng nhập thất bại");
          if (!message.includes("khách hàng")) toast.error(message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (email, password, firstName, lastName, phone) => {
        try {
          set({ loading: true });
          await customerAuthApi.register({
            email,
            password,
            firstName,
            lastName,
            phone,
          });
          toast.success("Đăng ký thành công");
          await get().signIn(email, password);
        } catch (error) {
          toast.error(getErrorMessage(error, "Đăng ký thất bại"));
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          await customerAuthApi.logout();
        } catch {
          /* ignore */
        }
        get().clearAuth();
        toast.success("Đã đăng xuất");
      },

      clearAuth: () => {
        persistAccessToken(null);
        set({
          accessToken: null,
          roles: [],
          user: null,
          customerId: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "customer-auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        roles: state.roles,
        user: state.user,
        customerId: state.customerId,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          persistAccessToken(state.accessToken);
        }
      },
    },
  ),
);
