import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Trash2 } from "lucide-react";

interface ServiceItem {
  id: number;
  name: string;
  date: string;
  quantity: number;
  unitPrice: number;
  paid: boolean;
}

const mockBookingInfo = {
  bookingCode: "BK-2904",
  customerName: "Nguyễn Khai Tâm",
  roomCode: "HCM01L203",
  checkin: "16/05/2026",
  checkout: "18/05/2026",
  roomPrice: 1_200_000,
  nights: 2,
  lateFee: 0,
};

const initialServices: ServiceItem[] = [
  { id: 1, name: "Sấy khô lấy liền", date: "20/4/2026", quantity: 2, unitPrice: 50_000, paid: false },
];

export default function CheckoutDetailPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [confirmed, setConfirmed] = useState(false);

  const serviceTotal = services.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);
  const total = mockBookingInfo.roomPrice * mockBookingInfo.nights + serviceTotal + mockBookingInfo.lateFee;

  const fmt = (n: number) => n.toLocaleString("vi-VN") + " đ";

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => navigate("/employee/checkout"), 1500);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-slate-400 mb-1">
          HCM01L203 &nbsp;&gt;&nbsp;
          <span className="text-slate-500">Nhân viên &gt; Check out</span>
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-[#1a2744] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-[#1a2744]">Check out</h2>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Service table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left px-5 py-3 font-medium">Hạng mục</th>
                <th className="text-left px-5 py-3 font-medium">Ngày sử dụng</th>
                <th className="text-left px-5 py-3 font-medium">Số lượng</th>
                <th className="text-left px-5 py-3 font-medium">Đơn giá</th>
                <th className="text-left px-5 py-3 font-medium">Thanh toán</th>
                <th className="text-left px-5 py-3 font-medium">Thành tiền</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t border-slate-50">
                  <td className="px-5 py-3 text-slate-700">{s.name}</td>
                  <td className="px-5 py-3 text-slate-500">{s.date}</td>
                  <td className="px-5 py-3 text-slate-700">{s.quantity}</td>
                  <td className="px-5 py-3 text-slate-700">{fmt(s.unitPrice)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.paid ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}>
                      {s.paid ? "đã trả" : "chưa"}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-[#1a2744]">
                    {fmt(s.quantity * s.unitPrice)}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setServices(services.filter((x) => x.id !== s.id))}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Empty rows */}
              {Array.from({ length: Math.max(0, 8 - services.length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="border-t border-slate-50">
                  <td colSpan={7} className="px-5 py-3 h-9" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right panel */}
        <div className="w-64 space-y-3 shrink-0">
          {/* Booking info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm text-sm space-y-2">
            <p className="font-semibold text-[#1a2744] mb-2">Thông tin đặt phòng:</p>
            <div className="space-y-1.5 text-slate-600">
              <p>
                <span className="text-slate-400 text-xs">Mã booking:</span>{" "}
                <span className="font-medium text-[#1a2744]">{mockBookingInfo.bookingCode}</span>
              </p>
              <p>
                <span className="text-slate-400 text-xs">Tên khách hàng:</span>{" "}
                <span className="font-medium text-[#1a2744]">{mockBookingInfo.customerName}</span>
              </p>
              <p>
                <span className="text-slate-400 text-xs">Mã phòng:</span>{" "}
                <span className="font-medium text-[#1a2744]">{mockBookingInfo.roomCode}</span>
              </p>
              <p>
                <span className="text-slate-400 text-xs">Thời gian:</span>{" "}
                <span className="font-medium text-[#1a2744]">
                  {mockBookingInfo.checkin} → {mockBookingInfo.checkout}
                </span>
              </p>
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm text-sm space-y-2">
            <p className="font-semibold text-[#1a2744] mb-2">Tóm tắt thanh toán:</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Tiền phòng:</span>
                <span className="font-medium">{fmt(mockBookingInfo.roomPrice * mockBookingInfo.nights)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Dịch vụ phát sinh:</span>
                <span className="font-medium">{fmt(serviceTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phụ phí trả muộn:</span>
                <span className="font-medium">{fmt(mockBookingInfo.lateFee)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-[#1a2744]">
                <span>TỔNG THANH TOÁN:</span>
                <span className="text-[#4a90d9]">{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={confirmed}
            className="w-full bg-[#1a2744] text-white font-semibold py-3 rounded-xl hover:bg-[#243156] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {confirmed ? (
              <>
                <CheckCircle size={16} className="text-green-400" /> Hoàn tất!
              </>
            ) : (
              "Xác nhận Check out"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
