import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse, PaginatedResult } from "@/api/types";
import { normalizePagination } from "@/api/types";
import type {
  Booking,
  BookingFilters,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "@/types/booking";

function mapBooking(booking: Booking): Booking {
  return {
    ...booking,
    check_in_date: booking.check_in_date.split("T")[0] ?? booking.check_in_date,
    check_out_date: booking.check_out_date.split("T")[0] ?? booking.check_out_date,
    nights: Number(booking.nights),
    invoice: booking.invoice
      ? {
          ...booking.invoice,
          total_amount: Number(booking.invoice.total_amount),
          discount: Number(booking.invoice.discount),
          final_amount: Number(booking.invoice.final_amount),
        }
      : null,
    rooms: booking.rooms.map((room) => ({
      ...room,
      price_per_night: Number(room.price_per_night),
      floor: Number(room.floor),
    })),
  };
}

export const bookingApi = {
  getAll: async (filters: BookingFilters) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedResult<Booking>>>("/booking", {
      params: {
        status: filters.status || undefined,
        booking_type: filters.booking_type || undefined,
        customer_id: filters.customer_id || undefined,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
        search: filters.search || undefined,
        page: filters.page,
        limit: filters.limit,
      },
    });
    const page = normalizePagination(res.data.data);
    return {
      ...page,
      data: page.data.map(mapBooking),
    };
  },

  getById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Booking>>(`/booking/${id}`);
    return mapBooking(res.data.data);
  },

  create: async (payload: CreateBookingPayload) => {
    const res = await axiosInstance.post<ApiResponse<Booking>>("/booking", payload);
    return mapBooking(res.data.data);
  },

  update: async (id: string, payload: UpdateBookingPayload) => {
    const res = await axiosInstance.patch<ApiResponse<Booking>>(`/booking/${id}`, payload);
    return mapBooking(res.data.data);
  },

  cancel: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse<Booking>>(`/booking/${id}`);
    return mapBooking(res.data.data);
  },

  confirm: async (id: string) => {
    const res = await axiosInstance.post<ApiResponse<Booking>>(`/booking/${id}/confirm`);
    return mapBooking(res.data.data);
  },

  checkIn: async (id: string) => {
    const res = await axiosInstance.post<ApiResponse<Booking>>(`/booking/${id}/check-in`);
    return mapBooking(res.data.data);
  },

  checkOut: async (id: string) => {
    const res = await axiosInstance.post<ApiResponse<Booking>>(`/booking/${id}/check-out`);
    return mapBooking(res.data.data);
  },
};
