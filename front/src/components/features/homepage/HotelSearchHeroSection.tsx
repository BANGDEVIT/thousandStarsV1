import { CalendarDays, Search, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import heroFallback from "@/assets/hero.png";
import type { Room } from "@/types/room.type";

interface HotelSearchHeroSectionProps {
  rooms: Room[];
}

const guestOptions = [
  "1 người lớn",
  "2 người lớn",
  "2 người lớn, 1 trẻ em",
  "2 người lớn, 2 trẻ em",
  "Gia đình 4 người",
];

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

export function HotelSearchHeroSection({ rooms }: HotelSearchHeroSectionProps) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(guestOptions[1]);
  const [roomCount, setRoomCount] = useState("1");

  const heroImage = useMemo(() => {
    const roomWithImage = rooms.find((room) => room.images?.[0]);
    return roomWithImage?.images?.[0] ?? heroFallback;
  }, [rooms]);

  const handleExploreRooms = () => {
    if (!checkIn || !checkOut) {
      toast.error("Vui lòng chọn ngày nhận phòng và ngày trả phòng");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    const params = new URLSearchParams();

    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    if (roomCount) params.set("rooms", roomCount);

    const query = params.toString();
    navigate(query ? `/rooms?${query}` : "/rooms");
  };

  return (
    <section className="relative bg-white">
      <div className="relative min-h-[470px] overflow-hidden md:min-h-[540px]">
        <img
          src={heroImage}
          alt="Thousand Stars Hotel"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0D2535]/45" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0D2535]/50 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[470px] max-w-6xl flex-col items-center justify-center px-6 pb-20 pt-16 text-center md:min-h-[540px]">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#E5DAC2]">
            Thousand Stars Hotel
          </p>
          <h1 className="max-w-4xl font-['Lora'] text-4xl font-bold leading-tight text-white md:text-6xl">
            Thư giãn. Kết nối.
            <br />
            Tìm nơi nghỉ dưỡng của bạn.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            Trải nghiệm không gian lưu trú sang trọng, dịch vụ tận tâm và những
            căn phòng được chọn lọc từ hệ thống Thousand Stars.
          </p>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-14 max-w-6xl px-6">
        <div className="grid gap-3 rounded-lg border border-black/10 bg-white p-4 text-left shadow-2xl md:grid-cols-[1fr_1fr_1.25fr_0.7fr_auto] md:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-[#0D2535]">
              Nhận phòng
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
            <span className="mb-2 block text-xs font-bold text-[#0D2535]">
              Trả phòng
            </span>
            <span className="relative block">
              <input
                type="date"
                value={checkOut}
                min={checkIn ? addDays(checkIn, 1) : addDays(todayInputValue(), 1)}
                disabled={!checkIn}
                onClick={(event) => openNativeDatePicker(event.currentTarget)}
                onChange={(event) => setCheckOut(event.target.value)}
                className="h-11 w-full rounded-md border border-gray-200 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
              />
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#335F76]/60" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-[#0D2535]">
              Khách
            </span>
            <span className="relative block">
              <select
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
                className="h-11 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D]"
              >
                {guestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <UsersRound className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#335F76]/60" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-[#0D2535]">
              Phòng
            </span>
            <select
              value={roomCount}
              onChange={(event) => setRoomCount(event.target.value)}
              className="h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D]"
            >
              {[1, 2, 3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={handleExploreRooms}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#B8852D] px-6 text-sm font-bold text-white shadow-md transition hover:bg-[#9A6D21]"
          >
            <Search className="h-4 w-4" />
            Tìm phòng
          </button>
        </div>
      </div>
    </section>
  );
}
