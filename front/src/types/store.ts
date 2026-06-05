import type { LoginPayload, RegisterPayload } from "./auth";
import type { AuthUser } from "./user";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  setAccessToken: (accessToken: string) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;

  // ← Helper tiện dùng
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}
