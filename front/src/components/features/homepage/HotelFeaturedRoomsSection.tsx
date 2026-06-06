import { BedDouble, Check, DoorOpen, MapPin, Wifi } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import type { Room } from "@/types/room.type";

interface HotelFeaturedRoomsSectionProps {
  loading: boolean;
  rooms: Room[];
}

const bedTypeLabel: Record<string, string> = {
  single: "Giường đơn",
  double: "Giường đôi",
  twin: "Hai giường đơn",
  king: "Giường King",
  queen: "Giường Queen",
};

const placeholderGradients = [
  "linear-gradient(135deg, #1a3a50 0%, #0D2535 100%)",
  "linear-gradient(135deg, #2d4a3e 0%, #162820 100%)",
  "linear-gradient(135deg, #3d2a1a 0%, #1e1209 100%)",
];

function getFeaturedRooms(rooms: Room[]) {
  const seenTypes = new Set<string>();
  const result: Room[] = [];

  for (const room of rooms) {
    const key = room.room_type?.id ?? room.id;
    if (!seenTypes.has(key)) {
      seenTypes.add(key);
      result.push(room);
    }
    if (result.length >= 3) break;
  }

  return result;
}

function formatPrice(value: number) {
  return Number(value || 0).toLocaleString("vi-VN");
}

function RoomFact({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm font-medium text-[#0D2535]">
      <Check className="h-3.5 w-3.5 shrink-0 text-[#B8852D]" />
      <span className="truncate">{children}</span>
    </li>
  );
}

function FeaturedRoomCard({
  room,
  index,
  onClick,
}: {
  room: Room;
  index: number;
  onClick: () => void;
}) {
  const roomType = room.room_type;
  const hasImage = room.images?.[0];
  const amenityLabels = roomType.amenities?.slice(0, 2) ?? [];
  const bedLabel =
    bedTypeLabel[roomType.bed_type] ?? roomType.bed_type ?? "Giường cao cấp";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={onClick}
        className="block h-56 w-full overflow-hidden"
        style={
          hasImage
            ? undefined
            : { background: placeholderGradients[index % placeholderGradients.length] }
        }
      >
        {hasImage ? (
          <img
            src={room.images[0]}
            alt={roomType.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            <BedDouble className="h-16 w-16" />
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-['Lora'] text-xl font-bold leading-snug text-[#0D2535]">
          {roomType.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#335F76]/65">
          <MapPin className="h-3.5 w-3.5" />
          <span>Thousand Stars · Tầng {room.floor}</span>
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <RoomFact>{bedLabel}</RoomFact>
          <RoomFact>{roomType.capacity} khách</RoomFact>
          <RoomFact>
            <span className="inline-flex items-center gap-1">
              <Wifi className="h-3.5 w-3.5" />
              {amenityLabels[0] ?? "WiFi"}
            </span>
          </RoomFact>
          <RoomFact>
            <span className="inline-flex items-center gap-1">
              <DoorOpen className="h-3.5 w-3.5" />
              {amenityLabels[1] ?? `Phòng ${room.room_number}`}
            </span>
          </RoomFact>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#335F76]/10 pt-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[#335F76]/55">
              Giá từ
            </div>
            <div className="font-['Lora'] text-2xl font-bold text-[#0D2535]">
              {formatPrice(roomType.base_price)}đ
            </div>
          </div>
          <button
            type="button"
            onClick={onClick}
            className="rounded-full bg-[#B8852D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#9A6D21]"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </article>
  );
}

export function HotelFeaturedRoomsSection({
  loading,
  rooms,
}: HotelFeaturedRoomsSectionProps) {
  const navigate = useNavigate();
  const featuredRooms = getFeaturedRooms(rooms);

  return (
    <section className="bg-white px-5 pb-24 pt-28 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="font-['Lora'] text-3xl font-bold text-[#0D2535] md:text-4xl">
            Phòng nổi bật
          </h2>
          <p className="mx-auto mt-3 block max-w-2xl text-center text-sm leading-relaxed text-[#335F76]/70">
            Các phòng đang khả dụng được lấy trực tiếp từ hệ thống Thousand Stars.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-gray-100" />
                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="h-16 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-[#335F76]/25 bg-[#E8F5F5] text-[#335F76]/70">
            Hiện chưa có phòng khả dụng.
          </div>
        ) : (
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {featuredRooms.map((room, index) => (
              <FeaturedRoomCard
                key={room.id}
                room={room}
                index={index}
                onClick={() => navigate(`/rooms/${room.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
