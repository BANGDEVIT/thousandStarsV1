import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { registerSchema } from "@/features/auth/schemas/authSchema";
import { resolvePostLoginPath } from "@/features/auth/utils/postLoginRedirect";

export default function SignupPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const parsed = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      phone: phone.trim() || undefined,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    const { firstName: fn, lastName: ln, email: em, phone: ph, password: pw } = parsed.data;

    try {
      await register({
        email: em,
        password: pw,
        firstName: fn,
        lastName: ln,
        phone: ph,
      });
      await login({ email: em, password: pw });
      const roles = useAuthStore.getState().user?.roles ?? [];
      navigate(resolvePostLoginPath(roles), { replace: true });
    } catch {
      /* toast trong store */
    }
  };

  const err = (key: string) =>
    fieldErrors[key] ? <p className="form-error">{fieldErrors[key]}</p> : null;

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

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-firstname">
                TÊN
              </label>
              <input
                className="form-input"
                id="signup-firstname"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {err("firstName")}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-lastname">
                HỌ
              </label>
              <input
                className="form-input"
                id="signup-lastname"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {err("lastName")}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">
              EMAIL
            </label>
            <input
              className="form-input"
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {err("email")}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-phone">
              SỐ ĐIỆN THOẠI <span className="form-optional">(tuỳ chọn)</span>
            </label>
            <input
              className="form-input"
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              placeholder="0909123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {err("phone")}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">
              MẬT KHẨU
            </label>
            <input
              className="form-input"
              id="signup-password"
              type="password"
              placeholder="Tối thiểu 8 ký tự, có hoa/thường/số/đặc biệt"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {err("password")}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password-confirm">
              NHẬP LẠI MẬT KHẨU
            </label>
            <input
              className="form-input"
              id="signup-password-confirm"
              type="password"
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {err("confirmPassword")}
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
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
