import { create } from 'zustand';
import { toast } from 'sonner';
import type { RoomType,CreateRoomTypeDto,GetRoomsTypeQuery,UpdateRoomTypeDto } from '@/types/roomtype.type';
import * as roomTypeService from '@/services/roomType.service';
import axios from 'axios';
interface RoomTypeStore {
  roomTypes: RoomType[];
  total: number;
  page: number;
  totalPage: number;
  loading: boolean;
  fetchRoomTypes: (search?: GetRoomsTypeQuery) => Promise<void>;
  createRoomType: (data: CreateRoomTypeDto) =>Promise<RoomType|undefined>;
  updateRoomType: (id: string, data: UpdateRoomTypeDto) => Promise<RoomType | undefined>;
  deactiveRoomType: (id: string)=>Promise<boolean>;
}

const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const err = error as { response?: { data?: { message?: string } } };
    if (err.response?.data?.message) return err.response.data.message;
  }
  if (axios.isAxiosError(error) && error.response?.data?.message) return error.response.data.message;
  if (error instanceof Error) return error.message;
  return defaultMsg;
};

export const useRoomTypeStore = create<RoomTypeStore>((set, get) => ({
  roomTypes: [],
  total: 0,
  page: 1,
  totalPage: 1,
  loading: false,

  fetchRoomTypes: async (search) => {
    set({ loading: true });
    try {
      const result = await roomTypeService.getRoomTypes(search);
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

  createRoomType: async (data) => {
      set({ loading: true });
      try {
        const newRoom = await roomTypeService.createRoomType(data);
        await get().fetchRoomTypes();
        toast.success('Tạo phòng thành công');
        return newRoom;
      } catch (error: unknown) {
        const message = getErrorMessage(error, 'Có lỗi xảy ra khi tạo loại phòng');
        toast.error(message);
        console.error('createRoomTypes error:', error);
        return undefined;
      } finally {
        set({ loading: false });
      }
    },

  updateRoomType: async (id, data) => {
    set({ loading: true });
    try {
      const updated = await roomTypeService.updateRoomType(id, data);
      await get().fetchRoomTypes();
      toast.success('Cập nhật loại phòng thành công');
      return updated;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Có lỗi xảy ra khi cập nhật loại phòng');
      toast.error(message);
      console.error('updateRoomType error:', error);
      return undefined;
    } finally {
      set({ loading: false });
    }
  },

  deactiveRoomType: async(id) => {
    set({ loading: true });
    try {
      await roomTypeService.deleteRoomType(id);
      await get().fetchRoomTypes(); 
      toast.success('Xóa loại phòng thành công');
      return true; 
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Có lỗi xảy ra khi xóa loại phòng');
      toast.error(message);
      console.error('deleteRoomType error:', error);
      return false; 
    } finally {
      set({ loading: false });
    }
  },
}))
