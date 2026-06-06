import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CalendarDays, Search } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/features/nav-bar/navbar";
import { FooterSection } from "@/components/features/homepage/FooterSection";
import { getAvailableRooms, getRooms } from "@/services/room.service";
import type { Room, RoomsResponse } from "@/types/room.type";
import RoomCard from "@/components/features/rooms/RoomCard";
import RoomFilters from "@/components/features/rooms/RoomFilters";
import roomsHeroImage from "@/assets/signin.png";

const statusOrder: Record<Room["status"], number> = {
  available: 0,
  occupied: 1,
  maintenance: 2,
  cleaning: 3,
  inactive: 4,
};

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

function todayInputValue() {
  return toDateInputValue(new Date());
}

function openNativeDatePicker(input: HTMLInputElement) {
  try {
    input.showPicker?.();
  } catch {
    // Browser may block showPicker when it is not a direct user action.
  }
}

const RoomsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Room["status"] | "">(
    (searchParams.get("status") as Room["status"] | null) ?? "",
  );
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasDateRange = Boolean(checkIn && checkOut && checkOut > checkIn);
      const shouldUseDateAvailability =
        hasDateRange && (!statusFilter || statusFilter === "available");

      const response: RoomsResponse = shouldUseDateAvailability
        ? await getAvailableRooms({
            page,
            limit: 12,
            check_in_date: checkIn,
            check_out_date: checkOut,
          })
        : await getRooms({
            page,
            limit: 12,
            status: statusFilter || undefined,
          });

      setRooms(
        [...response.data].sort(
          (a, b) => statusOrder[a.status] - statusOrder[b.status],
        ),
      );
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, statusFilter, checkIn, checkOut]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as Room["status"] | "");
    setPage(1);
  };

  const handleSearchDates = () => {
    const hasAnyDate = Boolean(checkIn || checkOut);
    const hasFullDateRange = Boolean(checkIn && checkOut);

    if (hasAnyDate && !hasFullDateRange) {
      toast.error("Vui lòng chọn đủ ngày nhận phòng và ngày trả phòng");
      return;
    }

    if (hasFullDateRange && checkOut <= checkIn) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    const params = new URLSearchParams();
    if (hasFullDateRange) {
      params.set("checkIn", checkIn);
      params.set("checkOut", checkOut);
      params.set("status", statusFilter || "available");
    } else if (statusFilter) {
      params.set("status", statusFilter);
    }

    setPage(1);
    const query = params.toString();
    navigate(query ? `/rooms?${query}` : "/rooms");
  };

  const clearDateSearch = () => {
    setCheckIn("");
    setCheckOut("");
    setStatusFilter("");
    setPage(1);
    navigate("/rooms");
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#F5F0E8]">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden px-5 py-16 text-left md:px-8 md:py-24">
          <img
            src={roomsHeroImage}
            alt="Không gian phòng và hồ bơi Thousand Stars"
            className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
          />
          <div className="absolute inset-0 bg-[#071824]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071824]/90 via-[#071824]/65 to-[#071824]/45" />

          <div className="relative z-10 mx-auto max-w-6xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#E5DAC2]">
              Thousand Stars Rooms
            </p>
            <h1
              className="font-['Lora'] text-4xl font-bold leading-tight text-white md:text-5xl"
              style={{
                color: "#ffffff",
                textShadow: "0 4px 24px rgba(0,0,0,0.75)",
              }}
            >
              Phòng của chúng tôi
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/90 md:text-lg">
              Xem toàn bộ phòng hoặc chọn ngày để kiểm tra phòng còn trống theo
              lịch đặt hiện tại.
            </p>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 grid gap-4 rounded-2xl border border-[#335F76]/10 bg-white p-5 text-left shadow-sm md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#335F76]">
                  Ngày nhận phòng
                </span>
                <span className="relative block">
                  <input
                    type="date"
                    value={checkIn}
                    min={todayInputValue()}
                    onClick={(event) => openNativeDatePicker(event.currentTarget)}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCheckIn(value);
                      if (checkOut && checkOut <= value) setCheckOut("");
                    }}
                    className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] focus:ring-2 focus:ring-[#B8852D]/20"
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#335F76]/60" />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#335F76]">
                  Ngày trả phòng
                </span>
                <span className="relative block">
                  <input
                    type="date"
                    value={checkOut}
                    min={
                      checkIn ? addDays(checkIn, 1) : addDays(todayInputValue(), 1)
                    }
                    disabled={!checkIn}
                    onClick={(event) => openNativeDatePicker(event.currentTarget)}
                    onChange={(event) => setCheckOut(event.target.value)}
                    className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] focus:ring-2 focus:ring-[#B8852D]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#335F76]/60" />
                </span>
              </label>

              <button
                type="button"
                onClick={handleSearchDates}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#B8852D] px-6 text-sm font-bold text-white transition hover:bg-[#9A6D21]"
              >
                <Search className="h-4 w-4" />
                Tìm phòng
              </button>

              <button
                type="button"
                onClick={clearDateSearch}
                className="h-12 rounded-lg border border-[#335F76]/25 px-5 text-sm font-bold text-[#335F76] transition hover:bg-[#335F76] hover:text-white"
              >
                Xem tất cả
              </button>
            </div>

            <RoomFilters
              statusFilter={statusFilter}
              setStatusFilter={handleStatusFilterChange}
            />

            {loading && (
              <div className="my-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-96 animate-pulse rounded-2xl bg-white shadow-sm"
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-left text-red-700">
                <p className="font-semibold">Lỗi</p>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && rooms.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#335F76]/20 bg-white py-16 text-center">
                <p className="text-lg font-semibold text-[#335F76]">
                  Không có phòng phù hợp
                </p>
                <p className="mt-2 text-[#335F76]/60">
                  Vui lòng thử lại với tiêu chí khác hoặc bấm “Xem tất cả”.
                </p>
              </div>
            )}

            {!loading && !error && rooms.length > 0 && (
              <>
                <div className="mb-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-3 py-6">
                    <button
                      type="button"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-full border-2 border-[#335F76] px-4 py-2 font-semibold text-[#335F76] transition hover:bg-[#335F76] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Trước
                    </button>

                    <span className="text-sm font-semibold text-[#335F76]">
                      {page} / {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="rounded-full border-2 border-[#335F76] px-4 py-2 font-semibold text-[#335F76] transition hover:bg-[#335F76] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default RoomsPage;
