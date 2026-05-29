import { useMemo, useState } from "react";
import {
  ADULT_OPTIONS,
  CHILD_OPTIONS,
  SEARCH_DESTINATIONS,
  addDays,
  defaultSearchValues,
  toInputDate,
  type HotelSearchValues,
} from "@/lib/hotelSearch";

type HotelSearchBarProps = {
  variant?: "hero" | "compact";
  initialValues?: HotelSearchValues;
  onSearch: (values: HotelSearchValues) => void;
};

export default function HotelSearchBar({
  variant = "hero",
  initialValues,
  onSearch,
}: HotelSearchBarProps) {
  const defaults = useMemo(() => initialValues ?? defaultSearchValues(), [initialValues]);
  const [values, setValues] = useState<HotelSearchValues>(defaults);

  const minCheckOut = values.checkIn
    ? toInputDate(new Date(new Date(values.checkIn).getTime() + 86400000))
    : toInputDate(new Date());

  const today = toInputDate(new Date());

  const handleCheckIn = (checkIn: string) => {
    setValues((prev) => {
      const next = { ...prev, checkIn };
      if (prev.checkOut && checkIn >= prev.checkOut) {
        next.checkOut = toInputDate(addDays(new Date(checkIn), 1));
      }
      return next;
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(values);
  };

  const isHero = variant === "hero";
  const barClass = isHero ? "search-bar" : "hotel-list-search hotel-list-search--form";
  const fieldClass = isHero
    ? "search-field search-field--input"
    : "hotel-list-search__field hotel-list-search__field--input";
  const btnClass = isHero ? "search-btn" : "hotel-list-search__btn";

  const dateFields = (
    <>
      <div className={fieldClass}>
        <label htmlFor="search-checkin">Nhận phòng</label>
        <input
          id="search-checkin"
          type="date"
          min={today}
          value={values.checkIn}
          onChange={(e) => handleCheckIn(e.target.value)}
          required
        />
      </div>
      <div className={fieldClass}>
        <label htmlFor="search-checkout">Trả phòng</label>
        <input
          id="search-checkout"
          type="date"
          min={minCheckOut}
          value={values.checkOut}
          onChange={(e) => setValues({ ...values, checkOut: e.target.value })}
          required
        />
      </div>
    </>
  );

  return (
    <form className={barClass} onSubmit={handleSubmit}>
      <div className={fieldClass}>
        <label htmlFor="search-destination">Điểm đến</label>
        <select
          id="search-destination"
          value={values.destinationId}
          onChange={(e) => setValues({ ...values, destinationId: e.target.value })}
        >
          {SEARCH_DESTINATIONS.map((d) => (
            <option key={d.value || "all"} value={d.value}>
              {d.value === "" ? d.label : `${d.label} — ${d.region}`}
            </option>
          ))}
        </select>
      </div>

      {dateFields}

      {isHero ? (
        <div className={`${fieldClass} search-field--guests`}>
          <label htmlFor="search-adults">Khách</label>
          <div className="search-guest-row">
            <select
              id="search-adults"
              value={values.adults}
              onChange={(e) => setValues({ ...values, adults: Number(e.target.value) })}
              aria-label="Người lớn"
            >
              {ADULT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} người lớn
                </option>
              ))}
            </select>
            <select
              id="search-children"
              value={values.children}
              onChange={(e) => setValues({ ...values, children: Number(e.target.value) })}
              aria-label="Trẻ em"
            >
              {CHILD_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} trẻ em
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <>
          <div className={fieldClass}>
            <label htmlFor="search-adults-compact">Người lớn</label>
            <select
              id="search-adults-compact"
              value={values.adults}
              onChange={(e) => setValues({ ...values, adults: Number(e.target.value) })}
            >
              {ADULT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldClass}>
            <label htmlFor="search-children-compact">Trẻ em</label>
            <select
              id="search-children-compact"
              value={values.children}
              onChange={(e) => setValues({ ...values, children: Number(e.target.value) })}
            >
              {CHILD_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button type="submit" className={btnClass} aria-label="Tìm kiếm">
        {isHero ? "🔍" : "Tìm kiếm"}
      </button>
    </form>
  );
}
