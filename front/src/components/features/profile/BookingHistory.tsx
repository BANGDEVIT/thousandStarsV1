import { useEffect, useState } from "react";
import { useBookingStore } from "@/stores/booking.store";
import { CalendarDays, BedDouble, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  checked_in: { label: "Đang ở", color: "bg-green-100 text-green-700" },
  checked_out: { label: "Đã trả phòng", color: "bg-slate-100 text-slate-600" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-500" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export function BookingHistory() {
  const { bookings, totalPages, loading, fetchBookings } = useBookingStore();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"" | "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled">("");

  useEffect(() => {
    fetchBookings({ page, limit: 5, ...(status ? { status } : {}) });
  }, [page, status, fetchBookings]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-[#335F76] text-xl font-bold font-['Lora']">Lịch sử đặt phòng</h2>
          <p className="text-slate-400 text-sm">Danh sách các booking của bạn</p>
        </div>

        {/* Filter status */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "" | "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled");
            setPage(1);
          }}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none cursor-pointer"
        >
          <option value="">Tất cả</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="checked_in">Đang ở</option>
          <option value="checked_out">Đã trả phòng</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Đang tải...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">Chưa có đặt phòng nào.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b) => {
            const statusInfo = STATUS_LABEL[b.status] ?? { label: b.status, color: "bg-slate-100 text-slate-600" };
            return (
              <div key={b.id} className="border border-slate-100 rounded-xl p-4 flex flex-col gap-3 hover:border-[#335F76]/30 transition-colors">

                {/* Row 1: phòng + status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BedDouble className="size-4 text-[#335F76]" />
                    <span className="font-semibold text-slate-700 text-sm">
                      {b.rooms.map((r) => `Phòng ${r.room_number} (${r.room_type_name})`).join(", ")}
                    </span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Row 2: ngày */}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    <span>{formatDate(b.check_in_date)} → {formatDate(b.check_out_date)}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span>{b.nights} đêm</span>
                </div>

                {/* Row 3: giá */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className="text-xs text-slate-400">
                    {b.invoice.discount > 0 && `Giảm ${b.invoice.discount}% · `}
                    Tổng tiền
                  </span>
                  <div className="text-right">
                    {b.invoice.discount > 0 && (
                      <p className="text-xs text-slate-400 line-through">{formatPrice(b.invoice.total_amount)}</p>
                    )}
                    <p className="font-bold text-[#335F76]">{formatPrice(b.invoice.final_amount)}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm text-slate-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

    </div>
  );
}