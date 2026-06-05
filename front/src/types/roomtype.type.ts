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

export interface CreateRoomTypeDto {
  name: string;
  bed_type: string;
  base_price: number;
  capacity: number;
  amenities: string[];
}

export interface RoomTypeResponse{
  data: RoomType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetRoomsTypeQuery {
  page?: number;
  limit?: number;
  search?: string;      // Dùng để tìm kiếm theo tên loại phòng
  bed_type?: string;    // Dùng để lọc theo loại giường (single, double, king,...)
  capacity?: number;    // Dùng để lọc theo sức chứa (người)
  sortBy?: string;      // Dùng để xác định cột cần sắp xếp (name, base_price, capacity,...)
  order?: 'asc' | 'desc'; // Dùng để xác định chiều sắp xếp (tăng dần/giảm dần)
}

export interface UpdateRoomTypeDto {
  name: string;
  bed_type: string;
  base_price: number;
  capacity: number;
  amenities: string[];
}