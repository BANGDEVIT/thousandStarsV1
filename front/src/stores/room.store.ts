import { create } from 'zustand';
import { toast } from 'sonner';
import type { Room, CreateRoomDto, GetRoomsQuery, RoomsResponse } from '@/types/room.type';
import * as roomService from '@/services/room.service';

interface RoomStore {
  rooms: Room[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  fetchRooms: (query?: GetRoomsQuery) => Promise<void>;
  createRoom: (data: CreateRoomDto) => Promise<Room | undefined>;
}

const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as { response?: { data?: { message?: string } } };
    if (responseError.response?.data?.message) {
      return responseError.response.data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMsg;
};

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,

  fetchRooms: async (query) => {
    set({ loading: true });
    try {
      const res: RoomsResponse = await roomService.getRooms(query);
      set({
        rooms: res.data,
        total: res.total,
        page: res.page,
        totalPages: res.totalPages,
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Không thể tải danh sách phòng');
      toast.error(message);
      console.error('fetchRooms error:', error);
    } finally {
      set({ loading: false });
    }
  },

  createRoom: async (data) => {
    set({ loading: true });
    try {
      const newRoom = await roomService.createRoom(data);
      await get().fetchRooms({ page: get().page });
      toast.success('Tạo phòng thành công');
      return newRoom;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Có lỗi xảy ra khi tạo phòng');
      toast.error(message);
      console.error('createRoom error:', error);
      return undefined;
    } finally {
      set({ loading: false });
    }
  },
}));