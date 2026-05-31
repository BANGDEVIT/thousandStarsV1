import { useState, useRef } from "react";
import { Camera, CheckCircle } from "lucide-react";

interface CheckinFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cccd: string;
  dob: string;
  frontImg: string | null;
  backImg: string | null;
}

export default function CheckinPage() {
  const [form, setForm] = useState<CheckinFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cccd: "",
    dob: "",
    frontImg: null,
    backImg: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const handleImg = (side: "front" | "back", file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((f) => ({
        ...f,
        [side === "front" ? "frontImg" : "backImg"]: reader.result as string,
      }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.phone) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setForm({ firstName: "", lastName: "", email: "", phone: "", cccd: "", dob: "", frontImg: null, backImg: null });
  };

  return (
    <div className="space-y-3 max-w-3xl">
      {/* Breadcrumb header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-slate-400 mb-1">
          HCM01L203 &nbsp;&gt;&nbsp;
          <span className="text-slate-500">Nhân viên &gt; Check in</span>
        </p>
        <h2 className="text-2xl font-bold text-[#1a2744]">Check in</h2>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-center text-lg font-semibold text-[#1a2744] mb-6">
          Thông tin khách hàng
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tên</label>
            <input
              placeholder="Ví dụ: Tâm"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9] bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Họ</label>
            <input
              placeholder="Ví dụ: Nguyễn"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9] bg-slate-50"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Địa chỉ Email</label>
          <input
            type="email"
            placeholder="nktam2904@gmail.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9] bg-slate-50"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Số điện thoại</label>
          <input
            placeholder="0917692329"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9] bg-slate-50"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Số CCCD</label>
          <input
            placeholder="Ví dụ 0841234567890"
            value={form.cccd}
            onChange={(e) => setForm({ ...form, cccd: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9] bg-slate-50"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Ngày, Tháng, Năm sinh
          </label>
          <input
            type="date"
            placeholder="Ví dụ : 29/04/1999"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9] bg-slate-50"
          />
        </div>

        {/* ID card photos */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {(["front", "back"] as const).map((side) => (
            <div key={side}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {side === "front" ? "Hình chụp mặt trước CCCD" : "Hình chụp sau trước CCCD"}
              </label>
              <div
                onClick={() => (side === "front" ? frontRef : backRef).current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a90d9] hover:bg-blue-50/30 transition-all overflow-hidden"
              >
                {(side === "front" ? form.frontImg : form.backImg) ? (
                  <img
                    src={side === "front" ? form.frontImg! : form.backImg!}
                    alt="cccd"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={24} className="text-slate-300" />
                )}
              </div>
              <input
                ref={side === "front" ? frontRef : backRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImg(side, e.target.files?.[0] ?? null)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#1a2744] text-white font-semibold py-3 rounded-xl hover:bg-[#243156] transition-colors flex items-center justify-center gap-2"
        >
          {submitted ? (
            <>
              <CheckCircle size={18} className="text-green-400" /> Đã xác nhận!
            </>
          ) : (
            "Xác nhận"
          )}
        </button>
      </div>
    </div>
  );
}
