import { Link } from "react-router";
import { NavUser } from "@/components/features/profile/nav-user";

const navItems = [
  { label: "Trang chủ", to: "/homepage" },
  { label: "Phòng", to: "/rooms" },
  { label: "Về THOUSAND STARS", to: "/about" },
  { label: "Liên hệ", to: "/docs" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#335F76] shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/homepage"
            className="font-['Lora'] text-2xl font-bold tracking-wide text-white md:text-3xl"
          >
            THOUSAND STARS
          </Link>
          <div className="md:hidden">
            <NavUser />
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-white md:justify-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-1 py-1 transition hover:text-[#E5DAC2]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:min-w-44 md:justify-end">
          <NavUser />
        </div>
      </div>
    </header>
  );
}
