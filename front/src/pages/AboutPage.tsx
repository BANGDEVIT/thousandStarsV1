import { useNavigate } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  {
    icon: "💎",
    name: "Sự tinh tế",
    desc: "Vẻ đẹp ẩn sâu và tinh tế trong từng đường nét kiến trúc, mang lại không gian sống đẳng cấp, không giới hạn.",
  },
  {
    icon: "🤝",
    name: "Dịch vụ tận tâm",
    desc: "Chúng tôi thấu hiểu những mong muốn chưa nói thành lời, mang đến sự chú ý đến từng chi tiết nhỏ nhất.",
  },
  {
    icon: "🌿",
    name: "Bền vững",
    desc: "Cam kết bảo tồn thiên nhiên và hỗ trợ cộng đồng bản địa, để mỗi hành trình du lịch là những điều đẹp.",
  },
];

const timeline = [
  {
    year: "1984",
    title: "Sự khởi đầu",
    body: "Thousand Stars mở cửa khu nghỉ dưỡng đầu tiên tại một hòn đảo biệt lập, định nghĩa lại khái niệm nghỉ dưỡng riêng tư.",
  },
  {
    year: "2005",
    title: "Vươn ra thế giới",
    body: "Mở rộng khách sạn sang các thành phố di sản, kết hợp kiến trúc hiện đại với văn hóa bản địa đặc sắc.",
  },
  {
    year: "Nay",
    title: "Tiên phong bền vững",
    body: "Thành lập quỹ bảo tồn Stars Foundation, lắp dựng công nghệ xanh 100% vào toàn bộ hệ thống vận hành.",
  },
];

const team = [
  {
    name: "Alexander Wright",
    role: "Chief Executive Officer",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Elena Moretti",
    role: "Creative Director",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Julian Thorne",
    role: "Operations Director",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    name: "Sophia Tran",
    role: "Sustainability Lead",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Navbar />

      <div className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-content">
          <p className="about-hero-subtitle" onClick={() => navigate("/")}>
            ← SÁNG TẠO DI SẢN CỦA SỰ TĨNH LẶNG
          </p>
          <h1 className="about-hero-title">
            Câu chuyện của
            <br />
            Thousand Stars
          </h1>
        </div>
      </div>

      <div className="section-wrapper">
        <div className="section">
          <div className="vision-split">
            <div className="vision-img">
              <img
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80"
                alt="Luxury interior"
              />
            </div>
            <div className="vision-text">
              <p className="section-label">TẦM NHÌN & SỨ MỆNH</p>
              <h2 className="vision-title">Triết lý sống giữa ngàn sao</h2>
              <p className="vision-body">
                Tại Thousand Stars, chúng tôi không chỉ xây dựng những điểm lưu trú.
                Chúng tôi tạo nên những hành trình của sự tinh tế, nơi mỗi chi tiết
                nhỏ đều được chăm chút tận tâm và tôn vinh vẻ đẹp nguyên bản của thiên
                nhiên cùng sự riêng tư tuyệt đối.
              </p>
              <p className="vision-body">
                Sứ mệnh của chúng tôi là mang đến mỗi kỳ nghỉ &quot;Quiet Luxury&quot;
                đúng nghĩa — một sự sang trọng không cần lên tiếng, được cảm nhận qua
                sự tinh tế của dịch vụ và lòng tôn trọng sâu sắc đối với hệ sinh thái
                địa phương.
              </p>
              <div className="vision-stats">
                <div className="vision-stat">
                  <div className="vision-stat-num">98%</div>
                  <div className="vision-stat-label">Sự hài lòng</div>
                </div>
                <div className="vision-stat">
                  <div className="vision-stat-num">15+</div>
                  <div className="vision-stat-label">Khu nghỉ dưỡng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrapper-white">
        <div className="section">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="section-label">GIÁ TRỊ CỐT LÕI</p>
            <h2 className="section-title">Ba trụ cột tạo nên thương hiệu Thousand Stars</h2>
          </div>
          <div className="values-grid">
            {values.map((v) => (
              <div className="value-card" key={v.name}>
                <div className="value-icon">{v.icon}</div>
                <div className="value-name">{v.name}</div>
                <div className="value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-wrapper">
        <div className="section">
          <div style={{ marginBottom: 48 }}>
            <p className="section-label">DI SẢN</p>
            <h2 className="section-title">Dòng thời gian lịch sử</h2>
            <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 14 }}>
              Bốn thập kỷ kiến tạo những chuẩn mực cho sự sang trọng tiến hóa mãi mãi.
            </p>
          </div>
          <div className="timeline">
            {timeline.map((t) => (
              <div className="timeline-item" key={t.year}>
                <div className="timeline-year">{t.year}</div>
                <div>
                  <div className="timeline-event-title">{t.title}</div>
                  <div className="timeline-event-body">{t.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-wrapper-white">
        <div className="section">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="section-title">Đội ngũ lãnh đạo</h2>
            <p style={{ color: "var(--text-muted)", marginTop: 10, fontSize: 14 }}>
              Những con người tâm huyết đằng sau thành công của thương hiệu
            </p>
          </div>
          <div className="team-grid">
            {team.map((m) => (
              <div className="team-card" key={m.name}>
                <div className="team-photo">
                  <img src={m.img} alt={m.name} />
                </div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2 className="cta-title">
          Bắt đầu hành trình của bạn
          <br />
          tại Thousand Stars
        </h2>
        <div className="cta-btns">
          <button type="button" className="btn-primary" onClick={() => navigate("/")}>
            KHÁM PHÁ BIỆT THỰ
          </button>
          <button type="button" className="btn-outline" onClick={() => navigate("/payment")}>
            ĐẶT PHÒNG NGAY
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
