import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ContactForm = {
  hoTen: string;
  sdt: string;
  email: string;
  diaDiem: string;
  soKhach: string;
  thoiGian: string;
  ghiChu: string;
};

const FIELDS: { label: string; key: keyof ContactForm; placeholder: string; type?: string }[] = [
  { label: "Họ và Tên *", key: "hoTen", placeholder: "VD: Trần Nguyễn" },
  { label: "Số điện thoại *", key: "sdt", placeholder: "VD: 09x xxx xxx" },
  { label: "Email *", key: "email", placeholder: "VD: trangnguyen@gmail.com", type: "email" },
  { label: "Số lượng khách *", key: "soKhach", placeholder: "VD: 2" },
  { label: "Thời gian *", key: "thoiGian", placeholder: "VD: Tháng 12, 2026" },
  { label: "Ghi chú", key: "ghiChu", placeholder: "Yêu cầu thêm (nếu có)" },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    hoTen: "",
    sdt: "",
    email: "",
    diaDiem: "Hồ Chí Minh",
    soKhach: "",
    thoiGian: "",
    ghiChu: "",
  });

  const handleSubmit = () => {
    toast.success("Gửi thành công!");
  };

  return (
    <div className="app content-page">
      <Navbar />

      <div className="contact-banner">
        <h1>
          Một nơi nghỉ dưỡng, vạn
          <br />
          lần ấn tượng
        </h1>
      </div>

      <div className="contact-split">
        <div>
          <h2 style={{ marginBottom: 24 }}>Liên hệ</h2>

          {FIELDS.map((field) => (
            <div key={field.key} className="content-field content-field--underline" style={{ marginBottom: 16 }}>
              <label>{field.label}</label>
              <input
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              />
            </div>
          ))}

          <div className="content-field content-field--underline" style={{ marginBottom: 24 }}>
            <label>Địa điểm *</label>
            <select
              value={form.diaDiem}
              onChange={(e) => setForm({ ...form, diaDiem: e.target.value })}
            >
              <option>Hồ Chí Minh</option>
              <option>Hà Nội</option>
              <option>Đà Nẵng</option>
              <option>Hạ Long</option>
            </select>
          </div>

          <button type="button" className="btn-navy" onClick={handleSubmit}>
            Gửi →
          </button>
        </div>

        <div className="contact-map">
          <iframe
            title="Bản đồ Thousand Stars"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d106.6297!3d10.7631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzQ3LjIiTiAxMDbCsDM3JzQ2LjkiRQ!5e0!3m2!1sen!2s!4v1"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
