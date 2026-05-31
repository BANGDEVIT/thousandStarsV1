import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import ProfileNavbar from "@/components/ProfileNavbar";
import { useAuthStore } from "@/features/auth/store/authStore";
import { displayNameFromEmail } from "@/features/auth/utils/postLoginRedirect";

const tabs = [
  { id: "profile", label: "Thông tin cá nhân", icon: "👤" },
  { id: "security", label: "Bảo mật", icon: "🔒" },
  { id: "preferences", label: "Tùy chọn", icon: "⚙️" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type Preferences = {
  emailNotification: boolean;
  smsNotification: boolean;
  newsletter: boolean;
  language: string;
  currency: string;
};

const RECENT_BOOKINGS = [
  {
    hotel: "Ha Long Bay",
    location: "Quảng Ninh",
    date: "14/12 – 21/12/2024",
    guests: "2 NL · 1 TE",
    price: "18.000K",
    status: "Hoàn thành",
  },
  {
    hotel: "Phú Quốc Resort",
    location: "Kiên Giang",
    date: "05/08 – 10/08/2024",
    guests: "2 NL",
    price: "22.000K",
    status: "Hoàn thành",
  },
  {
    hotel: "Đà Lạt Villa",
    location: "Lâm Đồng",
    date: "20/04 – 23/04/2024",
    guests: "2 NL · 2 TE",
    price: "14.000K",
    status: "Hoàn thành",
  },
];

const DEFAULT_PROFILE = {
  name: "Đỗ Ngọc Hiếu",
  email: "dongochieu@example.com",
  phone: "0912 345 678",
  role: "Guest",
  joinDate: "01/2024",
  totalBookings: 3,
  totalSpent: "54.000K",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const storeUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const profile = {
    name: displayNameFromEmail(storeUser?.email) || DEFAULT_PROFILE.name,
    email: storeUser?.email ?? DEFAULT_PROFILE.email,
    phone: DEFAULT_PROFILE.phone,
    role: "Guest",
    joinDate: DEFAULT_PROFILE.joinDate,
    totalBookings: DEFAULT_PROFILE.totalBookings,
    totalSpent: DEFAULT_PROFILE.totalSpent,
  };

  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [preferences, setPreferences] = useState<Preferences>({
    emailNotification: true,
    smsNotification: false,
    newsletter: true,
    language: "vi",
    currency: "VND",
  });

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Đã lưu thông tin cá nhân");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin", { replace: true });
    } catch {
      toast.error("Không thể đăng xuất");
    }
  };

  const togglePref = (key: keyof Pick<Preferences, "emailNotification" | "smsNotification" | "newsletter">) => {
    setPreferences((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="app profile-page">
      <ProfileNavbar />

      <div className="profile-hero">
        <div className="hero-content">
          <span className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="breadcrumb-sep"> / </span>
            <span className="breadcrumb-current">Tài khoản</span>
          </span>
          <h1>Tài khoản của tôi</h1>
        </div>
      </div>

      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="avatar-section">
            <div
              className="avatar-wrapper"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              title="Đổi ảnh đại diện"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">{initials}</div>
              )}
              <div className="avatar-overlay" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
            <div className="user-meta">
              <h2 className="user-name">{profile.name}</h2>
              <span className="user-badge">{profile.role}</span>
            </div>
            <p className="user-join">Thành viên từ {profile.joinDate}</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{profile.totalBookings}</span>
              <span className="stat-label">Đặt phòng</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{profile.totalSpent}</span>
              <span className="stat-label">Tổng chi tiêu</span>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Cài đặt tài khoản">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                {tab.label}
                <svg className="nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </nav>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Đăng xuất
          </button>
        </aside>

        <main className="profile-main">
          {activeTab === "profile" && (
            <div className="tab-panel">
              <div className="panel-header">
                <div>
                  <h3>Thông tin cá nhân</h3>
                  <p>Quản lý thông tin hồ sơ của bạn</p>
                </div>
                <button
                  type="button"
                  className={`btn-edit ${isEditing ? "active" : ""}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="profile-name">Họ và tên</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={form.name}
                    disabled={!isEditing}
                    className={isEditing ? "editable" : ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-email">Email</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={form.email}
                    disabled={!isEditing}
                    className={isEditing ? "editable" : ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-phone">Số điện thoại</label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={form.phone}
                    disabled={!isEditing}
                    className={isEditing ? "editable" : ""}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-role">Vai trò</label>
                  <input id="profile-role" type="text" value={profile.role} disabled />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button type="button" className="btn-save" onClick={handleSaveProfile}>
                    Lưu thay đổi
                  </button>
                </div>
              )}

              <div className="section-divider" />

              <div className="panel-header" style={{ marginTop: 0 }}>
                <div>
                  <h3>Lịch sử đặt phòng gần đây</h3>
                  <p>3 đặt phòng gần nhất</p>
                </div>
                <Link to="/my-bookings" className="link-more">
                  Xem tất cả →
                </Link>
              </div>

              <div className="booking-list">
                {RECENT_BOOKINGS.map((b) => (
                  <div className="booking-item" key={b.hotel + b.date}>
                    <div className="booking-dot" />
                    <div className="booking-info">
                      <span className="booking-hotel">{b.hotel}</span>
                      <span className="booking-location">📍 {b.location}</span>
                    </div>
                    <div className="booking-detail">
                      <span>{b.date}</span>
                      <span>{b.guests}</span>
                    </div>
                    <div className="booking-right">
                      <span className="booking-price">{b.price}</span>
                      <span className="booking-status">{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="tab-panel">
              <div className="panel-header">
                <div>
                  <h3>Bảo mật tài khoản</h3>
                  <p>Cập nhật mật khẩu để bảo vệ tài khoản</p>
                </div>
              </div>

              <div className="form-grid single">
                <div className="form-group">
                  <label htmlFor="pwd-current">Mật khẩu hiện tại</label>
                  <input
                    id="pwd-current"
                    type="password"
                    placeholder="••••••••"
                    className="editable"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pwd-new">Mật khẩu mới</label>
                  <input
                    id="pwd-new"
                    type="password"
                    placeholder="••••••••"
                    className="editable"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pwd-confirm">Xác nhận mật khẩu mới</label>
                  <input
                    id="pwd-confirm"
                    type="password"
                    placeholder="••••••••"
                    className="editable"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-save"
                  onClick={() => toast.success("Đã cập nhật mật khẩu")}
                >
                  Cập nhật mật khẩu
                </button>
              </div>

              <div className="section-divider" />

              <div className="security-info">
                <div className="security-item">
                  <div className="security-icon safe">✓</div>
                  <div>
                    <strong>Xác thực hai yếu tố</strong>
                    <p>
                      Chưa kích hoạt — <a href="#">Kích hoạt ngay</a>
                    </p>
                  </div>
                </div>
                <div className="security-item">
                  <div className="security-icon safe">✓</div>
                  <div>
                    <strong>Đăng nhập lần cuối</strong>
                    <p>Hôm nay, 09:24 — Hồ Chí Minh, VN</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="tab-panel">
              <div className="panel-header">
                <div>
                  <h3>Tùy chọn cá nhân</h3>
                  <p>Điều chỉnh trải nghiệm của bạn</p>
                </div>
              </div>

              <div className="pref-section">
                <h4>Thông báo</h4>
                {(
                  [
                    { key: "emailNotification" as const, label: "Thông báo qua email", desc: "Nhận cập nhật đặt phòng qua email" },
                    { key: "smsNotification" as const, label: "Thông báo SMS", desc: "Nhận tin nhắn xác nhận đặt phòng" },
                    { key: "newsletter" as const, label: "Bản tin Thousand Stars", desc: "Nhận ưu đãi và tin tức mới nhất" },
                  ] as const
                ).map(({ key, label, desc }) => (
                  <div className="pref-item" key={key}>
                    <div>
                      <span className="pref-label">{label}</span>
                      <span className="pref-desc">{desc}</span>
                    </div>
                    <button
                      type="button"
                      className={`toggle ${preferences[key] ? "on" : ""}`}
                      onClick={() => togglePref(key)}
                      aria-pressed={preferences[key]}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="section-divider" />

              <div className="pref-section">
                <h4>Ngôn ngữ & Tiền tệ</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="pref-lang">Ngôn ngữ hiển thị</label>
                    <select
                      id="pref-lang"
                      className="editable"
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    >
                      <option value="vi">🇻🇳 Tiếng Việt</option>
                      <option value="en">🇬🇧 English</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pref-currency">Đơn vị tiền tệ</label>
                    <select
                      id="pref-currency"
                      className="editable"
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    >
                      <option value="VND">VND — Đồng Việt Nam</option>
                      <option value="USD">USD — US Dollar</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-save"
                  onClick={() => toast.success("Đã lưu tùy chọn")}
                >
                  Lưu tùy chọn
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
