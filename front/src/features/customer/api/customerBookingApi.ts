import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse, PaginatedResult } from "@/api/types";
import { normalizePagination } from "@/api/types";
import type { CreateCustomerBookingPayload, CustomerBooking } from "@/features/customer/types";

const PLACEHOLDER_CUSTOMER_ID = "00000000-0000-4000-8000-000000000001";

function mapBooking(booking: CustomerBooking): CustomerBooking {
  return {
    ...booking,
    check_in_date: booking.check_in_date.split("T")[0] ?? booking.check_in_date,
    check_out_date: booking.check_out_date.split("T")[0] ?? booking.check_out_date,
    nights: Number(booking.nights),
    rooms: booking.rooms.map((room) => ({
      ...room,
      price_per_night: Number(room.price_per_night),
      floor: Number(room.floor),
    })),
    invoice: booking.invoice
      ? {
          ...booking.invoice,
          total_amount: Number(booking.invoice.total_amount),
          discount: Number(booking.invoice.discount),
          final_amount: Number(booking.invoice.final_amount),
        }
      : null,
  };
}

export const customerBookingApi = {
  getMyBookings: async (params?: { page?: number; limit?: number; status?: string }) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedResult<CustomerBooking>>>(
      "/booking/my-booking",
      {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          status: params?.status || undefined,
        },
      },
    );
    const page = normalizePagination(res.data.data);
    return {
      ...page,
      data: page.data.map(mapBooking),
    };
  },

  createBooking: async (payload: CreateCustomerBookingPayload) => {
    const res = await axiosInstance.post<ApiResponse<CustomerBooking>>("/booking", {
      customer_id: PLACEHOLDER_CUSTOMER_ID,
      room_ids: payload.room_ids,
      check_in_date: payload.check_in_date,
      check_out_date: payload.check_out_date,
      booking_type: payload.booking_type,
    });
    return mapBooking(res.data.data);
  },

  cancelBooking: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse<CustomerBooking>>(`/booking/${id}`);
    return mapBooking(res.data.data);
  },
};
