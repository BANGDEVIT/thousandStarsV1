import api from "@/lib/axios";

export interface BookingQuery {
  page?: number;
  limit?: number;
  status?: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  booking_type?: "online" | "offline";
  from_date?: string;
  to_date?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const bookingService = {
  getMyBookings: async (query: BookingQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    const res = await api.get(`/booking/my-booking?${params}`);
    return res.data.data;
  },
};