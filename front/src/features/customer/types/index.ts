export interface PublicRoomType {
  id: string;
  name: string;
  base_price: number;
  capacity: number;
  bed_type: string;
  amenities: string[];
}

export interface PublicRoom {
  id: string;
  room_number: string;
  floor: number;
  status: string;
  images?: string[];
  room_type: PublicRoomType;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  reward_points: number;
  updated_at: string;
}

export interface CustomerBookingRoom {
  id: string;
  room_number: string;
  room_type_name: string;
  price_per_night: number;
  floor: number;
}

export interface CustomerBooking {
  id: string;
  booking_type: string;
  status: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  customer: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
  };
  rooms: CustomerBookingRoom[];
  invoice: {
    id: string;
    total_amount: number;
    discount: number;
    final_amount: number;
    status: string;
  } | null;
  created_at: string;
}

export interface CreateCustomerBookingPayload {
  room_ids: string[];
  check_in_date: string;
  check_out_date: string;
  booking_type: "online" | "walk_in";
}
