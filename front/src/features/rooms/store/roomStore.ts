import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/types";
import { roomApi } from "@/features/rooms/api/roomApi";
import type {
  CreateRoomPayload,
  Room,
  RoomFilters,
  UpdateRoomPayload,
  UpdateRoomStatusPayload,
} from "@/types/room";

interface RoomState {
  items: Room[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: RoomFilters;

  setFilters: (filters: Partial<RoomFilters>) => void;
  fetchRooms: () => Promise<void>;
  createRoom: (payload: CreateRoomPayload) => Promise<void>;
  updateRoom: (id: string, payload: UpdateRoomPayload) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  updateRoomStatus: (id: string, payload: UpdateRoomStatusPayload) => Promise<void>;
  clearError: () => void;
}

const defaultFilters: RoomFilters = {
  status: "",
  room_type_id: "",
  floor: "",
  search: "",
  page: 1,
  limit: 8,
};

export const useRoomStore = create<RoomState>((set, get) => ({
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
    void get().fetchRooms();
  },

  fetchRooms: async () => {
    try {
      set({ loading: true, error: null });
      const result = await roomApi.getAll(get().filters);
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

  createRoom: async (payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await roomApi.create(payload);
      toast.dismiss(toastId);
      toast.success("Tạo phòng thành công");
      await get().fetchRooms();
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

  updateRoom: async (id, payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await roomApi.update(id, payload);
      toast.dismiss(toastId);
      toast.success("Cập nhật phòng thành công");
      await get().fetchRooms();
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

  deleteRoom: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await roomApi.delete(id);
      toast.dismiss(toastId);
      toast.success("Xóa phòng thành công");
      await get().fetchRooms();
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

  updateRoomStatus: async (id, payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await roomApi.updateStatus(id, payload);
      toast.dismiss(toastId);
      toast.success("Cập nhật trạng thái phòng thành công");
      await get().fetchRooms();
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
