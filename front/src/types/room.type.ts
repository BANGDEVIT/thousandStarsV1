import type { RoomType } from "./roomtype.type";
export interface Room {
  id: string;
  room_number: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'inactive';
  room_type: RoomType;
  created_at: string;
  updated_at: string;
  images: string[];
}

export interface CreateRoomDto {
  room_number: string;
  room_type_id: string;
  floor: number;
}

export interface RoomsResponse {
  data: Room[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetRoomsQuery {
  page?: number;
  limit?: number;
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'inactive';
  room_type_id?: string;
  floor?: number;
  sortBy?: 'room_number' | 'floor' | 'status' | 'created_at';
  order?: 'asc' | 'desc';
  search?: string;
}

export interface UpdateRoomDto {
  room_number?: string;
  room_type_id?: string;
  floor?: number;
}

export interface UpdateRoomStatusDto {
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'inactive';
}

export interface RoomAvailabilityResponse {
  room_id: string;
  room_number: string;
  available: boolean;
  reason: "ROOM_STATUS_UNAVAILABLE" | "DATE_RANGE_CONFLICT" | null;
  conflictBookings: ConflictBooking[];
  conflicting_booking?: ConflictBooking | null;
  message: string;
}
export interface ConflictBooking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
}
