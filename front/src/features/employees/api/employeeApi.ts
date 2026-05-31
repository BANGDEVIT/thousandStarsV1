import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse, PaginatedResult } from "@/api/types";
import { normalizePagination } from "@/api/types";
import type {
  CreateEmployeePayload,
  Employee,
  EmployeeFilters,
  UpdateEmployeePayload,
} from "@/types/employee";

function mapEmployee(employee: Employee): Employee {
  return {
    ...employee,
    salary: Number(employee.salary),
    hired_date: employee.hired_date.split("T")[0] ?? employee.hired_date,
  };
}

export const employeeApi = {
  getAll: async (filters: EmployeeFilters) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedResult<Employee>>>("/employees", {
      params: {
        search: filters.search || undefined,
        position: filters.position || undefined,
        gender: filters.gender || undefined,
        page: filters.page,
        limit: filters.limit,
      },
    });
    const page = normalizePagination(res.data.data);
    return {
      ...page,
      data: page.data.map(mapEmployee),
    };
  },

  getById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Employee>>(`/employees/${id}`);
    return mapEmployee(res.data.data);
  },

  create: async (payload: CreateEmployeePayload) => {
    const res = await axiosInstance.post<ApiResponse<Employee>>("/employees", payload);
    return mapEmployee(res.data.data);
  },

  update: async (id: string, payload: UpdateEmployeePayload) => {
    const res = await axiosInstance.patch<ApiResponse<Employee>>(`/employees/${id}`, payload);
    return mapEmployee(res.data.data);
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/employees/${id}`);
  },

  resetPassword: async (id: string) => {
    const res = await axiosInstance.patch<ApiResponse<{ message: string }>>(
      `/employees/${id}/reset-password`,
    );
    return res.data.data;
  },
};
