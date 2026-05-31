import { useNavigate } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bookings = [
  {
    id: 3,
    name: "HA LONG BAY",
    location: "QUẢNG NINH",
    checkIn: "14 Tháng 12, 2024",
    checkOut: "21 Tháng 12, 2024",
    khach: "2 Người lớn, 1 Trẻ em",
    total: "18.000K",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    amenities: ["🏊", "📶", "🍳"],
  },
];

export default function BookingHistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="app content-page">
      <Navbar />

      <div className="content-inner">
        <div className="booking-history-header">
          <h1>Đặt chỗ và chuyến đi</h1>
          <button type="button" className="hotel-detail__btn-outline">
            Bạn không tìm thấy đặt phòng?
          </button>
        </div>

        {bookings.length === 0 ? (
          <p className="page-desc">Bạn chưa có đặt phòng nào.</p>
        ) : (
          bookings.map((b) => (
            <article key={b.id} className="booking-history-card">
              <img src={b.img} alt={b.name} />
              <div className="booking-history-card__body">
                <div className="booking-history-card__main">
                  <div>
                    <h3>{b.name}</h3>
                    <p className="loc">📍 {b.location}</p>
                    <p>
                      {b.checkIn} — {b.checkOut}
                    </p>
                    <p>Khách: {b.khach}</p>
                    <div className="amenities">
                      {b.amenities.map((a) => (
                        <span key={a}>{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="booking-history-card__actions">
                    <div className="total">
                      {b.total}
                      <span>/Tổng</span>
                    </div>
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={() => navigate(`/hotels/${b.id}`)}
                    >
                      XEM CHI TIẾT
                    </button>
                    <button
                      type="button"
                      className="booking-history-link"
                      onClick={() => navigate("/checkin")}
                    >
                      Check-in
                    </button>
                    <button
                      type="button"
                      className="booking-history-link"
                      onClick={() => navigate("/booking")}
                    >
                      Hủy đặt phòng
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
