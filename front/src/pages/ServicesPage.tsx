import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { serviceService, type Service } from "@/services/serviceService";

const FALLBACK_SERVICES: Service[] = [
  { id: "1", name: "Spa & Massage", category: "Spa", price: 850000, is_active: true },
  { id: "2", name: "Đồ uống tại phòng", category: "Minibar", price: 120000, is_active: true },
  { id: "3", name: "Giặt ủi nhanh", category: "Tiện ích", price: 250000, is_active: true },
  { id: "4", name: "Đưa đón sân bay", category: "Vận chuyển", price: 650000, is_active: true },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    ho: "",
    ten: "",
    email: "",
    sdt: "",
    soPhong: "",
    ngay: "",
    gio: "",
    ghiChu: "",
    agree: false,
  });

  useEffect(() => {
    serviceService
      .getAll()
      .then((res) => setServices(res.data.filter((s) => s.is_active)))
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    if (!selectedId) {
      toast.error("Vui lòng chọn dịch vụ!");
      return;
    }
    if (!form.agree) {
      toast.error("Vui lòng đồng ý điều khoản!");
      return;
    }
    toast.success("Đặt dịch vụ thành công!");
  };

  return (
    <div className="app content-page">
      <Navbar />

      <div className="content-inner">
        <h1>Dịch vụ khách hàng</h1>
        <p className="page-desc">
          Vui lòng điền thông tin và chọn dịch vụ bạn cần. Chúng tôi sẽ phục vụ tận phòng trong
          thời gian sớm nhất.
        </p>

        <div className="content-card">
          <h3>Thông tin khách hàng</h3>
          <div className="content-grid-2">
            <div className="content-field">
              <label>Họ</label>
              <input
                placeholder="VD: Trần"
                value={form.ho}
                onChange={(e) => setForm({ ...form, ho: e.target.value })}
              />
            </div>
            <div className="content-field">
              <label>Tên</label>
              <input
                placeholder="VD: Nguyễn"
                value={form.ten}
                onChange={(e) => setForm({ ...form, ten: e.target.value })}
              />
            </div>
            <div className="content-field span-full">
              <label>Email</label>
              <input
                type="email"
                placeholder="VD: trangnguyen@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="content-field">
              <label>Số điện thoại</label>
              <input
                placeholder="VD: 09x xxx xxx"
                value={form.sdt}
                onChange={(e) => setForm({ ...form, sdt: e.target.value })}
              />
            </div>
            <div className="content-field">
              <label>Số phòng</label>
              <input
                placeholder="VD: 302"
                value={form.soPhong}
                onChange={(e) => setForm({ ...form, soPhong: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>Chọn dịch vụ</h3>
          {loading && <p style={{ color: "#888" }}>Đang tải dịch vụ...</p>}
          {!loading && services.length === 0 && (
            <p style={{ color: "#888" }}>Chưa có dịch vụ khả dụng.</p>
          )}
          {services.map((s) => (
            <div
              key={s.id}
              className={`service-item ${selectedId === s.id ? "selected" : ""}`}
              onClick={() => setSelectedId(s.id)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedId(s.id)}
              role="button"
              tabIndex={0}
            >
              <div>
                <b>{s.name}</b>
                <p>{s.category ?? "Khác"}</p>
              </div>
              <b>{s.price.toLocaleString("vi-VN")} đ</b>
            </div>
          ))}
        </div>

        <div className="content-card">
          <h3>Thời gian & Ghi chú</h3>
          <div className="content-grid-2">
            <div className="content-field">
              <label>Thời gian yêu cầu</label>
              <input
                type="date"
                value={form.ngay}
                onChange={(e) => setForm({ ...form, ngay: e.target.value })}
              />
            </div>
            <div className="content-field">
              <label>Giờ</label>
              <input
                type="time"
                value={form.gio}
                onChange={(e) => setForm({ ...form, gio: e.target.value })}
              />
            </div>
            <div className="content-field span-full">
              <label>Ghi chú</label>
              <textarea
                placeholder="Nhập yêu cầu đặc biệt nếu có"
                value={form.ghiChu}
                onChange={(e) => setForm({ ...form, ghiChu: e.target.value })}
              />
            </div>
          </div>

          <label style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            />
            <span style={{ fontSize: 14, color: "#444" }}>
              Tôi đồng ý với{" "}
              <span style={{ color: "#1a3a5c", textDecoration: "underline", cursor: "pointer" }}>
                Điều khoản dịch vụ
              </span>{" "}
              và{" "}
              <span style={{ color: "#1a3a5c", textDecoration: "underline", cursor: "pointer" }}>
                Chính sách khách sạn
              </span>
            </span>
          </label>
        </div>

        <button type="button" className="btn-navy btn-navy--block" onClick={handleSubmit}>
          Xác nhận đặt dịch vụ
        </button>
      </div>

      <Footer />
    </div>
  );
}
