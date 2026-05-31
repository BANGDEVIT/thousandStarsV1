import { useState } from "react";
import { Search, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

const ITEMS_PER_PAGE = 7;

const mockCheckouts = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  roomCode: `HCM0${Math.ceil((i + 1) / 12)}L${200 + ((i % 12) + 1)}`,
  customer: "Khách Văn Hàng",
  phone: "0901234567",
  status: "Đang sử dụng",
}));

export default function CheckoutListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filtered = mockCheckouts.filter(
    (c) =>
      c.roomCode.toLowerCase().includes(search.toLowerCase()) ||
      c.customer.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-slate-400 mb-1">
          Nhân viên &gt; <span className="text-slate-600">Check out</span>
        </p>
        <h2 className="text-2xl font-bold text-[#1a2744]">Check out</h2>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Mã phòng, tên phòng,..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9]"
            />
          </div>
          <button className="bg-[#1a2744] text-white text-sm px-5 py-2 rounded-xl hover:bg-[#243156] transition-colors">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs">
              <th className="text-left px-6 py-3 font-medium">STT</th>
              <th className="text-left px-6 py-3 font-medium">Mã phòng</th>
              <th className="text-left px-6 py-3 font-medium">Tên khách hàng</th>
              <th className="text-left px-6 py-3 font-medium">Số điện thoại</th>
              <th className="text-left px-6 py-3 font-medium">Trạng thái</th>
              <th className="text-left px-6 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr
                key={row.id}
                className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer"
                onClick={() => navigate(`/employee/checkout/${row.id}`)}
              >
                <td className="px-6 py-3 text-slate-500">
                  {(page - 1) * ITEMS_PER_PAGE + i + 1}
                </td>
                <td className="px-6 py-3 font-medium text-[#1a2744]">{row.roomCode}</td>
                <td className="px-6 py-3 text-slate-600">{row.customer}</td>
                <td className="px-6 py-3 text-slate-600">{row.phone}</td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
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
