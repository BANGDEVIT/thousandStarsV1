export interface Booking {
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
export interface BookingState {
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  fetchBookings: (query?: BookingQuery) => Promise<void>;
}
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
