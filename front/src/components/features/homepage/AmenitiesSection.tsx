const AMENITIES = [
  {
    icon: "🍽️",
    title: "Nhà hàng & Bar",
    desc: "Ẩm thực đa quốc gia với đầu bếp 5 sao, bar rooftop view toàn thành phố",
  },
  {
    icon: "🏊",
    title: "Hồ bơi vô cực",
    desc: "Hồ bơi tràn bờ tầng 28, mở cửa 24/7 với dịch vụ pool bar riêng",
  },
  {
    icon: "💆",
    title: "Spa & Wellness",
    desc: "Trung tâm spa cao cấp với liệu trình truyền thống và hiện đại",
  },
  {
    icon: "🏋️",
    title: "Phòng gym",
    desc: "Trang thiết bị hiện đại, huấn luyện viên cá nhân theo yêu cầu",
  },
  {
    icon: "🚗",
    title: "Đưa đón sân bay",
    desc: "Dịch vụ limousine cao cấp, đặt trước 24h, hoạt động mọi khung giờ",
  },
  {
    icon: "🤝",
    title: "Concierge 24/7",
    desc: "Đội ngũ hỗ trợ đa ngôn ngữ, sẵn sàng phục vụ mọi yêu cầu",
  },
];

export function AmenitiesSection() {
  return (
    <section className="bg-[#0D2535] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#E5DAC2]" />
            <span className="text-[#E5DAC2] text-xs font-semibold tracking-[0.3em] uppercase">
              Tiện ích
            </span>
            <div className="h-px w-10 bg-[#E5DAC2]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-['Lora']">
            Mọi tiện nghi<br />
            <span className="text-[#E5DAC2]">trong tầm tay</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AMENITIES.map((a) => (
            <div
              key={a.title}
              className="group p-7 rounded-2xl border border-white/10 hover:border-[#E5DAC2]/30 hover:bg-white/5 transition-all duration-300 cursor-default"
            >
              <div className="text-4xl mb-5">{a.icon}</div>
              <h3 className="text-white font-bold text-lg font-['Lora'] mb-2 group-hover:text-[#E5DAC2] transition-colors">
                {a.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
