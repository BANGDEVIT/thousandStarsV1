import { create } from "zustand";
import { toast } from "sonner";
import { roomService, type RoomQuery } from "@/services/roomService";

interface Room {
  id: string;
  room_number: string;
  floor: number;
  status: "available" | "occupied" | "maintenance" | "cleaning" | "inactive";
  created_at: string;
  updated_at: string;
  room_type: {
    id: string;
    name: string;
    base_price: number;
    capacity: number;
    bed_type: string;
    amenities: string[];
  };
}

interface RoomState {
  rooms: Room[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  fetchRooms: (query?: RoomQuery) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,

  fetchRooms: async (query = {}) => {
    try {
      set({ loading: true });
      const data = await roomService.getRooms(query);
      set({
        rooms: data.data,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch {
      toast.error("Không thể tải danh sách phòng");
    } finally {
      set({ loading: false });
    }
  },
}));