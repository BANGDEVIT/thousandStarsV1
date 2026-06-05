import apiClient from '@/lib/axios';
import type { Room, CreateRoomDto, RoomsResponse, GetRoomsQuery, UpdateRoomDto, UpdateRoomStatusDto } from '@/types/room.type';

// Hàm lấy danh sách phòng (đã có trong context)
export const getRooms = async (params?: GetRoomsQuery): Promise<RoomsResponse> => {
  const response = await apiClient.get('/rooms', { params });
  return response.data.data;
};

// Hàm tạo phòng mới
export const createRoom = async (data: CreateRoomDto): Promise<Room> => {
  const response = await apiClient.post('/rooms', data);
  return response.data.data; // { success, data: Room }
};



export const updateRoom = async (id: string, data: UpdateRoomDto): Promise<Room> => {
  const response = await apiClient.patch(`/rooms/${id}`, data);
  return response.data.data;
};

export const updateRoomStatus = async (id: string, data: UpdateRoomStatusDto): Promise<Room> => {
  const response = await apiClient.patch(`/rooms/${id}/status`, data);
  return response.data.data;
};
 
export const addRoomImages = async (id: string, files: File[]): Promise<Room> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const response = await apiClient.post(`/rooms/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};
 
export const deleteRoomImages = async (id: string, imageUrls: string[]): Promise<Room> => {
  const response = await apiClient.delete(`/rooms/${id}/images`, {
    data: { imageUrls },
  });
  return response.data.data;
};
 
export const reorderRoomImages = async (id: string, imageUrls: string[]): Promise<Room> => {
  const response = await apiClient.patch(`/rooms/${id}/images/reorder`, { imageUrls });
  return response.data.data;
};

export const deleteRoom = async (id: string)=>{
  const response = await apiClient.delete(`/rooms/${id}`);
  return response.data.data;
}