import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import Navbar from "@/components/features/nav-bar/navbar";
import { FooterSection } from "@/components/features/homepage/FooterSection";
import { bookingService } from "@/services/booking.service";
import { getRoomById } from "@/services/room.service";
import type { Room } from "@/types/room.type";

const bedTypeLabel: Record<string, string> = {
  single: "Giường đơn",
  double: "Giường đôi",
  twin: "Hai giường đơn",
  king: "Giường King",
  queen: "Giường Queen",
};

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
  return Number(value || 0).toLocaleString("vi-VN");
}

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";

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

  const nights = useMemo(
    () => getNightCount(checkIn, checkOut),
    [checkIn, checkOut],
  );
  const pricePerNight = Number(room?.room_type.base_price ?? 0);
  const totalPrice = pricePerNight * nights;
  const canBook = Boolean(room && id && checkIn && checkOut && nights > 0);

  const handleConfirmBooking = async () => {
    if (!room || !id) return;

    if (room.status !== "available") {
      toast.error("Phòng này hiện không còn trống");
      return;
    }

    if (!canBook) {
      toast.error("Vui lòng quay lại trang tìm kiếm để chọn ngày hợp lệ");
      return;
    }

    try {
      setBookingLoading(true);
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
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;

      if (status === 401 || status === 403) {
        toast.error("Vui lòng đăng nhập bằng tài khoản khách hàng để đặt phòng");
        navigate("/signin");
        return;
      }

      toast.error("Không thể đặt phòng. Vui lòng thử lại");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="bg-[#0D2535] px-6 py-16 text-left">
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

        <section className="bg-[#F5F0E8] px-6 py-12">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="h-96 animate-pulse rounded-2xl bg-white/70" />
            ) : !room ? (
              <div className="rounded-2xl bg-white p-10 text-center text-[#335F76]">
                Không tìm thấy phòng.
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
                <article className="overflow-hidden rounded-2xl bg-white text-left shadow-sm">
                  <div className="h-80 bg-[#0D2535]">
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

                  <div className="p-7">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#335F76]">
                          Tên phòng
                        </p>
                        <h2 className="mt-2 font-['Lora'] text-3xl font-bold text-[#0D2535]">
                          {room.room_type.name}
                        </h2>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                        {room.status === "available" ? "Còn trống" : "Đã đặt"}
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
                        Phòng {room.room_number} thuộc hạng {room.room_type.name}
                        , phù hợp cho {room.room_type.capacity} khách với các
                        tiện ích:{" "}
                        {room.room_type.amenities?.length
                          ? room.room_type.amenities.join(", ")
                          : "không gian nghỉ dưỡng tiện nghi tại Thousand Stars"}
                        .
                      </p>
                    </div>
                  </div>
                </article>

                <aside className="h-fit rounded-2xl bg-white p-7 text-left shadow-sm">
                  <h2 className="font-['Lora'] text-2xl font-bold text-[#0D2535]">
                    Giá thuê
                  </h2>

                  <div className="mt-6 grid gap-4">
                    <div className="rounded-xl border border-[#335F76]/10 bg-[#F5F0E8] p-4">
                      <span className="block text-xs font-bold uppercase tracking-wide text-[#335F76]">
                        Ngày nhận phòng
                      </span>
                      <strong className="mt-1 block text-[#0D2535]">
                        {checkIn || "Chưa chọn"}
                      </strong>
                    </div>

                    <div className="rounded-xl border border-[#335F76]/10 bg-[#F5F0E8] p-4">
                      <span className="block text-xs font-bold uppercase tracking-wide text-[#335F76]">
                        Ngày trả phòng
                      </span>
                      <strong className="mt-1 block text-[#0D2535]">
                        {checkOut || "Chưa chọn"}
                      </strong>
                    </div>
                  </div>

                  {!canBook && (
                    <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                      Bạn cần quay lại trang tìm kiếm phòng để chọn ngày nhận
                      phòng và ngày trả phòng hợp lệ.
                    </div>
                  )}

                  <div className="mt-6 space-y-3 border-t border-[#335F76]/10 pt-6 text-sm text-[#335F76]">
                    <div className="flex justify-between gap-4">
                      <span>Giá mỗi đêm</span>
                      <strong className="text-[#0D2535]">
                        {formatCurrency(pricePerNight)}đ
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Số đêm thuê</span>
                      <strong className="text-[#0D2535]">{nights}</strong>
                    </div>
                    <div className="flex justify-between gap-4 text-lg">
                      <span className="font-bold text-[#0D2535]">Tổng tiền</span>
                      <strong className="font-['Lora'] text-[#B8852D]">
                        {formatCurrency(totalPrice)}đ
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={bookingLoading || !canBook}
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
