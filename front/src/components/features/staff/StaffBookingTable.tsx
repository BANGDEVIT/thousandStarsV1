import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { bookingService } from "@/services/booking.service";
import type { Booking, BookingQuery } from "@/types/booking.type";

const statusInfo: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xác nhận", className: "border-amber-200 bg-amber-50 text-amber-700" },
  confirmed: { label: "Đã xác nhận", className: "border-blue-200 bg-blue-50 text-blue-700" },
  checked_in: { label: "Đã check-in", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  checked_out: { label: "Đã check-out", className: "border-slate-200 bg-slate-50 text-slate-600" },
  cancelled: { label: "Đã hủy", className: "border-red-200 bg-red-50 text-red-700" },
};

const bookingTypeLabel: Record<string, string> = {
  online: "Online",
  offline: "Tại quầy",
  walk_in: "Walk-in",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function getTotal(booking: Booking) {
  return booking.invoice?.final_amount ?? booking.total_room_price ?? 0;
}

type StaffBookingMode = "all" | "check-in" | "check-out";

interface StaffBookingTableProps {
  mode: StaffBookingMode;
}

export function StaffBookingTable({ mode }: StaffBookingTableProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<BookingQuery["status"]>(
    mode === "check-in" ? "confirmed" : mode === "check-out" ? "checked_in" : undefined,
  );
  const [search, setSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookings({
        page,
        limit: 10,
        status,
        search,
        sortBy: "created_at",
        order: "desc",
      });
      setBookings(data.data ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      toast.error("Không thể tải danh sách booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, status, search]);

  const handleSearch = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setPage(1);
      setSearch(value.trim());
    }, 350);
  };

  const runAction = async (bookingId: string, action: "confirm" | "check-in" | "check-out" | "cancel") => {
    try {
      setActingId(bookingId);
      if (action === "confirm") {
        await bookingService.confirmBooking(bookingId);
        toast.success("Xác nhận booking thành công");
      }
      if (action === "check-in") {
        await bookingService.checkInBooking(bookingId);
        toast.success("Check-in thành công");
      }
      if (action === "check-out") {
        await bookingService.checkOutBooking(bookingId);
        toast.success("Check-out thành công");
      }
      if (action === "cancel") {
        const ok = window.confirm("Bạn có chắc chắn muốn hủy booking này không?");
        if (!ok) return;
        await bookingService.cancelBooking(bookingId);
        toast.success("Hủy booking thành công");
      }
      await fetchBookings();
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Không thể thực hiện thao tác này";
      toast.error(message);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#335F76]/10 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#335F76]/50" />
          <input
            className="h-11 w-full rounded-lg border border-[#335F76]/15 bg-white px-10 text-sm outline-none transition focus:border-[#B8852D]"
            placeholder="Tìm tên khách hoặc SĐT..."
            onChange={(event) => handleSearch(event.target.value)}
          />
        </div>

        <select
          value={status ?? ""}
          onChange={(event) => {
            setPage(1);
            setStatus((event.target.value || undefined) as BookingQuery["status"]);
          }}
          className="h-11 rounded-lg border border-[#335F76]/15 bg-white px-3 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="checked_in">Đã check-in</option>
          <option value="checked_out">Đã check-out</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#335F76]/10 bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-100 text-left text-[#335F76]">
            <tr>
              <th className="px-4 py-3 font-semibold">Khách hàng</th>
              <th className="px-4 py-3 font-semibold">Phòng</th>
              <th className="px-4 py-3 font-semibold">Ngày ở</th>
              <th className="px-4 py-3 font-semibold">Loại</th>
              <th className="px-4 py-3 font-semibold">Tổng tiền</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#335F76]/60">
                  Đang tải...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#335F76]/60">
                  Không có booking phù hợp.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const info = statusInfo[booking.status] ?? {
                  label: booking.status,
                  className: "border-slate-200 bg-slate-50 text-slate-600",
                };
                const isActing = actingId === booking.id;

                return (
                  <tr key={booking.id} className="border-t border-slate-100">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#0D2535]">
                        {booking.customer?.full_name ?? "Khách hàng"}
                      </p>
                      <p className="text-xs text-[#335F76]/65">
                        {booking.customer?.phone ?? booking.customer?.email ?? "Chưa có liên hệ"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-[#0D2535]">
                      {booking.rooms.map((room) => (
                        <div key={room.id}>
                          {room.room_number} - {room.room_type_name}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-4 text-[#335F76]">
                      {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                      <p className="text-xs text-[#335F76]/60">{booking.nights} đêm</p>
                    </td>
                    <td className="px-4 py-4 text-[#335F76]">
                      {bookingTypeLabel[booking.booking_type] ?? booking.booking_type}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#0D2535]">
                      {formatMoney(getTotal(booking))}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${info.className}`}>
                        {info.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {booking.status === "pending" && (
                          <button
                            disabled={isActing}
                            onClick={() => runAction(booking.id, "confirm")}
                            className="rounded-lg bg-[#335F76] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#284C60] disabled:opacity-60"
                          >
                            Xác nhận
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            disabled={isActing}
                            onClick={() => runAction(booking.id, "check-in")}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                          >
                            Check-in
                          </button>
                        )}
                        {booking.status === "checked_in" && (
                          <button
                            disabled={isActing}
                            onClick={() => runAction(booking.id, "check-out")}
                            className="rounded-lg bg-[#B8852D] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#9A6D21] disabled:opacity-60"
                          >
                            Check-out
                          </button>
                        )}
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <button
                            disabled={isActing}
                            onClick={() => runAction(booking.id, "cancel")}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-[#335F76]/20 bg-white px-4 py-2 text-sm font-semibold text-[#335F76] disabled:opacity-50"
          >
            Trước
          </button>
          <span className="py-2 text-sm font-semibold text-[#335F76]">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages || loading}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="rounded-lg border border-[#335F76]/20 bg-white px-4 py-2 text-sm font-semibold text-[#335F76] disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
