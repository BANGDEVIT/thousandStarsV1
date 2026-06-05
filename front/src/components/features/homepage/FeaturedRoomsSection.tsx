import { useEffect } from "react";
import { useRoomStore } from "@/stores/room.store";
import { useNavigate } from "react-router";

const BED_TYPE_LABEL: Record<string, string> = {
  single: "1 giường đơn",
  double: "1 giường đôi",
  twin: "2 giường đơn",
  king: "1 giường King",
  queen: "1 giường Queen",
};

const STATUS_AVAILABLE = "available";

const CARD_GRADIENTS = [
  "from-[#1a3a50] to-[#0D2535]",
  "from-[#2d4a3e] to-[#162820]",
  "from-[#3d2a1a] to-[#1e1209]",
];

export function FeaturedRoomsSection() {
  const { rooms, loading, fetchRooms } = useRoomStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy phòng available, đủ để hiển thị showcase — public endpoint, không cần auth
    fetchRooms({ status: STATUS_AVAILABLE, limit: 50, page: 1 });
  }, [fetchRooms]);

  // Group phòng theo loại, lấy tối đa 3 loại khác nhau, mỗi loại lấy 1 đại diện
  const grouped = (() => {
    const map = new Map<string, (typeof rooms)[0]>();
    for (const room of rooms) {
      if (room.room_type && !map.has(room.room_type.id)) {
        map.set(room.room_type.id, room);
      }
      if (map.size >= 3) break;
    }
    return Array.from(map.values());
  })();

  // Đếm số phòng available theo từng loại
  const countByType = (typeId: string) =>
    rooms.filter((r) => r.room_type?.id === typeId).length;

  return (
    <section className="bg-[#F5F0E8] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#335F76]" />
              <span className="text-[#335F76] text-xs font-semibold tracking-[0.3em] uppercase">
                Phòng nghỉ
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0D2535] leading-tight font-['Lora']">
              Không gian nghỉ<br />
              <span className="text-[#335F76]">dưỡng lý tưởng</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/rooms")}
            className="self-start md:self-auto px-6 py-3 border-2 border-[#335F76] text-[#335F76] font-semibold text-sm rounded-full hover:bg-[#335F76] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Xem tất cả phòng →
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-[#E5DAC2]/50 animate-pulse" />
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <p className="text-center text-[#335F76]/60 py-16">Hiện chưa có phòng trống.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {grouped.map((room, i) => {
              const rt = room.room_type;
              const availableCount = countByType(rt.id);
              return (
                <div
                  key={room.id}
                  className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} group cursor-pointer`}
                  onClick={() => navigate("/rooms")}
                >
                  {/* Ảnh phòng nếu có */}
                  {room.images && room.images.length > 0 ? (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={room.images[0]}
                        alt={rt.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                    </div>
                  ) : (
                    // Placeholder khi không có ảnh
                    <div className="h-44 flex items-center justify-center opacity-20">
                      <span className="text-white text-6xl">🏨</span>
                    </div>
                  )}

                  {/* Top decorative line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="p-7 flex flex-col gap-4">
                    {/* Badges */}
                    <div className="flex items-center justify-between">
                      <span className="bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/10">
                        {rt.capacity} khách · {BED_TYPE_LABEL[rt.bed_type] ?? rt.bed_type}
                      </span>
                      <span className="text-emerald-400 text-xs font-semibold">
                        {availableCount} phòng trống
                      </span>
                    </div>

                    {/* Tên loại phòng */}
                    <h3 className="text-white text-xl font-bold font-['Lora'] group-hover:text-[#E5DAC2] transition-colors">
                      {rt.name}
                    </h3>

                    {/* Amenities */}
                    {Array.isArray(rt.amenities) && rt.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {rt.amenities.slice(0, 4).map((a: string, j: number) => (
                          <span
                            key={j}
                            className="text-white/50 text-xs border border-white/10 px-2.5 py-1 rounded-full"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price + arrow */}
                    <div className="flex items-end justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-white/50 text-xs">Giá từ</div>
                        <div className="text-[#E5DAC2] text-2xl font-bold font-['Lora']">
                          {Number(rt.base_price).toLocaleString("vi-VN")}đ
                        </div>
                        <div className="text-white/40 text-xs">/ đêm</div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#E5DAC2] group-hover:border-[#E5DAC2] transition-all">
                        <span className="text-white group-hover:text-[#0D2535] text-sm font-bold transition-colors">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
