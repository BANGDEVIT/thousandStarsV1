import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";

export function HeroSection() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0D2535]">
      {/* Background gradient layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D2535] via-[#1a3a50] to-[#0D2535]" />
        {/* Decorative light blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#335F76]/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#E5DAC2]/10 blur-[100px]" />
        {/* Star dots */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#E5DAC2]" />
            <span className="text-[#E5DAC2] text-xs font-semibold tracking-[0.3em] uppercase">
              Khách sạn 5 sao
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] font-['Lora']">
            Nghỉ dưỡng <br />
            <span className="text-[#E5DAC2]">đẳng cấp</span> giữa<br />
            lòng thành phố
          </h1>

          <p className="text-white/60 text-lg leading-relaxed max-w-md">
            Trải nghiệm không gian nghỉ dưỡng sang trọng với hơn 200 phòng,
            dịch vụ 24/7 và tầm nhìn toàn cảnh thành phố.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/rooms")}
              className="px-8 py-3.5 bg-[#E5DAC2] text-[#0D2535] font-bold text-sm rounded-full hover:bg-white transition-colors cursor-pointer"
            >
              Đặt phòng ngay
            </button>
            {!accessToken && (
              <button
                onClick={() => navigate("/signin")}
                className="px-8 py-3.5 border border-white/20 text-white font-semibold text-sm rounded-full hover:border-white/50 transition-colors cursor-pointer"
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-4 border-t border-white/10">
            {[
              { num: "200+", label: "Phòng nghỉ" },
              { num: "15+", label: "Năm kinh nghiệm" },
              { num: "98%", label: "Hài lòng" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-[#E5DAC2] font-['Lora']">{s.num}</div>
                <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — decorative card */}
        <div className="hidden md:block relative">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/src/assets/hero.png"
              alt="Thousand Stars Hotel"
              className="w-full h-[480px] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2535]/80 via-transparent to-transparent" />
            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white font-['Lora'] font-semibold">Thousand Stars Hotel</div>
              <div className="text-white/60 text-xs mt-1">Trung tâm TP. Hồ Chí Minh</div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#E5DAC2] text-sm">★</span>
                ))}
              </div>
            </div>
          </div>
          {/* Floating card nổi */}
          <div className="absolute -top-6 -right-6 bg-[#335F76] rounded-2xl p-5 shadow-2xl border border-white/10 w-44">
            <div className="text-white/60 text-xs">Giá từ</div>
            <div className="text-white text-2xl font-bold font-['Lora'] mt-1">890K</div>
            <div className="text-white/60 text-xs">/ đêm</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-white/20" />
        <div className="text-white/30 text-xs tracking-widest uppercase">scroll</div>
      </div>
    </section>
  );
}
