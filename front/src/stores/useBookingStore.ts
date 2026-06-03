import { create } from "zustand";
import { toast } from "sonner";
import { bookingService, type BookingQuery } from "@/services/bookingService";

interface Booking {
  id: string;
  booking_type: string;
  status: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  total_room_price: number;
  rooms: { id: string; room_number: string; room_type_name: string; price_per_night: number; floor: number }[];
  invoice: { total_amount: number; discount: number; final_amount: number; status: string };
  created_at: string;
}

interface BookingState {
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  fetchBookings: (query?: BookingQuery) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,

  fetchBookings: async (query = {}) => {
    try {
      set({ loading: true });
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
}));