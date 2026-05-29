import { Link } from "react-router";

export default function SignupPage() {
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
          <h1 className="auth-title">Chào Mừng Bạn</h1>
          <p className="auth-subtitle">Đăng ký để nhận những thông tin ưu đãi</p>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">
              EMAIL
            </label>
            <input className="form-input" id="signup-email" type="email" autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">
              MẬT KHẨU
            </label>
            <input
              className="form-input"
              id="signup-password"
              type="password"
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password-confirm">
              NHẬP LẠI MẬT KHẨU
            </label>
            <input
              className="form-input"
              id="signup-password-confirm"
              type="password"
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-submit">
            ĐĂNG KÝ
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Hoặc</span>
            <div className="divider-line" />
          </div>

          <p className="switch-text">
            Đã có tài khoản?{" "}
            <Link to="/signin" className="switch-link">
              Đăng Nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
