import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const ROOMS_PER_PAGE = 7;

const mockRooms = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  code: `HCM0${Math.ceil((i + 1) / 12)}L${200 + ((i % 12) + 1)}`,
  name: [
    "Phòng Superior Hướng Vườn",
    "Phòng Deluxe Hướng Biển",
    "Phòng Suite Hướng Thành Phố",
  ][i % 3],
  branch: `HCM0${Math.ceil((i + 1) / 12)}`,
  status: i % 7 !== 3 ? "Hoạt động" : "Bảo trì",
}));

const branches = ["Tất cả vị trí", "HCM01", "HCM02", "HCM03"];
const statuses = ["Tất cả trạng thái", "Hoạt động", "Bảo trì", "Ngừng hoạt động"];

export default function RoomsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("Tất cả vị trí");
  const [status, setStatus] = useState("Tất cả trạng thái");
  const [page, setPage] = useState(1);

  const filtered = mockRooms.filter((r) => {
    const matchSearch =
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch === "Tất cả vị trí" || r.branch === branch;
    const matchStatus = status === "Tất cả trạng thái" || r.status === status;
    return matchSearch && matchBranch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ROOMS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ROOMS_PER_PAGE, page * ROOMS_PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <nav className="text-xs text-slate-400 mb-1">
          Bảng điều khiển &gt; <span className="text-slate-600">Quản lí phòng</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2744]">Phòng</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Quản lí hồ sơ của toàn bộ phòng khách sạn
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/rooms/new")}
            className="bg-[#1a2744] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#243156] transition-colors"
          >
            <Plus size={16} /> Tạo phòng mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Mã phòng, tên phòng,..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9]"
            />
          </div>
          <select
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30"
            value={branch}
            onChange={(e) => { setBranch(e.target.value); setPage(1); }}
          >
            {branches.map((b) => <option key={b}>{b}</option>)}
          </select>
          <select
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button
            onClick={() => { setSearch(""); setBranch("Tất cả vị trí"); setStatus("Tất cả trạng thái"); setPage(1); }}
            className="text-sm text-slate-500 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left px-6 py-3 font-medium">STT</th>
                <th className="text-left px-6 py-3 font-medium">Mã phòng</th>
                <th className="text-left px-6 py-3 font-medium">Tên phòng</th>
                <th className="text-left px-6 py-3 font-medium">Chi nhánh</th>
                <th className="text-left px-6 py-3 font-medium">Trạng thái</th>
                <th className="text-left px-6 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((room, i) => (
                <tr
                  key={room.id}
                  className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-3 text-slate-500">
                    {(page - 1) * ROOMS_PER_PAGE + i + 1}
                  </td>
                  <td className="px-6 py-3 font-medium text-[#1a2744]">{room.code}</td>
                  <td className="px-6 py-3 text-slate-600">{room.name}</td>
                  <td className="px-6 py-3 text-slate-600">{room.branch}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        room.status === "Hoạt động"
                          ? "text-green-600 bg-green-50"
                          : "text-amber-600 bg-amber-50"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${room.status === "Hoạt động" ? "bg-green-500" : "bg-amber-500"}`} />
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Trang {page}/{totalPages} - Tổng {filtered.length} phòng
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={13} /> trước
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              sau <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
