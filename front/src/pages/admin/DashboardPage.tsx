import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MoreHorizontal, Download, Printer, LogIn, LogOut } from "lucide-react";

// --- Mock Data ---
const revenueData = [
  { month: "T1", value: 38 },
  { month: "T2", value: 42 },
  { month: "T3", value: 20 },
  { month: "T4", value: 55 },
  { month: "T5", value: 30 },
  { month: "T6", value: 18 },
];

const trendData = [
  { month: "T1", value: 45 },
  { month: "T2", value: 20 },
  { month: "T3", value: 38 },
  { month: "T4", value: 15 },
  { month: "T5", value: 50 },
  { month: "T6", value: 28 },
];

const bookingSourceData = [
  { name: "OTA", value: 47, color: "#4ade80" },
  { name: "Walk-in", value: 38, color: "#a78bfa" },
  { name: "Direct", value: 18, color: "#34d399" },
  { name: "Agency", value: 2, color: "#fbbf24" },
  { name: "Other", value: 1, color: "#60a5fa" },
];

const bookingList = Array.from({ length: 6 }, () => ({
  id: `DS2904`,
  name: "Nguyễn Khai Tâm",
  roomType: "Deluxe suite",
  room: "401",
  nights: "2 đêm",
  dates: "16/5 - 18/5 , 2026",
  status: "Đã nhận phòng",
}));

export default function DashboardPage() {
  const [revenueRange, setRevenueRange] = useState("6 tháng");
  const [bookingRange, setBookingRange] = useState("6 tháng");

  return (
    <div className="space-y-5">
      {/* Top stats card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap gap-4 items-stretch">
          {/* Date + Revenue */}
          <div className="flex-1 min-w-[220px] bg-[#f0f4fa] rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2">
              Thứ 7, Ngày 16 Tháng 5 Năm 2026
            </p>
            <p className="text-sm font-semibold text-slate-600 mb-1">
              Tổng doanh thu
            </p>
            <p className="text-2xl font-bold text-[#1a2744]">36,750,000đ</p>
          </div>

          {/* Check-in */}
          <div className="flex-1 min-w-[160px] bg-[#f0f4fa] rounded-xl p-4 flex flex-col items-center justify-center gap-1">
            <LogIn size={22} className="text-[#4a90d9]" />
            <p className="text-xs text-slate-500">Khách đã nhận phòng</p>
            <p className="text-3xl font-bold text-[#1a2744]">127</p>
          </div>

          {/* Check-out */}
          <div className="flex-1 min-w-[160px] bg-[#f0f4fa] rounded-xl p-4 flex flex-col items-center justify-center gap-1">
            <LogOut size={22} className="text-[#4a90d9]" />
            <p className="text-xs text-slate-500">Khách đã trả phòng</p>
            <p className="text-3xl font-bold text-[#1a2744]">105</p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-[#1a2744]">Doanh thu</h3>
            <select
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none"
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
            >
              <option>6 tháng</option>
              <option>12 tháng</option>
              <option>30 ngày</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a90d9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4a90d9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [`${v}tr`, "Doanh thu"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4a90d9"
                fill="url(#colorRev)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trend chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-[#1a2744]">Xu hướng</h3>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none">
              <option>6 tháng</option>
              <option>12 tháng</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={trendData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-[#1a2744]">Phòng trống</h3>
            <MoreHorizontal size={18} className="text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">
            Tổng phòng:{" "}
            <span className="font-bold text-[#1a2744] text-base">150</span>
          </p>
          {/* Bar indicator */}
          <div className="flex gap-0.5 mt-3 mb-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="h-5 flex-1 rounded-sm"
                style={{
                  backgroundColor:
                    i < 10 ? "#4a90d9" : i < 16 ? "#4ade80" : "#fbbf24",
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#4a90d9] inline-block" />
              Đang có khách
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#4ade80] inline-block" />
              Đang trống
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#fbbf24] inline-block" />
              Đã đặt
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" />
              Chưa có phòng
            </div>
          </div>
        </div>
      </div>

      {/* Bottom charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Booking source */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-[#1a2744]">Nguồn booking</h3>
            <MoreHorizontal size={18} className="text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={bookingSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  dataKey="value"
                >
                  {bookingSourceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 text-xs">
              {bookingSourceData.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-slate-600">
                    {s.name}: {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-[#1a2744]">Tỷ lệ đánh giá</h3>
            <MoreHorizontal size={18} className="text-slate-400" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-center gap-3">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#fbbf24] to-[#4ade80]"
                style={{ width: "92%" }}
              />
            </div>
            <p className="text-4xl font-bold text-[#1a2744]">4.6/5.0</p>
          </div>
        </div>
      </div>

      {/* Booking list */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-[#1a2744] text-lg">
            Danh sách booking
          </h3>
          <select
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none"
            value={bookingRange}
            onChange={(e) => setBookingRange(e.target.value)}
          >
            <option>6 tháng</option>
            <option>12 tháng</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs border-b border-slate-100">
                <th className="text-left pb-3 font-medium">
                  Họ tên và ID booking
                </th>
                <th className="text-left pb-3 font-medium">Loại phòng</th>
                <th className="text-left pb-3 font-medium">Số phòng</th>
                <th className="text-left pb-3 font-medium">Khoảng lưu trú</th>
                <th className="text-left pb-3 font-medium">
                  Checkin&Checkout
                </th>
                <th className="text-left pb-3 font-medium">Tình trạng</th>
              </tr>
            </thead>
            <tbody>
              {bookingList.map((b, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 font-medium text-[#1a2744]">
                    {b.name} -{" "}
                    <span className="text-slate-400 font-normal">{b.id}</span>
                  </td>
                  <td className="py-3 text-slate-600">{b.roomType}</td>
                  <td className="py-3 text-slate-600">{b.room}</td>
                  <td className="py-3 text-slate-600">{b.nights}</td>
                  <td className="py-3 text-slate-600">{b.dates}</td>
                  <td className="py-3">
                    <span className="text-[#4ade80] font-medium text-xs bg-green-50 px-2 py-0.5 rounded-full">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <span className="text-sm text-slate-600">Chọn định dạng file :</span>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none">
            <option>File báo cáo thống kê</option>
            <option>Excel (.xlsx)</option>
            <option>PDF</option>
          </select>
          <button className="bg-[#1a2744] text-white text-sm px-5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-[#243156] transition-colors">
            <Download size={15} /> Xuất file
          </button>
          <button className="bg-[#2d3f6e] text-white text-sm px-5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-[#3a4f82] transition-colors">
            <Printer size={15} /> In báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
