import type { User } from "./user.type";

export interface AuthState {
  accessToken: string | null;
  roles: string[];
  user: User | null;
  loading: boolean;
  isInitialized?: boolean; // Thêm trường này để theo dõi trạng thái khởi tạo

  setAccessToken: (accessToken: string) => void;
  // clearState: () => void;
  setInitialized: () => void;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // refresh: () => Promise<void>;
}
