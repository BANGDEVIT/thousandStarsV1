const STORAGE_KEY = "thousand_stars_booking_draft";

export type BookingDraft = {
  roomId: string;
  roomIds: string[];
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomTitle?: string;
  pricePerNight?: number;
};

export function saveBookingDraft(draft: BookingDraft) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadBookingDraft(): BookingDraft | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BookingDraft;
  } catch {
    return null;
  }
}

export function clearBookingDraft() {
  sessionStorage.removeItem(STORAGE_KEY);
}
