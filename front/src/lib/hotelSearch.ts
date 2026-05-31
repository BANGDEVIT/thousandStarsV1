import type { Hotel } from "@/data/hotels";
import { HOTELS } from "@/data/hotels";

export type HotelSearchValues = {
  destinationId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
};

export const SEARCH_DESTINATIONS = [
  { value: "", label: "Tất cả điểm đến", region: "Việt Nam" },
  ...HOTELS.map((h) => ({
    value: String(h.id),
    label: h.name,
    region: h.location,
  })),
  { value: "phu-quoc", label: "Phú Quốc", region: "Kiên Giang" },
  { value: "hoi-an", label: "Hội An", region: "Quảng Nam" },
  { value: "da-lat", label: "Đà Lạt", region: "Lâm Đồng" },
];

export const ADULT_OPTIONS = [1, 2, 3, 4, 5, 6];
export const CHILD_OPTIONS = [0, 1, 2, 3, 4];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toInputDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function defaultSearchValues(): HotelSearchValues {
  const checkIn = addDays(new Date(), 3);
  const checkOut = addDays(checkIn, 4);
  return {
    destinationId: "",
    checkIn: toInputDate(checkIn),
    checkOut: toInputDate(checkOut),
    adults: 2,
    children: 0,
  };
}

export const MONTHS_VI = [
  { value: 1, label: "Tháng 1" },
  { value: 2, label: "Tháng 2" },
  { value: 3, label: "Tháng 3" },
  { value: 4, label: "Tháng 4" },
  { value: 5, label: "Tháng 5" },
  { value: 6, label: "Tháng 6" },
  { value: 7, label: "Tháng 7" },
  { value: 8, label: "Tháng 8" },
  { value: 9, label: "Tháng 9" },
  { value: 10, label: "Tháng 10" },
  { value: 11, label: "Tháng 11" },
  { value: 12, label: "Tháng 12" },
];

export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

export function parseDateParts(iso: string) {
  if (!iso) {
    const d = addDays(new Date(), 3);
    return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
  }
  const [y, m, day] = iso.split("-").map(Number);
  return {
    day: day || 1,
    month: m || 1,
    year: y || new Date().getFullYear(),
  };
}

export function buildDateFromParts(day: number, month: number, year: number) {
  const maxDay = daysInMonth(month, year);
  const safeDay = Math.min(Math.max(1, day), maxDay);
  return toInputDate(new Date(year, month - 1, safeDay));
}

export function getYearOptions() {
  const y = new Date().getFullYear();
  return [y, y + 1];
}

export function formatDateVN(iso: string) {
  if (!iso) return "";
  const { day, month, year } = parseDateParts(iso);
  return `${pad(day)}/${pad(month)}/${year}`;
}

export function formatDateShort(iso: string) {
  if (!iso) return "";
  const { day, month } = parseDateParts(iso);
  return `${day} Th${month}`;
}

export function formatDateRange(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return "Chọn ngày";
  return `${formatDateShort(checkIn)} — ${formatDateShort(checkOut)}`;
}

export function formatGuestsLabel(adults: number, children: number) {
  const parts = [`${adults} Người lớn`];
  if (children > 0) parts.push(`${children} Trẻ em`);
  return parts.join(", ");
}

export function buildHotelsSearchUrl(values: HotelSearchValues) {
  const params = new URLSearchParams();
  if (values.destinationId) params.set("destination", values.destinationId);
  if (values.checkIn) params.set("checkIn", values.checkIn);
  if (values.checkOut) params.set("checkOut", values.checkOut);
  params.set("adults", String(values.adults));
  params.set("children", String(values.children));
  const q = params.toString();
  return q ? `/hotels?${q}` : "/hotels";
}

export function parseHotelSearchParams(
  searchParams: URLSearchParams,
): HotelSearchValues {
  const defaults = defaultSearchValues();
  const destination = searchParams.get("destination") ?? defaults.destinationId;
  const checkIn = searchParams.get("checkIn") ?? defaults.checkIn;
  let checkOut = searchParams.get("checkOut") ?? defaults.checkOut;

  if (checkIn && checkOut && checkOut <= checkIn) {
    checkOut = toInputDate(addDays(new Date(checkIn), 1));
  }

  const adults = Number(searchParams.get("adults") ?? defaults.adults);
  const children = Number(searchParams.get("children") ?? defaults.children);

  return {
    destinationId: destination,
    checkIn,
    checkOut,
    adults: ADULT_OPTIONS.includes(adults) ? adults : defaults.adults,
    children: CHILD_OPTIONS.includes(children) ? children : defaults.children,
  };
}

export function filterHotelsByDestination(hotels: Hotel[], destinationId: string) {
  if (!destinationId) return hotels;
  const hotelId = Number(destinationId);
  if (Number.isNaN(hotelId)) return [];
  return hotels.filter((h) => h.id === hotelId);
}

export function getDestinationLabel(destinationId: string) {
  const found = SEARCH_DESTINATIONS.find((d) => d.value === destinationId);
  if (!found || !destinationId) return "Việt Nam";
  return found.region ? `${found.label}, ${found.region}` : found.label;
}
