import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/types";
import { bookingApi } from "@/features/bookings/api/bookingApi";
import type {
  Booking,
  BookingFilters,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "@/types/booking";

interface BookingState {
  items: Booking[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: BookingFilters;
  selectedBooking: Booking | null;

  setFilters: (filters: Partial<BookingFilters>) => void;
  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (payload: CreateBookingPayload) => Promise<void>;
  updateBooking: (id: string, payload: UpdateBookingPayload) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  confirmBooking: (id: string) => Promise<void>;
  checkInBooking: (id: string) => Promise<void>;
  checkOutBooking: (id: string) => Promise<void>;
  clearError: () => void;
}

const defaultFilters: BookingFilters = {
  status: "",
  booking_type: "",
  customer_id: "",
  from_date: "",
  to_date: "",
  search: "",
  page: 1,
  limit: 8,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  items: [],
  total: 0,
  totalPages: 0,
  loading: false,
  error: null,
  filters: defaultFilters,
  selectedBooking: null,

  setFilters: (filters) => {
    const hasNonPageChange = Object.keys(filters).some((key) => key !== "page");
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
        ...(hasNonPageChange && !("page" in filters) ? { page: 1 } : {}),
      },
    }));
    void get().fetchBookings();
  },

  fetchBookings: async () => {
    try {
      set({ loading: true, error: null });
      const result = await bookingApi.getAll(get().filters);
      set({
        items: result.data,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  fetchBookingById: async (id) => {
    try {
      set({ loading: true, error: null });
      const booking = await bookingApi.getById(id);
      set({ selectedBooking: booking });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  createBooking: async (payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await bookingApi.create(payload);
      toast.dismiss(toastId);
      toast.success("Tạo đặt phòng thành công");
      await get().fetchBookings();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateBooking: async (id, payload) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await bookingApi.update(id, payload);
      toast.dismiss(toastId);
      toast.success("Cập nhật đặt phòng thành công");
      await get().fetchBookings();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  cancelBooking: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await bookingApi.cancel(id);
      toast.dismiss(toastId);
      toast.success("Hủy đặt phòng thành công");
      await get().fetchBookings();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  confirmBooking: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await bookingApi.confirm(id);
      toast.dismiss(toastId);
      toast.success("Xác nhận đặt phòng thành công");
      await get().fetchBookings();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  checkInBooking: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await bookingApi.checkIn(id);
      toast.dismiss(toastId);
      toast.success("Check-in thành công");
      await get().fetchBookings();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  checkOutBooking: async (id) => {
    const toastId = toast.loading("Đang xử lý...");
    try {
      set({ loading: true, error: null });
      await bookingApi.checkOut(id);
      toast.dismiss(toastId);
      toast.success("Check-out thành công");
      await get().fetchBookings();
    } catch (error) {
      toast.dismiss(toastId);
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
