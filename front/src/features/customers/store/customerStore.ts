import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/types";
import { customerApi } from "@/features/customers/api/customerApi";
import type {
  CreateGuestPayload,
  Customer,
  CustomerFilters,
  UpdateCustomerPayload,
} from "@/types/customer";

interface CustomerState {
  items: Customer[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: CustomerFilters;

  setFilters: (filters: Partial<CustomerFilters>) => void;
  fetchCustomers: () => Promise<void>;
  createGuest: (payload: CreateGuestPayload) => Promise<void>;
  updateCustomer: (id: string, payload: UpdateCustomerPayload) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  clearError: () => void;
}

const defaultFilters: CustomerFilters = {
  search: "",
  nationality: "",
  source: "",
  page: 1,
  limit: 8,
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
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
    void get().fetchCustomers();
  },

  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });
      const result = await customerApi.getAll(get().filters);
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

  createGuest: async (payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await customerApi.createGuest(payload);
      toast.dismiss(toastId);
      toast.success("Tạo khách vãng lai thành công");
      await get().fetchCustomers();
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

  updateCustomer: async (id, payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await customerApi.update(id, payload);
      toast.dismiss(toastId);
      toast.success("Cập nhật khách hàng thành công");
      await get().fetchCustomers();
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

  deleteCustomer: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await customerApi.delete(id);
      toast.dismiss(toastId);
      toast.success("Xóa khách hàng thành công");
      await get().fetchCustomers();
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
