import api from "@/lib/axios";
import type { BookingQuery, CreateBookingPayload } from "@/types/booking.type";

export const bookingService = {
  getBookings: async (query: BookingQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.append(key, String(value));
    });
    const queryString = params.toString();
    const res = await api.get(`/booking${queryString ? `?${queryString}` : ""}`);
    return res.data.data;
  },

  getMyBookings: async (query: BookingQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.append(key, String(value));
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

  confirmBooking: async (bookingId: string) => {
    const res = await api.post(`/booking/${bookingId}/confirm`);
    return res.data.data;
  },

  checkInBooking: async (bookingId: string) => {
    const res = await api.post(`/booking/${bookingId}/check-in`);
    return res.data.data;
  },

  checkOutBooking: async (bookingId: string) => {
    const res = await api.post(`/booking/${bookingId}/check-out`);
    return res.data.data;
  },
};
