import { BedDouble, MapPin, Users, Wifi } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import type { Room } from "@/types/room.type";

interface RoomCardProps {
  room: Room;
}

const bedTypeLabel: Record<string, string> = {
  single: "Giường đơn",
  double: "Giường đôi",
  twin: "Hai giường đơn",
  king: "Giường King",
  queen: "Giường Queen",
};

export default function RoomCard({ room }: RoomCardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const roomType = room.room_type;
  const hasImage = room.images?.[0];
  const statusLabel = room.status === "available" ? "Còn trống" : "Đã đặt";

  const goToDetail = () => {
    navigate(`/rooms/${room.id}${location.search}`);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#335F76]/10 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={goToDetail}
        className="block h-56 w-full overflow-hidden bg-[#0D2535] text-left"
      >
        {hasImage ? (
          <img
            src={room.images[0]}
            alt={roomType.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a3a50] to-[#0D2535] text-white/30">
            <BedDouble className="h-16 w-16" />
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-['Lora'] text-xl font-bold leading-snug text-[#0D2535]">
            {roomType.name}
          </h3>
          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {statusLabel}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#335F76]/65">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            Tầng {room.floor} · Phòng {room.room_number}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm text-[#0D2535] sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-[#B8852D]" />
            {bedTypeLabel[roomType.bed_type] ?? roomType.bed_type}
          </span>
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-[#B8852D]" />
            {roomType.capacity} khách
          </span>
          <span className="inline-flex items-center gap-2 sm:col-span-2">
            <Wifi className="h-4 w-4 text-[#B8852D]" />
            {roomType.amenities?.slice(0, 2).join(", ") || "WiFi"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#335F76]/10 pt-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[#335F76]/55">
              Giá từ
            </div>
            <div className="font-['Lora'] text-2xl font-bold text-[#0D2535]">
              {Number(roomType.base_price).toLocaleString("vi-VN")}đ
            </div>
          </div>
          <button
            type="button"
            onClick={goToDetail}
            className="rounded-full bg-[#0D2535] px-4 py-2 text-sm font-bold text-[#E5DAC2] transition hover:bg-[#335F76]"
          >
            Đặt phòng
          </button>
        </div>
      </div>
    </article>
  );
}
