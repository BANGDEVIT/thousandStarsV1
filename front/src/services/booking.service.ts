import api from "@/lib/axios";
import type { BookingQuery, CreateBookingPayload } from "@/types/booking.type";

export const bookingService = {
  getMyBookings: async (query: BookingQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    const res = await api.get(`/booking/my-booking?${params}`);
    return res.data.data;
  },

  createBooking: async (payload: CreateBookingPayload) => {
    const res = await api.post("/booking", payload);
    return res.data.data;
  },

  cancelBooking: async (bookingId: string) => {
    const res = await api.delete(`/booking/${bookingId}`);
    return res.data.data;
  },
};
