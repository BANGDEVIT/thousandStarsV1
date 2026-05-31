import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/types";
import { roomTypeApi } from "@/features/roomTypes/api/roomTypeApi";
import type {
  CreateRoomTypePayload,
  RoomType,
  RoomTypeFilters,
  UpdateRoomTypePayload,
} from "@/types/roomType";

interface RoomTypeState {
  items: RoomType[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: RoomTypeFilters;

  setFilters: (filters: Partial<RoomTypeFilters>) => void;
  fetchRoomTypes: () => Promise<void>;
  createRoomType: (payload: CreateRoomTypePayload) => Promise<void>;
  updateRoomType: (id: string, payload: UpdateRoomTypePayload) => Promise<void>;
  deleteRoomType: (id: string) => Promise<void>;
  clearError: () => void;
}

const defaultFilters: RoomTypeFilters = {
  search: "",
  page: 1,
  limit: 8,
};

export const useRoomTypeStore = create<RoomTypeState>((set, get) => ({
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
    void get().fetchRoomTypes();
  },

  fetchRoomTypes: async () => {
    try {
      set({ loading: true, error: null });
      const result = await roomTypeApi.getAll(get().filters);
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

  createRoomType: async (payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await roomTypeApi.create(payload);
      toast.dismiss(toastId);
      toast.success("Tạo loại phòng thành công");
      await get().fetchRoomTypes();
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

  updateRoomType: async (id, payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await roomTypeApi.update(id, payload);
      toast.dismiss(toastId);
      toast.success("Cập nhật loại phòng thành công");
      await get().fetchRoomTypes();
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

  deleteRoomType: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await roomTypeApi.delete(id);
      toast.dismiss(toastId);
      toast.success("Xóa loại phòng thành công");
      await get().fetchRoomTypes();
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
