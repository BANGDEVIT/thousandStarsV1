import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CalendarDays, Search } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/features/nav-bar/navbar";
import { FooterSection } from "@/components/features/homepage/FooterSection";
import { getRooms } from "@/services/room.service";
import type { Room, RoomsResponse } from "@/types/room.type";
import RoomCard from "@/components/features/rooms/RoomCard";
import RoomFilters from "@/components/features/rooms/RoomFilters";

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
    // Some browsers only allow showPicker during direct user activation.
  }
}

const RoomsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") ?? "available",
  );
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: RoomsResponse = await getRooms({
        page,
        limit: 12,
        status: statusFilter || undefined,
      });
      setRooms(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, statusFilter]);

  const handleSearchDates = () => {
    if (!checkIn || !checkOut) {
      toast.error("Vui lòng chọn ngày nhận phòng và ngày trả phòng");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("status", statusFilter || "available");
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-[#1a3a50] to-[#0D2535] py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-['Lora'] mb-4">
              Khám phá các phòng của chúng tôi
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Lựa chọn từ nhiều loại phòng sang trọng với tiện nghi đầy đủ để mang đến cho bạn một kỳ nghỉ hoàn hảo.
            </p>
          </div>
        </section>

        {/* Filters & Rooms */}
        <section className="bg-[#F5F0E8] py-12 px-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 grid gap-3 rounded-2xl border border-[#335F76]/10 bg-white p-5 text-left shadow-sm md:grid-cols-[1fr_1fr_auto] md:items-end">
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
                      if (checkOut && checkOut <= value) {
                        setCheckOut("");
                      }
                    }}
                    className="h-11 w-full rounded-md border border-gray-200 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D]"
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
                    className="h-11 w-full rounded-md border border-gray-200 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#335F76]/60" />
                </span>
              </label>

              <button
                type="button"
                onClick={handleSearchDates}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#B8852D] px-6 text-sm font-bold text-white transition hover:bg-[#9A6D21]"
              >
                <Search className="h-4 w-4" />
                Tìm phòng
              </button>
            </div>

            {/* Filters */}
            <RoomFilters 
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* Loading State */}
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-[#E5DAC2]/50 animate-pulse h-96" />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8">
                <p className="font-semibold">Lỗi</p>
                <p>{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && rooms.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[#335F76] text-lg font-semibold mb-2">
                  Không có phòng phù hợp với bộ lọc của bạn
                </p>
                <p className="text-[#335F76]/60">
                  Vui lòng thử lại với các tiêu chí khác
                </p>
              </div>
            )}

            {/* Rooms Grid */}
            {!loading && !error && rooms.length > 0 && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 py-8">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border-2 border-[#335F76] text-[#335F76] font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#335F76] hover:text-white transition-colors"
                    >
                      ← Trước
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`w-10 h-10 rounded-full font-semibold transition-colors ${
                            page === i + 1
                              ? "bg-[#335F76] text-white"
                              : "border-2 border-[#335F76] text-[#335F76] hover:bg-[#335F76] hover:text-white"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border-2 border-[#335F76] text-[#335F76] font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#335F76] hover:text-white transition-colors"
                    >
                      Sau →
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
