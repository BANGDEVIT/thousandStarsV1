import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { toast } from "sonner";
import Navbar from "@/components/features/nav-bar/navbar";
import { FooterSection } from "@/components/features/homepage/FooterSection";
import { bookingService } from "@/services/booking.service";
import { checkRoomAvailability, getRoomById } from "@/services/room.service";
import { useAuthStore } from "@/stores/auth.store";
import type { Room, RoomAvailabilityResponse } from "@/types/room.type";

const bedTypeLabel: Record<string, string> = {
  single: "Giường đơn",
  double: "Giường đôi",
  twin: "Hai giường đơn",
  king: "Giường King",
  queen: "Giường Queen",
};

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayInputValue() {
  return toDateInputValue(new Date());
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

function toDateAtMidnight(value: string) {
  return new Date(`${value}T00:00:00`);
}

function getNightCount(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;

  const start = toDateAtMidnight(checkIn);
  const end = toDateAtMidnight(checkOut);
  const diff = end.getTime() - start.getTime();

  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
}

function formatCurrency(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function formatDate(value: string) {
  if (!value) return "Chưa chọn";
  return new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN");
}

function openNativeDatePicker(input: HTMLInputElement) {
  try {
    input.showPicker?.();
  } catch {
    // Browser may block showPicker when it is not triggered by a direct click.
  }
}

function getErrorStatus(error: unknown) {
  return typeof error === "object" && error !== null && "response" in error
    ? (error as { response?: { status?: number } }).response?.status
    : undefined;
}

function getErrorMessage(error: unknown) {
  return typeof error === "object" && error !== null && "response" in error
    ? (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message
    : undefined;
}

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availability, setAvailability] =
    useState<RoomAvailabilityResponse | null>(null);
  const [checkIn, setCheckIn] = useState(() => searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(
    () => searchParams.get("checkOut") ?? "",
  );

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getRoomById(id);
        setRoom(data);
      } catch {
        toast.error("Không thể tải chi tiết phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (!id || !checkIn || !checkOut || getNightCount(checkIn, checkOut) <= 0) {
      setAvailability(null);
      return;
    }

    let cancelled = false;

    const runAvailabilityCheck = async () => {
      try {
        setAvailabilityLoading(true);
        const result = await checkRoomAvailability(id, {
          check_in_date: checkIn,
          check_out_date: checkOut,
        });
        if (!cancelled) {
          setAvailability(result);
          if (!result.available) {
            toast.error("Phòng đã được đặt trong khoảng thời gian này");
          }
        }
      } catch {
        if (!cancelled) {
          setAvailability(null);
          toast.error("Không thể kiểm tra tình trạng phòng theo ngày");
        }
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    };

    runAvailabilityCheck();

    return () => {
      cancelled = true;
    };
  }, [id, checkIn, checkOut]);

  const nights = useMemo(
    () => getNightCount(checkIn, checkOut),
    [checkIn, checkOut],
  );
  const pricePerNight = Number(room?.room_type.base_price ?? 0);
  const totalPrice = pricePerNight * nights;

  const roomStatusLabel = (() => {
    if (availability && !availability.available) {
      return "Đã đặt trong ngày chọn";
    }
    if (room?.status === "available") return "Còn trống";
    if (room?.status === "occupied") return "Đã đặt";
    if (room?.status === "maintenance") return "Bảo trì";
    if (room?.status === "cleaning") return "Đang dọn";
    return "Không hoạt động";
  })();

  const roomStatusClass =
    availability && !availability.available
      ? "bg-red-50 text-red-600"
      : room?.status === "available"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-yellow-50 text-yellow-700";

  const getCurrentDetailPath = () => {
    const params = new URLSearchParams(location.search);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    const query = params.toString();
    return `${location.pathname}${query ? `?${query}` : ""}`;
  };

  const validateDates = () => {
    if (!checkIn || !checkOut) {
      toast.error("Vui lòng chọn ngày nhận phòng và ngày trả phòng");
      return false;
    }

    if (checkOut <= checkIn || nights <= 0) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng");
      return false;
    }

    if (checkIn < todayInputValue()) {
      toast.error("Không thể chọn ngày trong quá khứ");
      return false;
    }

    return true;
  };

  const handleConfirmBooking = async () => {
    if (!room || !id) return;

    if (!validateDates()) return;

    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để đặt phòng");
      navigate(`/signin?redirect=${encodeURIComponent(getCurrentDetailPath())}`);
      return;
    }

    try {
      setBookingLoading(true);

      const latestAvailability = await checkRoomAvailability(id, {
        check_in_date: checkIn,
        check_out_date: checkOut,
      });
      setAvailability(latestAvailability);

      if (!latestAvailability.available) {
        toast.error("Phòng đã được đặt trong khoảng thời gian này");
        return;
      }

      await bookingService.createBooking({
        room_ids: [id],
        check_in_date: checkIn,
        check_out_date: checkOut,
        booking_type: "online",
        override_prices: {
          [id]: pricePerNight,
        },
      });

      toast.success("Đặt phòng thành công!");
      setRoom({ ...room, status: "occupied" });
      navigate("/rooms?status=available", { replace: true });
    } catch (error: unknown) {
      const status = getErrorStatus(error);

      if (status === 401 || status === 403) {
        toast.error("Vui lòng đăng nhập bằng tài khoản khách hàng để đặt phòng");
        navigate(`/signin?redirect=${encodeURIComponent(getCurrentDetailPath())}`);
        return;
      }

      if (status === 409) {
        toast.error("Phòng đã được đặt trong khoảng thời gian này");
        return;
      }

      toast.error(getErrorMessage(error) ?? "Không thể đặt phòng. Vui lòng thử lại");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="bg-[#0D2535] px-5 py-12 text-left md:px-8 md:py-16">
          <div className="mx-auto max-w-6xl">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-6 text-sm font-semibold text-[#E5DAC2] hover:text-white"
            >
              ← Quay lại danh sách phòng
            </button>
            <h1 className="font-['Lora'] text-4xl font-bold text-white md:text-5xl">
              Chi tiết phòng
            </h1>
          </div>
        </section>

        <section className="bg-[#F5F0E8] px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="h-96 animate-pulse rounded-2xl bg-white/70" />
            ) : !room ? (
              <div className="rounded-2xl bg-white p-10 text-center text-[#335F76]">
                Không tìm thấy phòng.
              </div>
            ) : (
              <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
                <article className="overflow-hidden rounded-3xl bg-white text-left shadow-sm">
                  <div className="aspect-[16/10] max-h-[520px] bg-[#0D2535]">
                    {room.images?.[0] ? (
                      <img
                        src={room.images[0]}
                        alt={room.room_type.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl text-white/30">
                        {room.room_number}
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#335F76]">
                          Tên phòng
                        </p>
                        <h2 className="mt-2 font-['Lora'] text-3xl font-bold text-[#0D2535]">
                          {room.room_type.name}
                        </h2>
                      </div>
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-bold ${roomStatusClass}`}
                      >
                        {roomStatusLabel}
                      </span>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#335F76]/70">
                          Loại phòng
                        </p>
                        <p className="mt-1 text-[#0D2535]">
                          {bedTypeLabel[room.room_type.bed_type] ??
                            room.room_type.bed_type}{" "}
                          · {room.room_type.capacity} khách · Tầng {room.floor}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#335F76]/70">
                          Đánh giá
                        </p>
                        <p className="mt-1 text-[#0D2535]">
                          Chưa có đánh giá chính thức
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#335F76]/70">
                        Mô tả phòng
                      </p>
                      <p className="mt-2 leading-relaxed text-[#335F76]">
                        Phòng {room.room_number} thuộc hạng {room.room_type.name},
                        phù hợp cho {room.room_type.capacity} khách với các tiện
                        ích:{" "}
                        {room.room_type.amenities?.length
                          ? room.room_type.amenities.join(", ")
                          : "không gian nghỉ dưỡng tiện nghi tại Thousand Stars"}
                        .
                      </p>
                    </div>
                  </div>
                </article>

                <aside className="h-fit rounded-3xl bg-white p-6 text-left shadow-sm md:p-7">
                  <h2 className="font-['Lora'] text-2xl font-bold text-[#0D2535]">
                    Giá thuê
                  </h2>

                  <div className="mt-6 grid gap-4">
                    <label className="block rounded-xl border border-[#335F76]/10 bg-[#F5F0E8] p-4">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#335F76]">
                        Ngày nhận phòng
                      </span>
                      <span className="relative block">
                        <input
                          type="date"
                          value={checkIn}
                          min={todayInputValue()}
                          onClick={(event) =>
                            openNativeDatePicker(event.currentTarget)
                          }
                          onChange={(event) => {
                            const value = event.target.value;
                            setCheckIn(value);
                            if (checkOut && checkOut <= value) setCheckOut("");
                          }}
                          className="h-11 w-full rounded-lg border border-[#335F76]/15 bg-white px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] focus:ring-2 focus:ring-[#B8852D]/20"
                        />
                      </span>
                    </label>

                    <label className="block rounded-xl border border-[#335F76]/10 bg-[#F5F0E8] p-4">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#335F76]">
                        Ngày trả phòng
                      </span>
                      <span className="relative block">
                        <input
                          type="date"
                          value={checkOut}
                          min={
                            checkIn
                              ? addDays(checkIn, 1)
                              : addDays(todayInputValue(), 1)
                          }
                          disabled={!checkIn}
                          onClick={(event) =>
                            openNativeDatePicker(event.currentTarget)
                          }
                          onChange={(event) => setCheckOut(event.target.value)}
                          className="h-11 w-full rounded-lg border border-[#335F76]/15 bg-white px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] focus:ring-2 focus:ring-[#B8852D]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                        />
                      </span>
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-[#F8F4EC] p-3">
                      <span className="block text-xs font-semibold text-[#335F76]/70">
                        Nhận phòng
                      </span>
                      <strong className="mt-1 block text-[#0D2535]">
                        {formatDate(checkIn)}
                      </strong>
                    </div>
                    <div className="rounded-xl bg-[#F8F4EC] p-3">
                      <span className="block text-xs font-semibold text-[#335F76]/70">
                        Trả phòng
                      </span>
                      <strong className="mt-1 block text-[#0D2535]">
                        {formatDate(checkOut)}
                      </strong>
                    </div>
                  </div>

                  {availabilityLoading && (
                    <div className="mt-4 rounded-lg border border-[#335F76]/10 bg-[#F8F4EC] px-4 py-3 text-sm text-[#335F76]">
                      Đang kiểm tra lịch phòng...
                    </div>
                  )}

                  {availability && !availability.available && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      Phòng đã được đặt trong khoảng thời gian này.
                    </div>
                  )}

                  {!checkIn || !checkOut ? (
                    <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                      Vui lòng chọn ngày nhận phòng và ngày trả phòng để tính
                      tiền và kiểm tra phòng trống.
                    </div>
                  ) : null}

                  <div className="mt-6 space-y-3 border-t border-[#335F76]/10 pt-6 text-sm text-[#335F76]">
                    <div className="flex justify-between gap-4">
                      <span>Giá mỗi đêm</span>
                      <strong className="text-[#0D2535]">
                        {formatCurrency(pricePerNight)}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Số đêm thuê</span>
                      <strong className="text-[#0D2535]">{nights}</strong>
                    </div>
                    <div className="flex justify-between gap-4 text-lg">
                      <span className="font-bold text-[#0D2535]">Tổng tiền</span>
                      <strong className="font-['Lora'] text-[#B8852D]">
                        {formatCurrency(totalPrice)}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={bookingLoading || availabilityLoading}
                    onClick={handleConfirmBooking}
                    className="mt-7 w-full rounded-md bg-[#B8852D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9A6D21] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bookingLoading ? "Đang đặt phòng..." : "Xác nhận đặt phòng"}
                  </button>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
