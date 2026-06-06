import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { CalendarDays, CreditCard, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { bookingService } from "@/services/booking.service";
import type { Booking } from "@/types/booking.type";

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function firstDayOfMonth() {
  const now = new Date();
  return toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1));
}

function today() {
  return toDateInputValue(new Date());
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function getBookingAmount(booking: Booking) {
  return booking.invoice?.final_amount ?? booking.total_room_price ?? 0;
}

function getInvoiceStatusLabel(status?: string) {
  if (status === "paid") return "Đã thanh toán";
  if (status === "partially_paid") return "Thanh toán một phần";
  if (status === "unpaid") return "Chưa thanh toán";
  return "Chưa có hóa đơn";
}

function getCustomerName(booking: Booking) {
  return booking.customer?.full_name ?? "Khách hàng";
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: ElementType;
}) {
  return (
    <article className="rounded-2xl border border-[#335F76]/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B8852D]">
            {title}
          </p>
          <p className="mt-3 text-2xl font-bold text-[#0D2535]">{value}</p>
          <p className="mt-2 text-sm text-[#335F76]/70">{description}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#335F76]/10 text-[#335F76]">
          <Icon className="size-5" />
        </span>
      </div>
    </article>
  );
}

export function RevenueReportPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(firstDayOfMonth());
  const [toDate, setToDate] = useState(today());

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getBookings({
          page: 1,
          limit: 100,
          from_date: fromDate || undefined,
          to_date: toDate || undefined,
          sortBy: "created_at",
          order: "desc",
        });
        setBookings(response.data ?? []);
      } catch {
        toast.error("Không thể tải báo cáo doanh thu");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [fromDate, toDate]);

  const report = useMemo(() => {
    const validBookings = bookings.filter((booking) => booking.status !== "cancelled");
    const paidBookings = validBookings.filter((booking) => booking.invoice?.status === "paid");
    const unpaidBookings = validBookings.filter((booking) => booking.invoice?.status !== "paid");
    const grossRevenue = validBookings.reduce((sum, booking) => sum + getBookingAmount(booking), 0);
    const paidRevenue = paidBookings.reduce((sum, booking) => sum + getBookingAmount(booking), 0);
    const receivable = unpaidBookings.reduce((sum, booking) => sum + getBookingAmount(booking), 0);

    const dailyMap = new Map<string, number>();
    paidBookings.forEach((booking) => {
      const key = toDateInputValue(new Date(booking.check_out_date ?? booking.created_at));
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + getBookingAmount(booking));
    });

    const dailyRevenue = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7);

    return {
      validBookings,
      paidBookings,
      unpaidBookings,
      grossRevenue,
      paidRevenue,
      receivable,
      dailyRevenue,
    };
  }, [bookings]);

  const maxDailyRevenue = Math.max(...report.dailyRevenue.map(([, value]) => value), 1);

  return (
    <div className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-3 rounded-2xl border border-[#335F76]/10 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-['Lora'] text-2xl font-bold text-[#0D2535]">
            Tổng quan doanh thu
          </h2>
          <p className="mt-1 text-sm text-[#335F76]/70">
            Dữ liệu được tổng hợp từ booking và hóa đơn trong khoảng ngày đã chọn.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#335F76]">
              Từ ngày
            </span>
            <span className="relative block">
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-11 rounded-lg border border-[#335F76]/15 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D]"
              />
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#335F76]/50" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#335F76]">
              Đến ngày
            </span>
            <span className="relative block">
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="h-11 rounded-lg border border-[#335F76]/15 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D]"
              />
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#335F76]/50" />
            </span>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Doanh thu dự kiến"
          value={formatMoney(report.grossRevenue)}
          description="Tổng giá trị booking chưa hủy."
          icon={TrendingUp}
        />
        <StatCard
          title="Đã thu"
          value={formatMoney(report.paidRevenue)}
          description="Tổng hóa đơn đã thanh toán."
          icon={Wallet}
        />
        <StatCard
          title="Còn phải thu"
          value={formatMoney(report.receivable)}
          description="Booking chưa thanh toán đủ."
          icon={CreditCard}
        />
        <StatCard
          title="Booking hợp lệ"
          value={String(report.validBookings.length)}
          description="Không tính booking đã hủy."
          icon={ReceiptText}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-2xl border border-[#335F76]/10 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="font-['Lora'] text-xl font-bold text-[#0D2535]">
              Doanh thu đã thu theo ngày
            </h3>
            <p className="mt-1 text-sm text-[#335F76]/70">
              Lấy theo ngày trả phòng của booking đã thanh toán.
            </p>
          </div>

          {report.dailyRevenue.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#335F76]/20 py-12 text-center text-sm text-[#335F76]/60">
              Chưa có doanh thu đã thanh toán trong khoảng này.
            </div>
          ) : (
            <div className="space-y-4">
              {report.dailyRevenue.map(([date, amount]) => (
                <div key={date}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#0D2535]">{formatDate(date)}</span>
                    <span className="text-[#335F76]/75">{formatMoney(amount)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#F5F0E8]">
                    <div
                      className="h-full rounded-full bg-[#B8852D]"
                      style={{ width: `${Math.max(8, (amount / maxDailyRevenue) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-[#335F76]/10 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="font-['Lora'] text-xl font-bold text-[#0D2535]">
              Trạng thái thanh toán
            </h3>
            <p className="mt-1 text-sm text-[#335F76]/70">
              Theo dõi nhanh lượng booking đã thu và còn phải thu.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Đã thanh toán
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-800">
                {report.paidBookings.length}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                Chưa thu đủ
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-800">
                {report.unpaidBookings.length}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
                Đã hủy
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-700">
                {bookings.filter((booking) => booking.status === "cancelled").length}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-[#335F76]/10 bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-100 text-left text-[#335F76]">
            <tr>
              <th className="px-4 py-3 font-semibold">Khách hàng</th>
              <th className="px-4 py-3 font-semibold">Phòng</th>
              <th className="px-4 py-3 font-semibold">Ngày ở</th>
              <th className="px-4 py-3 font-semibold">Booking</th>
              <th className="px-4 py-3 font-semibold">Hóa đơn</th>
              <th className="px-4 py-3 text-right font-semibold">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#335F76]/60">
                  Đang tải báo cáo...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#335F76]/60">
                  Không có dữ liệu doanh thu trong khoảng này.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-100">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[#0D2535]">{getCustomerName(booking)}</p>
                    <p className="text-xs text-[#335F76]/65">
                      {booking.customer?.phone ?? booking.customer?.email ?? "Chưa có liên hệ"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-[#335F76]">
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
                  <td className="px-4 py-4 text-[#335F76]">{booking.status}</td>
                  <td className="px-4 py-4 text-[#335F76]">
                    {getInvoiceStatusLabel(booking.invoice?.status)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-[#0D2535]">
                    {booking.status === "cancelled" ? "0đ" : formatMoney(getBookingAmount(booking))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
