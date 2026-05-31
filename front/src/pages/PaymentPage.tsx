import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const methods = [
  { id: "card", icon: "💳", label: "Thẻ tín dụng hoặc Thẻ ghi nợ" },
  { id: "bank", icon: "🏦", label: "Chuyển khoản ngân hàng" },
  { id: "ewallet", icon: "📱", label: "Ví điện tử (MOMO / ZALO Pay)" },
] as const;

type PayMethodId = (typeof methods)[number]["id"];

export default function PaymentPage() {
  const [payMethod, setPayMethod] = useState<PayMethodId>("card");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="app">
      <Navbar />

      <div className="page-wrapper">
        <div className="payment-layout">
          <div className="payment-main">
            <h1>Thông tin thanh toán</h1>
            <p className="payment-sub">
              Vui lòng kiểm tra lại thông tin và chọn phương thức thanh toán để xác nhận
              trải nghiệm nghỉ dưỡng riêng tư của bạn.
            </p>

            <h2 className="payment-section-title">Thông tin khách hàng</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên</label>
                <input className="form-input" type="text" placeholder="Ví dụ: Thiện" />
              </div>
              <div className="form-group">
                <label className="form-label">Họ</label>
                <input className="form-input" type="text" placeholder="Ví dụ: Nguyễn" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="Thiennguyen@gmail.com"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 40 }}>
              <label className="form-label">Số điện thoại</label>
              <input
                className="form-input"
                type="tel"
                placeholder="+84 (0) 90 123 4567"
              />
            </div>

            <h2 className="payment-section-title">Phương thức thanh toán</h2>
            <div className="pay-methods">
              {methods.map((m) => (
                <div
                  key={m.id}
                  className={`pay-method ${payMethod === m.id ? "active" : ""}`}
                  onClick={() => setPayMethod(m.id)}
                  onKeyDown={(e) => e.key === "Enter" && setPayMethod(m.id)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="pay-method-icon">{m.icon}</span>
                  <span className="pay-method-label">{m.label}</span>
                  <div className={`pay-radio ${payMethod === m.id ? "checked" : ""}`} />
                </div>
              ))}
            </div>

            {payMethod === "card" && (
              <div className="card-fields">
                <div className="form-group">
                  <label className="form-label">Số thẻ</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div className="card-row">
                  <div className="form-group">
                    <label className="form-label">Ngày hết hạn</label>
                    <input className="form-input" type="text" placeholder="MM / YY" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mã CVV</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="terms-row" style={{ marginTop: 28 }}>
              <div
                className="checkbox"
                style={
                  agreed
                    ? { background: "var(--gold)", borderColor: "var(--gold)" }
                    : undefined
                }
                onClick={() => setAgreed(!agreed)}
                onKeyDown={(e) => e.key === "Enter" && setAgreed(!agreed)}
                role="checkbox"
                aria-checked={agreed}
                tabIndex={0}
              />
              <span>
                Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
                <a href="#">Chính sách bảo mật</a>.
              </span>
            </div>

            <button type="button" className="btn-confirm">
              Xác nhận đặt phòng
            </button>
          </div>

          <div>
            <div className="booking-card">
              <div className="booking-img">
                <img
                  src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80"
                  alt="Ha Long Bay"
                />
              </div>
              <div className="booking-details">
                <div className="booking-name">HA LONG BAY</div>
                <div className="booking-loc">📍 QUẢNG NINH</div>

                <div className="booking-row">
                  <label>NGÀY NHẬN PHÒNG</label>
                  <span>14 Th12, 2024</span>
                </div>
                <div className="booking-row">
                  <label>NGÀY TRẢ PHÒNG</label>
                  <span>21 Th12, 2024</span>
                </div>
                <div className="booking-row" style={{ borderBottom: "none" }}>
                  <label>KHÁCH</label>
                  <span>2 Người lớn, 1 Trẻ em</span>
                </div>

                <div style={{ marginTop: 20 }}>
                  <div className="price-row">
                    <span>2,450K × 7 đêm</span>
                    <span>17,150K</span>
                  </div>
                  <div className="price-row">
                    <span>Thuế và Phí địa phương</span>
                    <span>850</span>
                  </div>
                  <div className="total-row">
                    <span className="total-label">Tổng cộng</span>
                    <span className="total-price">18,000K</span>
                  </div>
                </div>

                <div className="booking-note">
                  <span>✅</span>
                  <span>
                    Yêu cầu đặt phòng của bạn được bảo vệ bởi Cam kết Riêng tư của
                    Thousand Stars. Bộ phận quản gia sẽ liên hệ với bạn trong vòng 24
                    giờ.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
