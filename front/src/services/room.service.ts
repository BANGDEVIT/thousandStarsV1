import apiClient from '@/lib/axios';
import type { Room, CreateRoomDto, RoomsResponse, GetRoomsQuery } from '@/types/room.type';

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

