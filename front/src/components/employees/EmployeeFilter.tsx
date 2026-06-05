import { useEmployeeStore } from "@/stores/employeeStore";
import { useCallback } from "react";

const POSITIONS = [
  "Lễ tân",
  "Quản lý",
  "Bảo vệ",
  "Kỹ thuật",
  "Đầu bếp",
  "Dọn phòng",
];
const GENDERS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

export default function EmployeeFilters() {
  const { filters, setFilters } = useEmployeeStore();

  const set = useCallback(
    (key: string, val: string) => setFilters({ [key]: val, page: 1 }),
    [setFilters],
  );

  const clear = () =>
    setFilters({ search: "", position: "", gender: "", page: 1 });

  return (
    <div
      className="bg-white border border-[#E2E2D8] rounded-xl px-4 py-3.5
                    flex items-center gap-3 mb-4 flex-wrap"
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 border border-[#E2E2D8] rounded-lg
                      px-3 py-2 bg-[#F7F7F5] flex-1 min-w-[220px]
                      focus-within:border-[#1B3A5C] focus-within:ring-2
                      focus-within:ring-[#1B3A5C]/10 transition-all"
      >
        <svg
          className="text-[#64748B] flex-shrink-0"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="bg-transparent outline-none text-[13px] text-[#0A0A0A]
                     placeholder:text-[#64748B] w-full"
          placeholder="Tên, email, mã NV, số điện thoại..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>

      {/* Position */}
      <select
        className="border border-[#E2E2D8] rounded-lg px-3 py-2 text-[13px]
                   text-[#0A0A0A] bg-white cursor-pointer outline-none min-w-[150px]
                   focus:border-[#1B3A5C] focus:ring-2 focus:ring-[#1B3A5C]/10"
        value={filters.position}
        onChange={(e) => set("position", e.target.value)}
      >
        <option value="">Tất cả vị trí</option>
        {POSITIONS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Gender */}
      <select
        className="border border-[#E2E2D8] rounded-lg px-3 py-2 text-[13px]
                   text-[#0A0A0A] bg-white cursor-pointer outline-none min-w-[140px]
                   focus:border-[#1B3A5C] focus:ring-2 focus:ring-[#1B3A5C]/10"
        value={filters.gender}
        onChange={(e) => set("gender", e.target.value)}
      >
        <option value="">Tất cả giới tính</option>
        {GENDERS.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>

      {/* Clear */}
      <button
        className="flex items-center gap-1.5 text-[#64748B] text-[13px] px-3 py-2
                   rounded-lg border border-[#E2E2D8] bg-white hover:bg-[#F0F0EA]
                   transition-colors ml-auto"
        onClick={clear}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        Xoá bộ lọc
      </button>
    </div>
  );
}
