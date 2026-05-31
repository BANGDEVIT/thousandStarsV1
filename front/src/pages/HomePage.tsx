import { Link, useNavigate } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelSearchBar from "@/components/HotelSearchBar";
import { HOTELS, hotelDetailPath } from "@/data/hotels";
import { buildHotelsSearchUrl } from "@/lib/hotelSearch";

const DESTINATION_TAGS: Record<number, string> = {
  1: "VEN BIỂN",
  2: "MIỀN TRUNG",
  3: "DI SẢN",
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Navbar />

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <p className="hero-eyebrow">Nghỉ dưỡng cao cấp tại Việt Nam</p>
          <h1 className="hero-title">
            Một nơi nghỉ dưỡng,
            <br />
            <em>vạn lần ấn tượng</em>
          </h1>

          <HotelSearchBar
            variant="hero"
            onSearch={(values) => navigate(buildHotelsSearchUrl(values))}
          />
        </div>
      </section>

      <div className="section-wrapper" id="destinations">
        <div className="section">
          <div className="section-header">
            <div>
              <p className="section-label">ĐIỂM ĐẾN CHỌN LỌC</p>
              <h2 className="section-title">Khám phá những điều phi thường</h2>
            </div>
            <button
              type="button"
              className="link-all"
              onClick={() => navigate("/hotels")}
            >
              XEM TẤT CẢ ĐIỂM ĐẾN
            </button>
          </div>

          <div className="dest-grid">
            {HOTELS.map((hotel) => (
              <Link
                className="dest-card"
                key={hotel.id}
                to={hotelDetailPath(hotel.id)}
              >
                <img src={hotel.img} alt={hotel.name} />
                <div className="dest-overlay">
                  <span className="dest-tag">
                    {hotel.badge ?? DESTINATION_TAGS[hotel.id] ?? hotel.location}
                  </span>
                  <span className="dest-name">{hotel.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="section-wrapper-white">
        <div className="section">
          <div className="feature-split">
            <div className="feature-text">
              <p className="section-label">BỘ SƯU TẬP</p>
              <h2 className="section-title">Sự sang trọng trong từng chi tiết</h2>
              <p className="feature-body">
                Các bất động sản của chúng tôi được lựa chọn không chỉ vì vẻ đẹp mà còn
                vì khả năng mang lại một trải nghiệm cảm giác vô song. Khám phá những
                kiệt tác kiến trúc đương đại tuyển chọn cho những du khách sành sỏi nhất
                thế giới.
              </p>
              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-num">240+</div>
                  <div className="stat-label">Bất động sản từ nhiều toàn cầu</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">12k+</div>
                  <div className="stat-label">Đánh giá từ khách hàng đã xác minh</div>
                </div>
              </div>
            </div>
            <div className="feature-img">
              <img
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
                alt="Luxury pool villa"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrapper">
        <div className="section">
          <div className="section-header">
            <div>
              <p className="section-label">KỲ NGHỈ ĐẶC TRƯNG</p>
              <h2 className="section-title">Những bất động sản kiệt xuất</h2>
            </div>
          </div>

          <div className="props-grid">
            {HOTELS.map((p) => (
              <Link className="prop-card" key={p.id} to={hotelDetailPath(p.id)}>
                <div className="prop-img">
                  <img src={p.img} alt={p.name} />
                  {p.badge && <span className="prop-badge">{p.badge}</span>}
                </div>
                <div className="prop-info">
                  <div className="prop-name">{p.name}</div>
                  <div className="prop-location">📍 {p.location}</div>
                  <div className="prop-price">
                    TỪ <strong>{p.price}</strong> / mỗi đêm
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
