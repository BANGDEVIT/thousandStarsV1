import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type CheckinForm = {
  ten: string;
  ho: string;
  email: string;
  sdt: string;
  cccd: string;
  ngaySinh: string;
};

export default function CheckinPage() {
  const [form, setForm] = useState<CheckinForm>({
    ten: "",
    ho: "",
    email: "",
    sdt: "",
    cccd: "",
    ngaySinh: "",
  });
  const [matTruoc, setMatTruoc] = useState<string | null>(null);
  const [matSau, setMatSau] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, side: "truoc" | "sau") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (side === "truoc") setMatTruoc(url);
    else setMatSau(url);
  };

  const handleSubmit = () => {
    if (!form.ten || !form.ho || !form.email || !form.sdt || !form.cccd || !form.ngaySinh) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (!matTruoc || !matSau) {
      toast.error("Vui lòng upload ảnh CCCD 2 mặt!");
      return;
    }
    toast.success("Xác nhận check-in thành công!");
  };

  return (
    <div className="app content-page checkin-page">
      <Navbar />

      <div className="contact-banner">
        <h1>
          Một nơi nghỉ dưỡng, vạn
          <br />
          lần ấn tượng
        </h1>
      </div>

      <div className="content-inner checkin-inner">
        <h1 className="checkin-title">Check-in</h1>
        <p className="page-desc">
          Vui lòng nhập thông tin để chúng tôi có thể xác nhận danh tính của bạn.
        </p>

        <div className="content-card checkin-form-card">
          <h3>Thông tin khách hàng</h3>

          <div className="content-grid-2">
            <div className="content-field">
              <label>Tên</label>
              <input
                placeholder="Ví dụ: Tâm"
                value={form.ten}
                onChange={(e) => setForm({ ...form, ten: e.target.value })}
              />
            </div>
            <div className="content-field">
              <label>Họ</label>
              <input
                placeholder="Ví dụ: Nguyễn"
                value={form.ho}
                onChange={(e) => setForm({ ...form, ho: e.target.value })}
              />
            </div>
            <div className="content-field span-full">
              <label>Địa chỉ Email</label>
              <input
                type="email"
                placeholder="nktam2904@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="content-field span-full">
              <label>Số điện thoại</label>
              <input
                placeholder="0917692329"
                value={form.sdt}
                onChange={(e) => setForm({ ...form, sdt: e.target.value })}
              />
            </div>
            <div className="content-field span-full">
              <label>Số CCCD</label>
              <input
                placeholder="Ví dụ: 0841234567890"
                value={form.cccd}
                onChange={(e) => setForm({ ...form, cccd: e.target.value })}
              />
            </div>
            <div className="content-field span-full">
              <label>Ngày, tháng, năm sinh</label>
              <input
                placeholder="Ví dụ: 29/04/1999"
                value={form.ngaySinh}
                onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })}
              />
            </div>
          </div>

          <div className="checkin-upload-grid">
            {[
              { label: "Hình chụp mặt trước CCCD", side: "truoc" as const, img: matTruoc },
              { label: "Hình chụp mặt sau CCCD", side: "sau" as const, img: matSau },
            ].map((item) => (
              <div key={item.side} className="checkin-upload">
                <span className="checkin-upload__label">{item.label}</span>
                <label className="checkin-upload__box">
                  {item.img ? (
                    <img src={item.img} alt="CCCD" />
                  ) : (
                    <span className="checkin-upload__icon">📷</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e, item.side)}
                  />
                </label>
              </div>
            ))}
          </div>

          <button type="button" className="btn-navy btn-navy--block" onClick={handleSubmit}>
            Xác nhận
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
