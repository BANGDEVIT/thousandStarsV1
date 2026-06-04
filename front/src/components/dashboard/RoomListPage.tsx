import { useEffect, useState } from "react";
import { useRoomStore } from "@/stores/useRoomStore";
import { GenericTable, type ColumnDef } from "@/components/dashboard/GenericTable";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  available:   { label: "Trống",        color: "bg-green-100 text-green-700" },
  occupied:    { label: "Đang sử dụng", color: "bg-blue-100 text-blue-700" },
  maintenance: { label: "Bảo trì",      color: "bg-yellow-100 text-yellow-700" },
  cleaning:    { label: "Đang dọn",     color: "bg-purple-100 text-purple-700" },
  inactive:    { label: "Ngừng hoạt động", color: "bg-slate-100 text-slate-500" },
};

type Room = ReturnType<typeof useRoomStore.getState>["rooms"][number];

const columns: ColumnDef<Room>[] = [
  { key: "room_number", header: "Số phòng" },
  { key: "floor", header: "Tầng" },
  {
    key: "room_type",
    header: "Loại phòng",
    render: (row) => row.room_type.name,
  },
  {
    key: "bed_type",
    header: "Loại giường",
    render: (row) => <span className="capitalize">{row.room_type.bed_type}</span>,
  },
  {
    key: "capacity",
    header: "Sức chứa",
    render: (row) => `${row.room_type.capacity} người`,
  },
  {
    key: "base_price",
    header: "Giá/đêm",
    render: (row) => (
      <span className="font-medium text-[#335F76]">
        {row.room_type.base_price.toLocaleString("vi-VN")}đ
      </span>
    ),
  },
  {
    key: "status",
    header: "Trạng thái",
    render: (row) => {
      const s = STATUS_LABEL[row.status];
      return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s?.color}`}>
          {s?.label}
        </span>
      );
    },
  },
];

export default function RoomListPage() {
  const { rooms, totalPages, loading, fetchRooms } = useRoomStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "available" | "occupied" | "maintenance" | "cleaning" | "inactive">("");

  useEffect(() => {
    fetchRooms({
      page, limit: 10,
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      sortBy: "room_number", order: "asc",
    });
  }, [page, search, status, fetchRooms]);

  const toolbar = (
    <>
      <input
        placeholder="Tìm phòng..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none w-56"
      />
      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }}
        className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none cursor-pointer"
      >
        <option value="">Tất cả</option>
        <option value="available">Trống</option>
        <option value="occupied">Đang sử dụng</option>
        <option value="maintenance">Bảo trì</option>
        <option value="cleaning">Đang dọn</option>
        <option value="inactive">Ngừng hoạt động</option>
      </select>
    </>
  );

  return (
    <GenericTable
      columns={columns}
      data={rooms}
      loading={loading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      keyExtractor={(r) => r.id}
      toolbar={toolbar}
    />
  );
}