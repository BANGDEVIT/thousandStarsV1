export interface Room {
  id: string;
  room_number: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'inactive';
  room_type: RoomType;
  created_at: string;
  updated_at: string;
}

export interface RoomType {
  id: string;
  name: string;
  base_price: number;
  capacity: number;
  bed_type: string;
  amenities: string[];
  created_at?: string;
  updated_at?: string;
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
  status?: string;
  room_type_id?: string;
  floor?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface UpdateRoomDto {
  room_number?: string;
  room_type_id?: string;
  floor?: number;
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'inactive';
}