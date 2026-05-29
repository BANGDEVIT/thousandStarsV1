import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

export default function ProfileNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);

  const displayName = user?.displayName ?? "Khách";
  const initials = getInitials(displayName);

  const segment = pathname.replace(/^\//, "").split("/")[0];
  const isProfileHome = pathname === "/profile";

  return (
    <nav className="navbar dark navbar--profile">
      <span
        className="nav-logo"
        onClick={() => navigate("/profile")}
        onKeyDown={(e) => e.key === "Enter" && navigate("/profile")}
        role="button"
        tabIndex={0}
      >
        THOUSAND STARS
      </span>

      <div className="nav-links">
        <Link to="/profile" className={isProfileHome ? "active" : ""}>
          Trang chủ
        </Link>
        <Link
          to="/hotels"
          className={segment === "hotels" ? "active" : ""}
        >
          Khách sạn
        </Link>
        <Link to="/services" className={segment === "services" ? "active" : ""}>
          Dịch vụ
        </Link>
        <Link to="/about" className={segment === "about" ? "active" : ""}>
          Về THOUSAND STARS
        </Link>
        <Link to="/contact" className={segment === "contact" ? "active" : ""}>
          Liên hệ
        </Link>
      </div>

      <div className="nav-right nav-right--profile-only">
        <button
          type="button"
          className={`avatar-btn avatar-btn--profile ${isProfileHome ? "active" : ""}`}
          onClick={() => navigate("/profile")}
          title="Tài khoản của tôi"
          aria-label="Tài khoản của tôi"
          aria-current={isProfileHome ? "page" : undefined}
        >
          {initials}
        </button>
      </div>
    </nav>
  );
}
