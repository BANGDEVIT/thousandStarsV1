import { CalendarDays, Search, UsersRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import heroImage from "@/assets/signin.png";
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
    // Browser may block showPicker when it is not a direct user action.
  }
}

export function HotelSearchHeroSection({ rooms }: HotelSearchHeroSectionProps) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(guestOptions[1]);
  const [roomCount, setRoomCount] = useState("1");

  const handleExploreRooms = () => {
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
      params.set("guests", guests);
      params.set("rooms", roomCount);
      params.set("status", "available");
    }

    const query = params.toString();
    navigate(query ? `/rooms?${query}` : "/rooms");
  };

  return (
    <section className="relative bg-white">
      <div className="relative min-h-[560px] overflow-hidden md:min-h-[620px]">
        <img
          src={heroImage}
          alt="Khu nghỉ dưỡng Thousand Stars bên hồ bơi"
          className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
        />
        <div className="absolute inset-0 bg-[#071824]/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071824]/75 via-[#071824]/45 to-[#071824]/75" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col items-center justify-center px-5 pb-28 pt-16 text-center md:min-h-[620px] md:px-8">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-white"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.65)" }}
          >
            Thousand Stars Hotel
          </p>
          <h1
            className="max-w-4xl font-['Lora'] text-4xl font-bold leading-tight text-white md:text-6xl"
            style={{
              color: "#ffffff",
              textShadow: "0 4px 28px rgba(0,0,0,0.85)",
            }}
          >
            Thư giãn. Kết nối.
            <br />
            Tìm nơi nghỉ dưỡng của bạn.
          </h1>
          <p
            className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white md:text-lg"
            style={{ textShadow: "0 3px 18px rgba(0,0,0,0.75)" }}
          >
            Trải nghiệm không gian lưu trú sang trọng, dịch vụ tận tâm và những
            căn phòng được chọn lọc từ hệ thống Thousand Stars.
          </p>
          {rooms.length > 0 && (
            <p className="mt-4 rounded-full border border-white/30 bg-black/45 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur">
              {rooms.length} phòng đang sẵn sàng để bạn khám phá
            </p>
          )}
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-20 max-w-6xl px-5 md:px-8">
        <div className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 text-left shadow-2xl md:grid-cols-[1fr_1fr_1.25fr_0.7fr_auto] md:items-end">
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
                  if (checkOut && checkOut <= value) setCheckOut("");
                }}
                className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] focus:ring-2 focus:ring-[#B8852D]/20"
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
                className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] focus:ring-2 focus:ring-[#B8852D]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
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
                className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-10 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] focus:ring-2 focus:ring-[#B8852D]/20"
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
              className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#0D2535] outline-none transition focus:border-[#B8852D] focus:ring-2 focus:ring-[#B8852D]/20"
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
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#B8852D] px-6 text-sm font-bold text-white shadow-md transition hover:bg-[#9A6D21]"
          >
            <Search className="h-4 w-4" />
            Tìm phòng
          </button>
        </div>
      </div>
    </section>
  );
}
