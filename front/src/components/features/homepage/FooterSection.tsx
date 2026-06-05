export function FooterSection() {
  return (
    <footer className="bg-[#0D2535] py-16 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <h3 className="text-white text-2xl font-bold font-['Lora']">THOUSAND STARS</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Khách sạn 5 sao tại trung tâm TP. Hồ Chí Minh. Nơi mỗi khoảnh
              khắc trở thành kỷ niệm khó quên.
            </p>
            <div className="flex gap-3">
              {["FB", "IG", "TW"].map((s) => (
                <div
                  key={s}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 text-xs hover:border-[#E5DAC2] hover:text-[#E5DAC2] transition-colors cursor-pointer"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-5">Khám phá</h4>
            <ul className="flex flex-col gap-3">
              {["Trang chủ", "Phòng nghỉ", "Tiện ích", "Về chúng tôi"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/50 text-sm hover:text-[#E5DAC2] transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-5">Liên hệ</h4>
            <ul className="flex flex-col gap-3 text-white/50 text-sm">
              <li>📍 123 Lê Lợi, Q.1, TP.HCM</li>
              <li>📞 (028) 3823 xxxx</li>
              <li>✉️ info@thousandstars.vn</li>
              <li>🕐 Hotline 24/7</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs">
          <span>© 2026 Thousand Stars Hotel. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white/60 transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
