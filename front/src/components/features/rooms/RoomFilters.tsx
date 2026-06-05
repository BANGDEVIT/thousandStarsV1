interface RoomFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "available", label: "Còn trống" },
  { value: "occupied", label: "Đã đặt" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "cleaning", label: "Đang dọn" },
];

export default function RoomFilters({
  statusFilter,
  setStatusFilter,
}: RoomFiltersProps) {
  return (
    <div className="mb-10 grid gap-4 rounded-2xl border border-[#335F76]/10 bg-white p-5 text-left shadow-sm md:grid-cols-[1fr_auto] md:items-end">
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#335F76]">
          Trạng thái
        </span>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => setStatusFilter("available")}
        className="h-11 rounded-md border border-[#335F76] px-5 text-sm font-bold text-[#335F76] transition hover:bg-[#335F76] hover:text-white"
      >
        Đặt lại lọc
      </button>
    </div>
  );
}
