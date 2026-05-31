import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/types";
import { employeeApi } from "@/features/employees/api/employeeApi";
import type {
  CreateEmployeePayload,
  Employee,
  EmployeeFilters,
  UpdateEmployeePayload,
} from "@/types/employee";

interface EmployeeState {
  items: Employee[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: EmployeeFilters;

  setFilters: (filters: Partial<EmployeeFilters>) => void;
  fetchEmployees: () => Promise<void>;
  createEmployee: (payload: CreateEmployeePayload) => Promise<void>;
  updateEmployee: (id: string, payload: UpdateEmployeePayload) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  resetEmployeePassword: (id: string) => Promise<void>;
  clearError: () => void;
}

const defaultFilters: EmployeeFilters = {
  search: "",
  position: "",
  gender: "",
  page: 1,
  limit: 8,
};

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  items: [],
  total: 0,
  totalPages: 0,
  loading: false,
  error: null,
  filters: defaultFilters,

  setFilters: (filters) => {
    const hasNonPageChange = Object.keys(filters).some((key) => key !== "page");
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
        ...(hasNonPageChange && !("page" in filters) ? { page: 1 } : {}),
      },
    }));
    void get().fetchEmployees();
  },

  fetchEmployees: async () => {
    try {
      set({ loading: true, error: null });
      const result = await employeeApi.getAll(get().filters);
      set({
        items: result.data,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  createEmployee: async (payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await employeeApi.create(payload);
      toast.dismiss(toastId);
      toast.success("Tạo nhân viên thành công");
      await get().fetchEmployees();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (id, payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await employeeApi.update(id, payload);
      toast.dismiss(toastId);
      toast.success("Cập nhật nhân viên thành công");
      await get().fetchEmployees();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployee: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await employeeApi.delete(id);
      toast.dismiss(toastId);
      toast.success("Xóa nhân viên thành công");
      await get().fetchEmployees();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetEmployeePassword: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await employeeApi.resetPassword(id);
      toast.dismiss(toastId);
      toast.success("Reset mật khẩu thành công");
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
