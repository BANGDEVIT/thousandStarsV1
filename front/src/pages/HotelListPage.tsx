import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelSearchBar from "@/components/HotelSearchBar";
import { HOTELS, hotelDetailPath } from "@/data/hotels";
import {
  filterHotelsByDestination,
  formatDateRange,
  formatGuestsLabel,
  getDestinationLabel,
  parseHotelSearchParams,
  buildHotelsSearchUrl,
  type HotelSearchValues,
} from "@/lib/hotelSearch";

type Filters = {
  sieuSang: boolean;
  thuongLuu: boolean;
  boutique: boolean;
  beBoiVoCuc: boolean;
  dauBepRieng: boolean;
  tamNhinBien: boolean;
};

export default function HotelListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = useMemo(() => parseHotelSearchParams(searchParams), [searchParams]);

  const [priceRange, setPriceRange] = useState(4500);
  const [filters, setFilters] = useState<Filters>({
    sieuSang: false,
    thuongLuu: true,
    boutique: false,
    beBoiVoCuc: false,
    dauBepRieng: false,
    tamNhinBien: false,
  });

  const filteredHotels = useMemo(
    () => filterHotelsByDestination(HOTELS, search.destinationId),
    [search.destinationId],
  );

  const handleSearch = (values: HotelSearchValues) => {
    navigate(buildHotelsSearchUrl(values));
  };

  const toggleFilter = (key: keyof Filters) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const clearFilters = () => {
    setFilters({
      sieuSang: false,
      thuongLuu: false,
      boutique: false,
      beBoiVoCuc: false,
      dauBepRieng: false,
      tamNhinBien: false,
    });
  };

  const locationLabel = getDestinationLabel(search.destinationId);
  const dateLabel = formatDateRange(search.checkIn, search.checkOut);
  const guestLabel = formatGuestsLabel(search.adults, search.children);

  return (
    <div className="app content-page hotel-list-page">
      <Navbar />

      <div className="hotel-list-hero" aria-hidden />

      <HotelSearchBar
        key={searchParams.toString()}
        variant="compact"
        initialValues={search}
        onSearch={handleSearch}
      />

      <div className="hotel-list-body">
        <p className="hotel-list-count">
          {filteredHotels.length > 0 ? (
            <>
              Hiển thị <strong>{filteredHotels.length}</strong> biệt thự tại{" "}
              <strong>{locationLabel}</strong>
              {" · "}
              {dateLabel}
              {" · "}
              {guestLabel}
            </>
          ) : (
            <>
              Không có khách sạn tại <strong>{locationLabel}</strong> trong hệ thống.{" "}
              <button type="button" className="hotel-list-reset-search" onClick={() => handleSearch({ ...search, destinationId: "" })}>
                Xem tất cả điểm đến
              </button>
            </>
          )}
        </p>

        <div className="hotel-list-layout">
          <aside className="hotel-list-filters">
            <div className="hotel-list-filter-block">
              <b>Giá mỗi đêm</b>
              <input
                type="range"
                min={800}
                max={4500}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="hotel-list-range-labels">
                <span>$800</span>
                <span>$4,500+</span>
              </div>
            </div>

            <div className="hotel-list-filter-block">
              <b>Mức độ sang trọng</b>
              {[
                { key: "sieuSang" as const, label: "Siêu sang (5★)" },
                { key: "thuongLuu" as const, label: "Thượng lưu (4★)" },
                { key: "boutique" as const, label: "Boutique" },
              ].map((item) => (
                <label key={item.key} className="hotel-list-check">
                  <input
                    type="checkbox"
                    checked={filters[item.key]}
                    onChange={() => toggleFilter(item.key)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="hotel-list-filter-block">
              <b>Tiện nghi</b>
              {[
                { key: "beBoiVoCuc" as const, label: "Bể bơi vô cực" },
                { key: "dauBepRieng" as const, label: "Đầu bếp riêng" },
                { key: "tamNhinBien" as const, label: "Tầm nhìn biển" },
              ].map((item) => (
                <label key={item.key} className="hotel-list-check">
                  <input
                    type="checkbox"
                    checked={filters[item.key]}
                    onChange={() => toggleFilter(item.key)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            <button type="button" className="hotel-list-clear" onClick={clearFilters}>
              Xóa tất cả
            </button>
          </aside>

          <div className="hotel-list-results">
            {filteredHotels.map((hotel) => (
              <article key={hotel.id} className="hotel-list-card">
                <Link to={hotelDetailPath(hotel.id)} className="hotel-list-card__img">
                  <img src={hotel.img} alt={hotel.name} />
                  {hotel.noiBat && <span className="hotel-list-badge">NỔI BẬT</span>}
                </Link>
                <div className="hotel-list-card__body">
                  <div className="hotel-list-card__top">
                    <div>
                      <h3>
                        <Link to={hotelDetailPath(hotel.id)}>{hotel.name}</Link>
                      </h3>
                      <p className="loc">📍 {hotel.location}</p>
                    </div>
                    <div className="hotel-list-card__price">
                      <span className="from">Từ</span>
                      <div>
                        {hotel.price}
                        <span>/đêm</span>
                      </div>
                    </div>
                  </div>
                  <p className="hotel-list-card__desc">{hotel.desc}</p>
                  <div className="hotel-list-card__footer">
                    <div className="amenities">
                      {hotel.amenities.map((a) => (
                        <span key={a}>{a}</span>
                      ))}
                    </div>
                    <Link to={hotelDetailPath(hotel.id)} className="btn-gold">
                      XEM CHI TIẾT
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            {filteredHotels.length > 0 && (
              <p className="hotel-list-more">Xem thêm trải nghiệm ∨</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
