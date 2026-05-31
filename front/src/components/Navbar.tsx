import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { displayNameFromEmail } from "@/features/auth/utils/postLoginRedirect";

type NavbarProps = {
  dark?: boolean;
  /** Override auth state; mặc định lấy từ store */
  loggedIn?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

export default function Navbar({ dark = true, loggedIn: loggedInProp }: NavbarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const loggedIn = loggedInProp ?? isAuthenticated;
  const initials = getInitials(displayNameFromEmail(user?.email));

  const currentPage =
    pathname === "/" ? "home" : pathname.replace(/^\//, "").split("/")[0];

  return (
    <nav className={`navbar ${dark ? "dark" : ""}`}>
      <span className="nav-logo" onClick={() => navigate("/")} role="button" tabIndex={0}>
        THOUSAND STARS
      </span>

      <div className="nav-links">
        <Link to="/" className={currentPage === "home" ? "active" : ""}>
          Trang chủ
        </Link>
        <Link
          to="/hotels"
          className={currentPage === "hotels" || pathname.startsWith("/hotels/") ? "active" : ""}
        >
          Khách sạn
        </Link>
        <Link to="/services" className={currentPage === "services" ? "active" : ""}>
          Dịch vụ
        </Link>
        <Link to="/about" className={currentPage === "about" ? "active" : ""}>
          Về THOUSAND STARS
        </Link>
        <Link to="/contact" className={currentPage === "contact" ? "active" : ""}>
          Liên hệ
        </Link>
      </div>

      <div className="nav-right">
        {loggedIn ? (
          <button
            type="button"
            className={`avatar-btn ${pathname === "/profile" ? "active" : ""}`}
            onClick={() => navigate("/profile")}
            title="Tài khoản của tôi"
            aria-label="Tài khoản của tôi"
          >
            {initials}
          </button>
        ) : (
          <button type="button" className="btn-login" onClick={() => navigate("/signin")}>
            ĐĂNG NHẬP
          </button>
        )}
      </div>
    </nav>
  );
}
