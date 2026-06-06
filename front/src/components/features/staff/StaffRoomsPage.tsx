import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { getRooms } from "@/services/room.service";
import type { GetRoomsQuery, Room } from "@/types/room.type";

const statusInfo: Record<Room["status"], { label: string; className: string }> = {
  available: { label: "Trống", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  occupied: { label: "Đã đặt", className: "border-blue-200 bg-blue-50 text-blue-700" },
  maintenance: { label: "Bảo trì", className: "border-amber-200 bg-amber-50 text-amber-700" },
  cleaning: { label: "Đang dọn", className: "border-purple-200 bg-purple-50 text-purple-700" },
  inactive: { label: "Ngừng hoạt động", className: "border-slate-200 bg-slate-50 text-slate-600" },
};

export function StaffRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<GetRoomsQuery["status"] | "">("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getRooms({
          page: 1,
          limit: 100,
          status: status || undefined,
          search: search || undefined,
        });
        setRooms(response.data);
      } catch {
        toast.error("Không thể tải danh sách phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [status, search]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#335F76]/10 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#335F76]/50" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#335F76]/15 bg-white px-10 text-sm outline-none transition focus:border-[#B8852D]"
            placeholder="Tìm số phòng..."
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as GetRoomsQuery["status"] | "")}
          className="h-11 rounded-lg border border-[#335F76]/15 bg-white px-3 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="available">Trống</option>
          <option value="occupied">Đã đặt</option>
          <option value="maintenance">Bảo trì</option>
          <option value="cleaning">Đang dọn</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#335F76]/10 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-100 text-left text-[#335F76]">
            <tr>
              <th className="px-4 py-3 font-semibold">Số phòng</th>
              <th className="px-4 py-3 font-semibold">Tầng</th>
              <th className="px-4 py-3 font-semibold">Loại phòng</th>
              <th className="px-4 py-3 font-semibold">Sức chứa</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[#335F76]/60">
                  Đang tải...
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[#335F76]/60">
                  Không có phòng phù hợp.
                </td>
              </tr>
            ) : (
              rooms.map((room) => {
                const info = statusInfo[room.status];

                return (
                  <tr key={room.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-semibold text-[#0D2535]">
                      {room.room_number}
                    </td>
                    <td className="px-4 py-4 text-[#335F76]">{room.floor}</td>
                    <td className="px-4 py-4 text-[#335F76]">
                      {room.room_type?.name ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-[#335F76]">
                      {room.room_type?.capacity ?? "—"} khách
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${info.className}`}>
                        {info.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
