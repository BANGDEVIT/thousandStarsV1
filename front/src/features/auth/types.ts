export interface AuthAccount {
  id: string;
  email: string;
  roles: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginResponseData {
  accessToken: string;
  account: AuthAccount;
}

export interface RefreshResponseData {
  accessToken: string;
}

export type UserRole = "admin" | "manager" | "staff" | "customer";
