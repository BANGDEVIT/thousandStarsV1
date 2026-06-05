// src/services/roomTypeService.ts
import apiClient from '@/lib/axios';
import type { RoomType,CreateRoomTypeDto,GetRoomsTypeQuery,UpdateRoomTypeDto, RoomTypeResponse } from '@/types/roomtype.type';


export const getRoomTypes = async (params?: GetRoomsTypeQuery): Promise<RoomTypeResponse> => {
  const response = await apiClient.get('/room-type', { params });
  // Backend trả về { success: true, data: { data: [], total, ... } }
  // Hoặc trực tiếp { data: [], total, ... }
  if (response.data.success !== undefined) {
    return response.data.data;
  }
  return response.data;
};

export const createRoomType = async (data: CreateRoomTypeDto):Promise<RoomType> => {
  const respone = await apiClient.post('/room-type', data);
  return respone.data.data;
}

export const updateRoomType = async (id: string, data: UpdateRoomTypeDto): Promise<RoomType> => {
  const response = await apiClient.patch(`/room-type/${id}`, data);
  return response.data.data;
};

export const deleteRoomType = async (id: string)=>{
  const response = await apiClient.delete(`/room-type/${id}`);
  return response.data.data;
}