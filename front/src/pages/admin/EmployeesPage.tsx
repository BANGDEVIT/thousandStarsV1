import { useState } from "react";
import { Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const POSITIONS = ["Tất cả vị trí", "Quản lí", "Lễ tân", "Buồng phòng", "Bảo vệ", "Kỹ thuật"];
const STATUSES = ["Tất cả trạng thái", "Hoạt động", "Nghỉ phép", "Nghỉ việc"];

const mockEmployees = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  fullName: "Bùi Công Bằng",
  email: "bcb1205@gmail.com",
  phone: "0123456789",
  position: i % 4 === 0 ? "Lễ tân" : "Quản lí",
  gender: i % 3 === 2 ? "Nữ" : "Nam",
  status: i % 8 === 5 ? "Nghỉ phép" : "Hoạt động",
}));

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("Tất cả vị trí");
  const [status, setStatus] = useState("Tất cả trạng thái");
  const [page, setPage] = useState(1);

  const filtered = mockEmployees.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.fullName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.phone.includes(q);
    const matchPos = position === "Tất cả vị trí" || e.position === position;
    const matchStatus = status === "Tất cả trạng thái" || e.status === status;
    return matchSearch && matchPos && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <nav className="flex items-center gap-1 text-xs text-slate-400 mb-1">
            <span>🏠</span>
            <span>Bảng điều khiển</span>
            <span>&gt;</span>
            <span className="text-slate-600">Quản lí nhân viên</span>
          </nav>
          <h2 className="text-3xl font-bold text-[#1a2744]">
            Nhân viên{" "}
            <span className="text-[#c9a227] font-bold">/{filtered.length}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Quản lí hồ sơ, vai trò và quyền quản lí của toàn bộ nhân viên khách sạn
          </p>
        </div>
        <button className="bg-[#1a2744] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#243156] transition-colors shrink-0 mt-6">
          <Plus size={16} /> Tạo nhân viên mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tên, email, số điện thoại ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9]"
            />
          </div>
          <select
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none"
            value={position}
            onChange={(e) => { setPosition(e.target.value); setPage(1); }}
          >
            {POSITIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button
            onClick={() => { setSearch(""); setPosition("Tất cả vị trí"); setStatus("Tất cả trạng thái"); setPage(1); }}
            className="text-sm text-slate-500 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Filter size={13} /> Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-100">
              <th className="text-left px-6 py-3 font-medium">STT</th>
              <th className="text-left px-6 py-3 font-medium">Họ tên</th>
              <th className="text-left px-6 py-3 font-medium">Email</th>
              <th className="text-left px-6 py-3 font-medium">Điện thoại</th>
              <th className="text-left px-6 py-3 font-medium">Vị trí</th>
              <th className="text-left px-6 py-3 font-medium">Giới tính</th>
              <th className="text-left px-6 py-3 font-medium">Trạng thái</th>
              <th className="text-left px-6 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((emp, i) => (
              <tr
                key={emp.id}
                className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-6 py-3.5 text-slate-400 text-xs">{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td className="px-6 py-3.5 font-medium text-[#1a2744]">{emp.fullName}</td>
                <td className="px-6 py-3.5">
                  <a href={`mailto:${emp.email}`} className="text-blue-500 hover:underline">
                    {emp.email}
                  </a>
                </td>
                <td className="px-6 py-3.5 text-slate-600">{emp.phone}</td>
                <td className="px-6 py-3.5">
                  <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                    {emp.position}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-slate-600">{emp.gender}</td>
                <td className="px-6 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      emp.status === "Hoạt động"
                        ? "text-green-600 bg-green-50"
                        : "text-amber-600 bg-amber-50"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        emp.status === "Hoạt động" ? "bg-green-500" : "bg-amber-500"
                      }`}
                    />
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Trang {page}/{totalPages} - Tổng {filtered.length} nhân viên
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
