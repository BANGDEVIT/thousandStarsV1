import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  roles: string[];
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  // clearState: () => void;
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
