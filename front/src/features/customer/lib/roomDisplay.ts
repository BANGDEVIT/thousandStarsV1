import type { PublicRoom } from "@/features/customer/types";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
];

const AMENITY_ICONS: Record<string, string> = {
  wifi: "📶",
  tv: "📺",
  air_conditioning: "❄️",
  minibar: "🍷",
  bathtub: "🛁",
  balcony: "🌅",
  pool: "🏊",
  gym: "🏋️",
  breakfast: "🍳",
  parking: "🅿️",
  safe: "🔒",
  hair_dryer: "💨",
};

export function roomDetailPath(roomId: string) {
  return `/hotels/${roomId}`;
}

export function formatVndShort(amount: number) {
  const value = Number(amount);
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
  }
  return `${Math.round(value / 1000)}K`;
}

export function formatVndFull(amount: number) {
  return `${Number(amount).toLocaleString("vi-VN")}đ`;
}

export function getRoomImage(room: PublicRoom, index = 0) {
  if (room.images?.length) return room.images[index % room.images.length];
  return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
}

export function getAmenityIcons(amenities: string[]) {
  return amenities.map((a) => AMENITY_ICONS[a] ?? "✨");
}

export function getRoomTitle(room: PublicRoom) {
  return `${room.room_type.name} · ${room.room_number}`;
}

export function getRoomLocationLabel(room: PublicRoom) {
  return `Tầng ${room.floor} · Sức chứa ${room.room_type.capacity} khách`;
}

export const BED_TYPE_LABELS: Record<string, string> = {
  single: "Giường đơn",
  double: "Giường đôi",
  twin: "Giường twin",
  king: "Giường King",
  queen: "Giường Queen",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  checked_in: "Đã nhận phòng",
  checked_out: "Đã trả phòng",
  cancelled: "Đã hủy",
};
