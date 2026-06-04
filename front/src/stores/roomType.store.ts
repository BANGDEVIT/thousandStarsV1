// src/stores/useRoomTypeStore.ts
import { create } from 'zustand';
import { toast } from 'sonner';
import type { RoomType } from '@/types/room.type';
import * as roomTypeService from '@/services/roomType.service';

interface RoomTypeStore {
  roomTypes: RoomType[];
  loading: boolean;
  fetchRoomTypes: (search?: string) => Promise<void>;
}

const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const err = error as { response?: { data?: { message?: string } } };
    if (err.response?.data?.message) return err.response.data.message;
  }
  if (error instanceof Error) return error.message;
  return defaultMsg;
};

export const useRoomTypeStore = create<RoomTypeStore>((set) => ({
  roomTypes: [], // luôn là mảng rỗng ban đầu
  loading: false,
  fetchRoomTypes: async (search = '') => {
    set({ loading: true });
    try {
      const result = await roomTypeService.getRoomTypes({ page: 1, limit: 100, search });
      // result.data là mảng các RoomType
      set({ roomTypes: result.data || [] });
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Không thể tải loại phòng');
      toast.error(message);
      console.error('fetchRoomTypes error:', error);
      set({ roomTypes: [] }); // đảm bảo luôn là mảng
    } finally {
      set({ loading: false });
    }
  },
}));