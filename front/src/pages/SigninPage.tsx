import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { resolvePostLoginPath } from "@/features/auth/utils/postLoginRedirect";

type LocationState = {
  from?: { pathname: string };
};

export default function SigninPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const fromPath = (location.state as LocationState | null)?.from?.pathname;

  useEffect(() => {
    if (!isAuthenticated || !user?.roles.length) return;
    navigate(resolvePostLoginPath(user.roles, fromPath), { replace: true });
  }, [isAuthenticated, user, fromPath, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      await login({ email, password });
      const roles = useAuthStore.getState().user?.roles ?? [];
      navigate(resolvePostLoginPath(roles, fromPath), { replace: true });
    } catch {
      /* toast trong store */
    }
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
            Đăng nhập cho khách hàng hoặc nhân viên — tài khoản quản trị sẽ vào bảng
            điều khiển, khách hàng vào trang cá nhân.
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

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
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
