import { NavLink } from "react-router";

const NAV_ITEMS = [
  { label: "Tổng quan", path: "/", icon: "⊞" },
  { label: "Nhân viên", path: "/employees", icon: "👥" },
  { label: "Phòng", path: "/rooms", icon: "🚪" },
  { label: "Đặt phòng", path: "/bookings", icon: "📅" },
  { label: "Hoá đơn", path: "/invoices", icon: "🧾" },
  { label: "Hồ sơ", path: "/profile", icon: "👤" },
];

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-[#F7F7F5] font-sans">
      {/* ── Sidebar ────────────────────────────── */}
      <aside className="w-[220px] min-w-[220px] bg-[#1B3A5C] flex flex-col">
        {/* Logo */}
        <div className="px-4 py-[18px] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 bg-[#C9A84C] rounded-lg flex items-center justify-center
                            text-[#1B3A5C] font-bold text-sm flex-shrink-0"
            >
              AH
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold leading-tight">
                Aurélien Hotel
              </p>
              <p className="text-[#9DB4D1] text-[10px] tracking-widest uppercase">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col py-4 gap-0.5">
          <p className="px-4 text-[10px] text-[#9DB4D1] tracking-[1.2px] uppercase font-medium mb-1">
            Quản trị
          </p>
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-[9px] text-[13px] border-l-2 transition-all
                 ${
                   isActive
                     ? "text-white border-[#C9A84C] bg-white/[0.08]"
                     : "text-[#9DB4D1] border-transparent hover:text-white hover:bg-white/[0.06]"
                 }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <p className="px-4 text-[10px] text-[#9DB4D1] tracking-[1.2px] uppercase font-medium mt-3 mb-1">
            Tài khoản
          </p>
          {NAV_ITEMS.slice(5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-[9px] text-[13px] border-l-2 transition-all
                 ${
                   isActive
                     ? "text-white border-[#C9A84C] bg-white/[0.08]"
                     : "text-[#9DB4D1] border-transparent hover:text-white hover:bg-white/[0.06]"
                 }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer user */}
        <div className="mt-auto px-4 py-3 border-t border-white/10 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-content:center
                          text-[#1B3A5C] font-bold text-xs flex-shrink-0 flex items-center justify-center"
          >
            NQ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">
              Nguyễn Quản Trị
            </p>
            <p className="text-[#C9A84C] text-[10px] tracking-wide">ADMIN</p>
          </div>
          <button className="text-[#9DB4D1] hover:text-white text-sm p-1 rounded">
            ⎋
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="h-14 bg-white border-b border-[#E2E2D8] flex items-center
                           px-6 gap-4 flex-shrink-0"
        >
          <span className="text-xs font-semibold text-[#64748B] tracking-widest uppercase">
            Aurélien Admin
          </span>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="w-9 h-9 rounded-full border border-[#E2E2D8] flex items-center
                               justify-center text-[#64748B] hover:bg-[#F0F0EA] transition-colors"
            >
              🔔
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div
                className="w-9 h-9 rounded-full bg-[#1B3A5C] flex items-center justify-center
                              text-white font-semibold text-sm"
              >
                NQ
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0A0A0A]">
                  Nguyễn Quản Trị
                </p>
                <p className="text-[11px] text-[#64748B]">ADMIN</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
