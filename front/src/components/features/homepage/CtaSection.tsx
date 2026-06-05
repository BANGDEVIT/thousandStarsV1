import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";

export function CtaSection() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);

  return (
    <section className="bg-[#335F76] py-24 px-6 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#0D2535]/30 translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-[#E5DAC2]" />
          <span className="text-[#E5DAC2] text-xs font-semibold tracking-[0.3em] uppercase">
            Đặt phòng
          </span>
          <div className="h-px w-10 bg-[#E5DAC2]" />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-['Lora']">
          Sẵn sàng cho<br />
          <span className="text-[#E5DAC2]">kỳ nghỉ hoàn hảo?</span>
        </h2>

        <p className="text-white/70 text-lg max-w-xl">
          Đặt phòng ngay hôm nay để nhận ưu đãi sớm. Miễn phí hủy phòng trước 48 giờ.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/rooms")}
            className="px-10 py-4 bg-[#E5DAC2] text-[#0D2535] font-bold rounded-full hover:bg-white transition-colors cursor-pointer text-sm"
          >
            Đặt phòng ngay
          </button>
          {!accessToken && (
            <button
              onClick={() => navigate("/signup")}
              className="px-10 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:border-white/70 transition-colors cursor-pointer text-sm"
            >
              Tạo tài khoản
            </button>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 pt-6 border-t border-white/10 text-white/50 text-xs">
          <span>✓ Xác nhận ngay</span>
          <span>✓ Giá tốt nhất đảm bảo</span>
          <span>✓ Miễn phí hủy phòng</span>
          <span>✓ Hỗ trợ 24/7</span>
        </div>
      </div>
    </section>
  );
}
