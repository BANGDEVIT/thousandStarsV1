export interface Booking {
  id: string;
  booking_type: string;
  status: string;
  check_in_date: string;
  check_out_date: string;
  actual_check_in?: string | null;
  actual_check_out?: string | null;
  nights: number;
  total_room_price: number;
  customer?: {
    id: string;
    full_name: string;
    phone?: string | null;
    email?: string | null;
  };
  rooms: {
    id: string;
    room_number: string;
    room_type_name: string;
    price_per_night: number;
    floor: number;
  }[];
  invoice: {
    total_amount: number;
    discount: number;
    final_amount: number;
    status: string;
  } | null;
  created_at: string;
}
export interface BookingState {
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  fetchBookings: (query?: BookingQuery) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
}
export interface BookingQuery {
  page?: number;
  limit?: number;
  status?: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
  booking_type?: "online" | "offline" | "walk_in";
  search?: string;
  from_date?: string;
  to_date?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface CreateBookingPayload {
  customer_id?: string;
  room_ids: string[];
  check_in_date: string;
  check_out_date: string;
  booking_type: "online" | "walk_in";
  override_prices?: Record<string, number>;
}
