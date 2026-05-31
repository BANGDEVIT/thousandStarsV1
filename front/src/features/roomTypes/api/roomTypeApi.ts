import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse, PaginatedResultAlt } from "@/api/types";
import { normalizePagination } from "@/api/types";
import type {
  CreateRoomTypePayload,
  RoomType,
  RoomTypeFilters,
  UpdateRoomTypePayload,
} from "@/types/roomType";

function mapRoomType(roomType: RoomType): RoomType {
  return {
    ...roomType,
    base_price: Number(roomType.base_price),
    is_active: roomType.is_active ?? true,
  };
}

export const roomTypeApi = {
  getAll: async (filters: RoomTypeFilters) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedResultAlt<RoomType>>>("/room-type", {
      params: {
        search: filters.search || undefined,
        page: filters.page,
        limit: filters.limit,
      },
    });
    const page = normalizePagination(res.data.data);
    return {
      ...page,
      data: page.data.map(mapRoomType),
    };
  },

  getById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<RoomType>>(`/room-type/${id}`);
    return mapRoomType(res.data.data);
  },

  create: async (payload: CreateRoomTypePayload) => {
    const res = await axiosInstance.post<ApiResponse<RoomType>>("/room-type", payload);
    return mapRoomType(res.data.data);
  },

  update: async (id: string, payload: UpdateRoomTypePayload) => {
    const res = await axiosInstance.patch<ApiResponse<RoomType>>(`/room-type/${id}`, payload);
    return mapRoomType(res.data.data);
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/room-type/${id}`);
  },
};
