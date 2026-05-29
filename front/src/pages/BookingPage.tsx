import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BookingPage() {
  const [lyDo, setLyDo] = useState("");
  const [agree, setAgree] = useState(false);

  const handleHuy = () => {
    if (!agree) {
      toast.error("Vui lòng đồng ý điều khoản!");
      return;
    }
    if (!lyDo.trim()) {
      toast.error("Vui lòng nhập lý do hủy!");
      return;
    }
    toast.success("Xác nhận hủy đặt phòng thành công!");
  };

  return (
    <div className="app content-page">
      <Navbar />

      <div className="content-inner">
        <h1>Thông tin đặt phòng</h1>
        <p className="page-desc">
          Vui lòng kiểm tra lại thông tin và chọn hủy đặt phòng nếu bạn không thể tiếp tục trải
          nghiệm nghỉ dưỡng riêng tư.
        </p>

        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Thông tin khách hàng</h2>
        <div className="content-grid-2" style={{ marginBottom: 24 }}>
          <div className="content-field">
            <label>Tên</label>
            <input value="Thiện" readOnly />
          </div>
          <div className="content-field">
            <label>Họ</label>
            <input value="Nguyễn" readOnly />
          </div>
          <div className="content-field span-full">
            <label>Địa chỉ Email</label>
            <input value="Thiennguyen@gmail.com" readOnly />
          </div>
          <div className="content-field span-full">
            <label>Số điện thoại</label>
            <input value="+84 (0) 90 123 4567" readOnly />
          </div>
        </div>

        <div className="content-card">
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <img
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"
              alt="Phòng Ha Long Bay"
              style={{ width: 200, height: 150, objectFit: "cover", borderRadius: 6 }}
            />
            <div style={{ flex: 1, minWidth: 240 }}>
              {[
                { label: "NGÀY NHẬN PHÒNG", value: "14 Th12, 2024" },
                { label: "NGÀY TRẢ PHÒNG", value: "21 Th12, 2024" },
                { label: "KHÁCH", value: "2 Người lớn, 1 Trẻ em" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
                >
                  <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}

              <hr style={{ borderColor: "#eee", margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666" }}>
                <span>2,450K × 7 đêm</span>
                <span>17,150K</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666" }}>
                <span>Thuế và Phí địa phương</span>
                <span>850</span>
              </div>

              <hr style={{ borderColor: "#eee", margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 16, fontWeight: "bold" }}>Tổng cộng</span>
                <span style={{ fontSize: 16, fontWeight: "bold", color: "#c0392b" }}>18,000K</span>
              </div>

              <div
                style={{
                  background: "#f0f7ff",
                  border: "1px solid #cce0ff",
                  borderRadius: 6,
                  padding: 12,
                  fontSize: 13,
                  color: "#444",
                  marginTop: 12,
                }}
              >
                ✔ Yêu cầu hủy đặt phòng của bạn sẽ được xử lý theo chính sách của Thousand Stars
                và xác nhận trong vòng 24 giờ.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
            <b>HA LONG BAY</b>
            <br />
            © QUẢNG NINH
          </div>
        </div>

        <div className="content-card">
          <h3>Lý do hủy:</h3>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            Chúng tôi có thể giúp bạn tìm giải pháp thay thế nếu bạn cần thay đổi đặt phòng.
          </p>
          <div className="content-field">
            <label>Lý do: *</label>
            <input
              placeholder="Số lượng hoặc nhu cầu khách thay đổi"
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
            />
          </div>

          <label style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span style={{ fontSize: 14 }}>
              Tôi đồng ý với{" "}
              <span style={{ color: "#1a3a5c", textDecoration: "underline", cursor: "pointer" }}>
                Điều khoản dịch vụ
              </span>{" "}
              và{" "}
              <span style={{ color: "#1a3a5c", textDecoration: "underline", cursor: "pointer" }}>
                Chính sách bảo mật
              </span>
            </span>
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <button type="button" className="btn-navy" onClick={handleHuy}>
            Xác nhận hủy đặt phòng
          </button>
          <Link to="/payment" style={{ color: "#1a3a5c", fontSize: 14 }}>
            Tôi muốn thay đổi thông tin đặt phòng
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
