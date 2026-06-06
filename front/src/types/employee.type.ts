export interface Employee {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  avatar_url: string;
  salary: number;
  hired_date: string;
  gender: string;
  account: {
    id: string;
    email: string;
    is_active: boolean;
  }
}
export interface createEmployeeDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  position: string;
  salary: number;
  hired_date: string;
  gender: string;
  role: 'staff' | 'manager' | 'admin'
}
export interface updateEmployee {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  position?: string;
  salary?: number;
  hired_date?: string;
  gender?: string
  is_active?: boolean;
}
export interface UpdateProfileDto {
  first_name?: string; 
  last_name?: string; 
  phone?: string; 
  gender?: string 
  file?: File | Blob; 
}

export interface GetEmployeeShiftsQuery {
  week?: string;      // Định dạng YYYY-MM-DD (truyền 1 ngày bất kỳ trong tuần)
  work_date?: string; // Định dạng YYYY-MM-DD (Lọc theo ngày cụ thể)
}

export interface GetEmployeesQuery {
  page?: number;
  limit?: number;
  search?: string;
  position?: string;
  gender?: string
  is_active?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface EmployeesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Employee[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}