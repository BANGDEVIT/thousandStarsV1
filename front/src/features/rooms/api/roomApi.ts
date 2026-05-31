import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse, PaginatedResult } from "@/api/types";
import { normalizePagination } from "@/api/types";
import type {
  CreateRoomPayload,
  Room,
  RoomFilters,
  UpdateRoomPayload,
  UpdateRoomStatusPayload,
} from "@/types/room";

function mapRoom(room: Room): Room {
  return {
    ...room,
    floor: Number(room.floor),
    room_type: {
      ...room.room_type,
      base_price: Number(room.room_type.base_price),
    },
  };
}

export const roomApi = {
  getAll: async (filters: RoomFilters) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedResult<Room>>>("/rooms", {
      params: {
        status: filters.status || undefined,
        room_type_id: filters.room_type_id || undefined,
        floor: filters.floor ? Number(filters.floor) : undefined,
        search: filters.search || undefined,
        page: filters.page,
        limit: filters.limit,
      },
    });
    const page = normalizePagination(res.data.data);
    return {
      ...page,
      data: page.data.map(mapRoom),
    };
  },

  getById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Room>>(`/rooms/${id}`);
    return mapRoom(res.data.data);
  },

  create: async (payload: CreateRoomPayload) => {
    const res = await axiosInstance.post<ApiResponse<Room>>("/rooms", payload);
    return mapRoom(res.data.data);
  },

  update: async (id: string, payload: UpdateRoomPayload) => {
    const res = await axiosInstance.patch<ApiResponse<Room>>(`/rooms/${id}`, payload);
    return mapRoom(res.data.data);
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/rooms/${id}`);
  },

  updateStatus: async (id: string, payload: UpdateRoomStatusPayload) => {
    const res = await axiosInstance.patch<ApiResponse<Room>>(`/rooms/${id}/status`, payload);
    return mapRoom(res.data.data);
  },
};
