import { useNavigate, useParams } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getHotelById, HOTELS } from "@/data/hotels";

const DEFAULT_HOTEL = HOTELS[2];

const GALLERY = {
  main: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  thumbs: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  ],
};

const ROOMS = [
  {
    name: "Grand Azure Suite",
    size: "65 m²",
    huong: "Hướng biển",
    giuong: "Giường King",
    price: "4,200K",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300",
    desc: "Suite đặc trưng với sàn hiên riêng và bồn tắm đá với ngưỡng khổi.",
  },
  {
    name: "Heritage Wing Suite",
    size: "65 m²",
    huong: "Hướng vườn",
    giuong: "Giường Queen",
    price: "5,500K",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300",
    desc: "Không gian yên bình nhìn ra những khu vườn xanh của khu nghỉ dưỡng.",
  },
];

const AMENITIES = [
  "🏊 Bể bơi vô cực",
  "💆 Spa riêng tư",
  "📶 Wifi cáp quang",
  "🍳 Đầu bếp riêng",
  "🅿️ Đỗ xe an ninh",
  "🏋️ Phòng Gym cao cấp",
];

const REVIEWS = [
  {
    name: "Nguyen Huu Thien, Vung Tau",
    text: "Mức độ kín đáo và dịch vụ ở đây là không thể so sánh được. Cảm giác giống một ngôi nhà riêng có đội ngũ nhân viên đẳng cấp thế giới.",
  },
  {
    name: "Chu Phu Quoc Vuong, Gia Lai",
    text: "Kiến trúc hài hòa. Chúng tôi đã dành ba ngày ngắm ánh sáng trên những bức tường đá. Thực sự là một bài học về sự sang trọng yên tĩnh.",
  },
  {
    name: "Tran Anh Hao, Ho Chi Minh",
    text: "Khu chăm sóc sức khỏe tuyệt vời. Đầu bếp riêng đã thiết kế thực đơn phù hợp nhu cầu ăn kiêng mà chúng tôi không cần yêu cầu.",
  },
];

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hotel = getHotelById(id) ?? DEFAULT_HOTEL;

  return (
    <div className="app content-page hotel-detail-page">
      <Navbar />

      <div className="hotel-detail">
        <div className="hotel-detail__inner">
          <header className="hotel-detail__header">
            <div>
              <h1 className="hotel-detail__title">{hotel.name}</h1>
              <p className="hotel-detail__location">📍 {hotel.location}</p>
            </div>
            <div className="hotel-detail__actions">
              <button type="button" className="hotel-detail__btn-outline">
                ↗ CHIA SẺ
              </button>
              <button type="button" className="hotel-detail__btn-outline">
                ♡ LƯU LẠI
              </button>
            </div>
          </header>

          <section className="hotel-detail__gallery" aria-label="Hình ảnh khu nghỉ dưỡng">
            <div className="hotel-detail__gallery-main">
              <img src={GALLERY.main} alt={hotel.name} />
            </div>
            <div className="hotel-detail__gallery-side">
              <div className="hotel-detail__gallery-row">
                <img src={GALLERY.thumbs[0]} alt="Phòng nghỉ" />
                <img src={GALLERY.thumbs[1]} alt="Hồ bơi" className="rounded-tr" />
              </div>
              <div className="hotel-detail__gallery-row">
                <img src={GALLERY.thumbs[2]} alt="View biển" />
                <img src={GALLERY.thumbs[3]} alt="Spa" className="rounded-br" />
              </div>
            </div>
          </section>

          <div className="hotel-detail__body">
            <div className="hotel-detail__content">
              <section className="hotel-detail__section">
                <h2>Về Khu Nghỉ Dưỡng</h2>
                <p>
                  Tọa lạc giữa cảnh quan thiên nhiên hùng vĩ, {hotel.name} là kiệt tác về sự
                  chính xác kiến trúc và trải nghiệm nghỉ dưỡng riêng tư. Khu nghỉ được thiết kế
                  hòa mình vào cảnh quan, mang đến sự kín đáo cho những vị khách khắt khe nhất.
                </p>
                <p>
                  Bất động sản có diện tích hơn 800 mét vuông không gian sống, bao gồm phòng ngủ
                  chính rộng lớn, khu chăm sóc sức khỏe riêng và những khu vườn bậc thang đổ
                  xuống phía biển.
                </p>
              </section>

              <section className="hotel-detail__section">
                <h3>Tiện ích & Dịch vụ</h3>
                <ul className="hotel-detail__amenities">
                  {AMENITIES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="hotel-detail__sidebar">
              <div className="hotel-detail__booking">
                <p className="hotel-detail__booking-label">GIÁ TỪ</p>
                <div className="hotel-detail__booking-price">
                  <span className="price">{hotel.price}</span>
                  <span className="unit">/đêm</span>
                  <span className="rating">★ {hotel.rating}</span>
                </div>

                <div className="hotel-detail__booking-field">
                  <label>NGÀY ĐẾN & ĐI</label>
                  <div className="value">12 tháng 10 — 19 tháng 10, 2026</div>
                </div>

                <div className="hotel-detail__booking-field">
                  <label>KHÁCH</label>
                  <div className="value">2 Người lớn, 1 Khách</div>
                </div>

                <button
                  type="button"
                  className="btn-navy btn-navy--block"
                  onClick={() => navigate("/payment")}
                >
                  ĐẶT PHÒNG NGAY
                </button>
                <p className="hotel-detail__booking-note">
                  Đã bao gồm tất cả các loại thuế địa phương và phí dịch vụ.
                </p>
              </div>
            </aside>
          </div>

          <section className="hotel-detail__section hotel-detail__rooms">
            <h2>Các phòng hiện có</h2>
            <div className="hotel-detail__room-grid">
              {ROOMS.map((room) => (
                <article key={room.name} className="hotel-detail__room-card">
                  <img src={room.img} alt={room.name} />
                  <div className="hotel-detail__room-info">
                    <h3>{room.name}</h3>
                    <p className="meta">
                      {room.size} • {room.huong} • {room.giuong}
                    </p>
                    <p className="desc">{room.desc}</p>
                    <div className="hotel-detail__room-footer">
                      <strong>{room.price}</strong>
                      <button
                        type="button"
                        className="btn-navy"
                        onClick={() => navigate("/payment")}
                      >
                        ĐẶT NGAY
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="hotel-detail__section hotel-detail__location">
            <h2>Vị trí & Khu vực lân cận</h2>
            <div className="hotel-detail__location-grid">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80"
                alt="Vị trí khu nghỉ dưỡng"
              />
              <div>
                <h3>Kín đáo & Thuận tiện</h3>
                <p>
                  Thousand Stars mang đến sự cân bằng hoàn hảo giữa nơi an đặt tách biệt và kết
                  nối thuận tiện với thiên nhiên.
                </p>
                <ul>
                  <li>20 phút đến Sân bay</li>
                  <li>15 phút đến Bến du thuyền riêng</li>
                  <li>10 phút đến các nhà hàng đạt sao Michelin</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="hotel-detail__section hotel-detail__reviews">
            <h2>Cảm nhận từ khách hàng</h2>
            <p className="hotel-detail__reviews-meta">
              {hotel.rating}/5 (48 ĐÁNH GIÁ)
            </p>
            <div className="hotel-detail__review-grid">
              {REVIEWS.map((review) => (
                <blockquote key={review.name} className="hotel-detail__review">
                  <div className="stars">★★★★★</div>
                  <p>&quot;{review.text}&quot;</p>
                  <footer>— {review.name}</footer>
                </blockquote>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
