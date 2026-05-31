export interface EmployeeAccount {
  id: string;
  email: string;
  is_active: boolean;
}

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  salary: number;
  hired_date: string;
  avatar_url: string | null;
  account: EmployeeAccount;
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
  gender: "male" | "female" | "other";
  salary?: number;
  hired_date: string;
  role: "staff" | "manager";
}

export interface UpdateEmployeePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  position?: string;
  gender?: "male" | "female" | "other";
  salary?: number;
  hired_date?: string;
}

export interface ResetPasswordPayload {
  password?: string;
}
