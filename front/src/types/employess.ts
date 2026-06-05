export type Gender = "male" | "female";
export type EmployeeRole = "staff" | "manager";

export interface Account {
  id: string;
  email: string;
  is_active: boolean;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  position: string;
  gender: string;
  salary: number;
  hired_date: string;
  avatar_url: string | null;
  account: Account;
}

export interface EmployeeListResponse {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeFilters {
  search: string;
  position: string;
  gender: string;
  page: number;
  limit: number;
}

export interface CreateEmployeePayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  position: string;
  gender: string;
  salary?: number;
  hired_date: string;
  role: EmployeeRole;
}

export interface UpdateEmployeePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  position?: string;
  gender?: string;
  salary?: number;
  hired_date?: string;
  is_active?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
