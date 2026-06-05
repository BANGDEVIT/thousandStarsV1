import { employeeApi } from "@/services/emoloyeeService";
import type { ApiError } from "@/types/apiError";
import type {
  CreateEmployeePayload,
  Employee,
  EmployeeFilters,
  UpdateEmployeePayload,
} from "@/types/employess";
import { create } from "zustand";

interface EmployeeState {
  employees: Employee[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: EmployeeFilters;

  setFilters: (f: Partial<EmployeeFilters>) => void;
  fetchEmployees: () => Promise<void>;
  createEmployee: (payload: CreateEmployeePayload) => Promise<void>;
  updateEmployee: (id: string, payload: UpdateEmployeePayload) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  resetPassword: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  total: 0,
  totalPages: 1,
  loading: false,
  error: null,
  filters: { search: "", position: "", gender: "", page: 1, limit: 8 },

  setFilters: (f) => {
    set((s) => ({
      filters: { ...s.filters, ...f, page: f.page ?? 1 },
    }));
    get().fetchEmployees();
  },

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await employeeApi.getAll(get().filters);
      set({
        employees: res.data,
        total: res.total,
        totalPages: res.totalPages,
        loading: false,
      });
    } catch (e: unknown) {
      const apiError = e as ApiError;
      set({
        error:
          apiError.response?.data?.message ?? "Lỗi tải danh sách nhân viên",
        loading: false,
      });
    }
  },

  createEmployee: async (payload) => {
    set({ loading: true, error: null });
    try {
      await employeeApi.create(payload);
      await get().fetchEmployees();
    } catch (e: unknown) {
      const apiError = e as ApiError;
      set({
        error: apiError.response?.data?.message ?? "Lỗi tạo nhân viên",
        loading: false,
      });
      throw e;
    }
  },

  updateEmployee: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      await employeeApi.update(id, payload);
      await get().fetchEmployees();
    } catch (e: unknown) {
      const apiError = e as ApiError;
      set({
        error: apiError.response?.data?.message ?? "Lỗi cập nhật nhân viên",
        loading: false,
      });
      throw e;
    }
  },

  deleteEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      await employeeApi.remove(id);
      await get().fetchEmployees();
    } catch (e: unknown) {
      const apiError = e as ApiError;
      set({
        error: apiError.response?.data?.message ?? "Lỗi xóa nhân viên",
        loading: false,
      });
      throw e;
    }
  },

  resetPassword: async (id) => {
    try {
      await employeeApi.resetPassword(id);
    } catch (e: unknown) {
      const apiError = e as ApiError;
      set({ error: apiError.response?.data?.message ?? "Lỗi reset mật khẩu" });
      throw e;
    }
  },

  clearError: () => set({ error: null }),
}));
