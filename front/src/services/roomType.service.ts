// src/services/roomTypeService.ts
import apiClient from '@/lib/axios';
import type { RoomType } from '@/types/room.type';

interface GetRoomTypesResponse {
  data: RoomType[];
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export const getRoomTypes = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetRoomTypesResponse> => {
  const response = await apiClient.get('/room-type', { params });
  // Backend trả về { success: true, data: { data: [], total, ... } }
  // Hoặc trực tiếp { data: [], total, ... }
  if (response.data.success !== undefined) {
    return response.data.data;
  }
  return response.data;
};