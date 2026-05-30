import { useOutletContext } from "react-router"; // Hoặc "react-router-dom" tùy phiên bản

// ==========================================
// 1. CORE TYPES & GENERICS
// ==========================================

// Định nghĩa cấu trúc phản hồi phân trang chung
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==========================================
// 2. ENTITY INTERFACES
// ==========================================

// Kiểu dữ liệu Loại phòng
export interface RoomType {
  id: string;
  name: string;
  base_price: number;
  capacity: number;
  amenities: string[];
  bed_type: string;
  created_at: string;
  updated_at: string;
}

// Kiểu dữ liệu Phòng chi tiết
export interface Room {
  id: string;
  room_number: string;
  floor: number;
  status: "available" | "occupied" | "cleaning" | "maintenance";
  room_type: RoomType;
  created_at: string;
  updated_at: string;
}

// Kiểu dữ liệu Khách hàng
export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email: string;
}

// Kiểu dữ liệu Hóa đơn
export interface Invoice {
  id: string;
  total_amount: number;
  discount: number;
  final_amount: number;
  status: "paid" | "unpaid";
}

// Kiểu dữ liệu Phòng trong danh sách đặt phòng
export interface BookingRoom {
  id: string;
  room_number: string;
  room_type_name: string;
  price_per_night: number;
  floor: number;
}

// Kiểu dữ liệu Đơn đặt phòng (Booking)
export interface Booking {
  id: string;
  booking_type: "online" | "offline";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  check_in_date: string;
  check_out_date: string;
  actual_check_in: string | null;
  actual_check_out: string | null;
  nights: number;
  total_room_price: number;
  customer: Customer;
  rooms: BookingRoom[];
  invoice: Invoice;
  created_at: string;
  updated_at: string;
}

// ==========================================
// 3. CONTEXT & HOOKS
// ==========================================

// Định nghĩa kiểu dữ liệu cho Context chung của Dashboard
export interface DashboardContextType {
  roomsData: PaginatedResponse<Room>;
  bookingsData: PaginatedResponse<Booking>;
}

// Export custom hook để các component con sử dụng
export function useDashboardContext() {
  return useOutletContext<DashboardContextType>();
}