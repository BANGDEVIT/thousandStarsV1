import { create } from 'zustand';
import { toast } from 'sonner';
import type { Room } from '@/types/room.type';
import * as roomService from '@/services/room.service';

interface HomepageStore {
  featuredRooms: Room[];
  loading: boolean;
  fetchFeaturedRooms: () => Promise<void>;
}

export const useHomepageStore = create<HomepageStore>((set) => ({
  featuredRooms: [],
  loading: false,

  fetchFeaturedRooms: async () => {
    set({ loading: true });
    try {
      // Lấy phòng available — public endpoint, không cần auth
      const res = await roomService.getRooms({ status: 'available', limit: 50, page: 1 });
      set({ featuredRooms: res.data });
    } catch {
      toast.error('Không thể tải danh sách phòng');
      set({ featuredRooms: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
