import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse, PaginatedResult } from "@/api/types";
import { normalizePagination } from "@/api/types";
import type { PublicRoom } from "@/features/customer/types";

function mapRoom(room: PublicRoom): PublicRoom {
  return {
    ...room,
    floor: Number(room.floor),
    room_type: {
      ...room.room_type,
      base_price: Number(room.room_type.base_price),
      capacity: Number(room.room_type.capacity),
    },
  };
}

export interface PublicRoomQuery {
  search?: string;
  room_type_id?: string;
  floor?: number;
  page?: number;
  limit?: number;
}

export const customerRoomApi = {
  getPublicRooms: async (query: PublicRoomQuery = {}) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedResult<PublicRoom>>>(
      "/rooms/public",
      {
        params: {
          search: query.search || undefined,
          room_type_id: query.room_type_id || undefined,
          floor: query.floor,
          page: query.page ?? 1,
          limit: query.limit ?? 12,
        },
      },
    );
    const page = normalizePagination(res.data.data);
    return {
      ...page,
      data: page.data.map(mapRoom),
    };
  },

  getPublicRoomById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<PublicRoom>>(`/rooms/public/${id}`);
    return mapRoom(res.data.data);
  },
};
