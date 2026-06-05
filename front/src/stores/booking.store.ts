import { create } from "zustand";
import { toast } from "sonner";
import { bookingService } from "@/services/booking.service";
import type { BookingState } from "@/types/booking.type";


export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,

  fetchBookings: async (query = {}) => {
    try {
      set({ loading: true, bookings: [] });
      const data = await bookingService.getMyBookings(query);
      set({
        bookings: data.data,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch {
      toast.error("Không thể tải lịch sử đặt phòng");
    } finally {
      set({ loading: false });
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const cancelled = await bookingService.cancelBooking(bookingId);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId ? cancelled : booking,
        ),
      }));
      toast.success("Hủy phòng thành công!");
    } catch {
      toast.error("Không thể hủy phòng. Vui lòng thử lại");
    }
  },
}));
