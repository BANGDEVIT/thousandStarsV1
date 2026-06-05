const REVIEWS = [
  {
    name: "Nguyễn Minh Khoa",
    role: "Doanh nhân",
    initials: "MK",
    rating: 5,
    text: "Dịch vụ tuyệt vời, phòng sạch sẽ và nhân viên rất nhiệt tình. Tôi đã ở đây nhiều lần và lần nào cũng hài lòng. Chắc chắn sẽ quay lại.",
    color: "bg-[#335F76]",
  },
  {
    name: "Trần Thị Lan Anh",
    role: "Blogger du lịch",
    initials: "LA",
    rating: 5,
    text: "Hồ bơi vô cực và view từ tầng 28 là điểm nhấn không thể quên. Breakfast buffet cũng rất phong phú. Thousand Stars xứng đáng 5 sao!",
    color: "bg-[#2d4a3e]",
  },
  {
    name: "Lê Hoàng Nam",
    role: "Kỹ sư phần mềm",
    initials: "HN",
    rating: 5,
    text: "Đặt phòng online rất nhanh, check-in không mất thời gian. Phòng yên tĩnh, wifi mạnh — hoàn hảo cho work & travel. Highly recommend!",
    color: "bg-[#4a2d1a]",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-[#F5F0E8] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#335F76]" />
            <span className="text-[#335F76] text-xs font-semibold tracking-[0.3em] uppercase">
              Đánh giá
            </span>
            <div className="h-px w-10 bg-[#335F76]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0D2535] font-['Lora']">
            Khách hàng<br />
            <span className="text-[#335F76]">nói gì về chúng tôi</span>
          </h2>
        </div>

        {/* Reviews */}
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5DAC2]/40 flex flex-col gap-5">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(r.rating)].map((_, i) => (
                  <span key={i} className="text-[#E5DAC2] text-lg">★</span>
                ))}
              </div>
              {/* Text */}
              <p className="text-[#335F76]/70 text-sm leading-relaxed flex-1 italic">
                "{r.text}"
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-sm font-bold">{r.initials}</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0D2535] font-['Lora']">{r.name}</div>
                  <div className="text-xs text-[#335F76]/50">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
