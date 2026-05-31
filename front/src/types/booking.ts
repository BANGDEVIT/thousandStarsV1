export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type BookingType = "online" | "walk_in";

export interface BookingCustomer {
  id: string;
  full_name: string;
  phone: string;
  email: string;
}

export interface BookingRoom {
  id: string;
  room_number: string;
  room_type_name: string;
  price_per_night: number;
  floor: number;
}

export interface BookingInvoiceSummary {
  id: string;
  total_amount: number;
  discount: number;
  final_amount: number;
  status: string;
}

export interface Booking {
  id: string;
  booking_type: BookingType;
  status: BookingStatus;
  check_in_date: string;
  check_out_date: string;
  actual_check_in: string | null;
  actual_check_out: string | null;
  nights: number;
  special_requests: string | null;
  customer: BookingCustomer;
  rooms: BookingRoom[];
  invoice: BookingInvoiceSummary | null;
  created_at: string;
  updated_at: string;
}

export interface BookingFilters {
  status: string;
  booking_type: string;
  customer_id: string;
  from_date: string;
  to_date: string;
  search: string;
  page: number;
  limit: number;
}

export interface CreateBookingPayload {
  customer_id: string;
  room_ids: string[];
  check_in_date: string;
  check_out_date: string;
  booking_type: BookingType;
  override_prices?: Record<string, number>;
  special_requests?: string;
}

export interface UpdateBookingPayload {
  room_ids?: string[];
  check_in_date?: string;
  check_out_date?: string;
  special_requests?: string;
  override_prices?: Record<string, number>;
}
