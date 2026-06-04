import api from "@/lib/axios";

export interface RoomQuery {
  page?: number;
  limit?: number;
  status?: "available" | "occupied" | "maintenance" | "cleaning" | "inactive";
  room_type_id?: string;
  floor?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export const roomService = {
  getRooms: async (query: RoomQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    const res = await api.get(`/rooms?${params}`);
    return res.data.data;
  },
};