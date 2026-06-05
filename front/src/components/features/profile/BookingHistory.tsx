import { useEffect, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ReceiptText,
  XCircle,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking.store";
import type { Booking } from "@/types/booking.type";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  checked_in: { label: "Đang ở", color: "bg-green-100 text-green-700" },
  checked_out: { label: "Đã trả phòng", color: "bg-slate-100 text-slate-600" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-500" },
};

type BookingStatus =
  | ""
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return "Không có";

  return new Date(dateStr).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatPrice(price: number) {
  return `${Number(price || 0).toLocaleString("vi-VN")}đ`;
}

function getBookingTotal(booking: Booking) {
  return booking.invoice?.final_amount ?? booking.total_room_price ?? 0;
}

function canCancelBooking(booking: Booking) {
  return booking.status === "pending" || booking.status === "confirmed";
}

export function BookingHistory() {
  const { bookings, totalPages, loading, fetchBookings, cancelBooking } =
    useBookingStore();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BookingStatus>("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn hủy đặt phòng này không?",
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    fetchBookings({ page, limit: 5, ...(status ? { status } : {}) });
  }, [page, status, fetchBookings]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <h2 className="font-['Lora'] text-xl font-bold text-[#335F76]">
            Lịch sử đặt phòng
          </h2>
          <p className="text-sm text-slate-400">
            Chỉ hiển thị các booking của tài khoản đang đăng nhập
          </p>
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as BookingStatus);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none"
        >
          <option value="">Tất cả</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="checked_in">Đang ở</option>
          <option value="checked_out">Đã trả phòng</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-400">
          Đang tải lịch sử đặt phòng...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
          Chưa có lịch sử đặt phòng.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => {
            const statusInfo = STATUS_LABEL[booking.status] ?? {
              label: booking.status,
              color: "bg-slate-100 text-slate-600",
            };
            const total = getBookingTotal(booking);

            return (
              <article
                key={booking.id}
                className="rounded-xl border border-slate-100 p-4 text-left transition-colors hover:border-[#335F76]/30"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-[#335F76]/10 p-2 text-[#335F76]">
                      <BedDouble className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {booking.rooms
                          .map((room) => `Phòng ${room.room_number}`)
                          .join(", ")}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {booking.rooms
                          .map((room) => room.room_type_name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-500 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#335F76]" />
                    <span>
                      {formatDate(booking.check_in_date)} -{" "}
                      {formatDate(booking.check_out_date)} ({booking.nights} đêm)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-[#335F76]" />
                    <span>Đặt lúc {formatDateTime(booking.created_at)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <ReceiptText className="size-4" />
                    Tổng tiền
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    {canCancelBooking(booking) && (
                      <button
                        type="button"
                        disabled={cancellingId === booking.id}
                        onClick={() => handleCancelBooking(booking.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle className="size-4" />
                        {cancellingId === booking.id ? "Đang hủy..." : "Hủy phòng"}
                      </button>
                    )}
                    <strong className="text-lg text-[#335F76]">
                      {formatPrice(total)}
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm text-slate-500">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page === totalPages}
            className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
