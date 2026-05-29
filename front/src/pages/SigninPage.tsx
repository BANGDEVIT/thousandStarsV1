import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SigninPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.loading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await signIn(email, password);
    navigate("/profile", { replace: true });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <span className="auth-brand-name">THOUSAND-STAR</span>
            <span className="auth-brand-sub">HOTELS</span>
          </div>
          <div className="auth-tagline">
            Một nơi nghỉ dưỡng,
            <br />
            <em>vạn lần ấn tượng.</em>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <Link to="/" className="back-link">
          ← Quay về trang chủ
        </Link>

        <div className="auth-header">
          <h1 className="auth-title">Chào Mừng Trở Lại</h1>
          <p className="auth-subtitle">
            Đăng nhập để quản lý phòng, ưu đãi và thông tin lưu trú của bạn
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="signin-email">
              EMAIL
            </label>
            <input
              className="form-input"
              id="signin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signin-password">
              MẬT KHẨU
            </label>
            <input
              className="form-input"
              id="signin-password"
              type="password"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember-row">
            <label className="remember-left" htmlFor="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                className="remember-cb"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span className="remember-label">Ghi nhớ tôi</span>
            </label>
            <a href="#" className="forgot-link">
              Quên mật khẩu ?
            </a>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Hoặc</span>
            <div className="divider-line" />
          </div>

          <p className="switch-text">
            Chưa có tài khoản?{" "}
            <Link to="/signup" className="switch-link">
              Tạo Tài Khoản
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
