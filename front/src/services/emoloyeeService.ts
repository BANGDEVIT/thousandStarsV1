import api from "@/lib/axios";
import type {
  ApiResponse,
  CreateEmployeePayload,
  Employee,
  EmployeeFilters,
  EmployeeListResponse,
  UpdateEmployeePayload,
} from "@/types/employess";

export const employeeApi = {
  getAll: async (
    filters: Partial<EmployeeFilters>,
  ): Promise<EmployeeListResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.position) params.set("position", filters.position);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    const { data } = await api.get<ApiResponse<EmployeeListResponse>>(
      `/employees?${params}`,
    );
    return data.data;
  },

  getOne: async (id: string): Promise<Employee> => {
    const { data } = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return data.data;
  },

  create: async (payload: CreateEmployeePayload): Promise<Employee> => {
    const { data } = await api.post<ApiResponse<Employee>>(
      "/employees",
      payload,
    );
    return data.data;
  },

  update: async (
    id: string,
    payload: UpdateEmployeePayload,
  ): Promise<Employee> => {
    const { data } = await api.patch<ApiResponse<Employee>>(
      `/employees/${id}`,
      payload,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  resetPassword: async (id: string): Promise<void> => {
    await api.patch(`/employees/${id}/reset-password`);
  },
};
