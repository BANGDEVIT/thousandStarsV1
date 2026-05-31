import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  CalendarCheck,
  FileText,
  CalendarClock,
  UserCircle,
  ShieldCheck,
  Settings,
  Bell,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

const navItems = [
  { label: "Tổng quan", icon: LayoutDashboard, path: "/admin" },
  { label: "Nhân viên", icon: Users, path: "/admin/employees" },
  { label: "Phòng", icon: BedDouble, path: "/admin/rooms" },
  { label: "Đặt phòng", icon: CalendarCheck, path: "/admin/bookings" },
  { label: "Hóa đơn", icon: FileText, path: "/admin/invoices" },
  { label: "Ca làm", icon: CalendarClock, path: "/admin/shifts" },
  { label: "Hồ Sơ", icon: UserCircle, path: "/admin/profile" },
  { label: "Phân Quyền", icon: ShieldCheck, path: "/admin/permissions" },
  { label: "Cài đặt", icon: Settings, path: "/admin/settings" },
];

function displayName(email?: string) {
  if (!email) return "Quản trị viên";
  const local = email.split("@")[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function initials(email?: string) {
  const name = displayName(email);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function primaryRole(roles: string[]) {
  if (roles.includes("admin")) return "ADMIN";
  if (roles.includes("manager")) return "MANAGER";
  if (roles.includes("staff")) return "STAFF";
  return roles[0]?.toUpperCase() ?? "USER";
}

export default function AdminLayout() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const name = displayName(user?.email);
  const role = primaryRole(user?.roles ?? []);
  const userInitials = initials(user?.email);

  const handleLogout = async () => {
    await logout();
    navigate("/signin", { replace: true });
  };

  return (
    <div
      style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}
      className={`flex h-screen overflow-hidden ${dark ? "dark" : ""}`}
    >
      <aside className="w-[220px] min-w-[220px] bg-[#1a2744] flex flex-col z-10">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#243156]">
          <div className="w-9 h-9 bg-[#c9a227] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">TS</span>
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">Thousand Stars</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">Admin Console</p>
          </div>
        </div>

        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-5 pt-4 pb-2">
          Quản Trị
        </p>

        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-4">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#2d3f6e] text-white"
                    : "text-slate-300 hover:bg-[#243156] hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-[#243156]">
          <div className="bg-[#243156] rounded-xl px-3 py-2.5">
            <p className="text-slate-400 text-[10px] mb-1">Đã đăng nhập</p>
            <p className="text-white text-sm font-semibold leading-none">{name}</p>
            <p className="text-[#c9a227] text-xs mt-0.5">{role}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex items-center gap-3 px-6 py-3 text-slate-300 hover:text-white hover:bg-[#243156] transition-colors text-sm border-t border-[#243156] w-full"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f4fa]">
        <header className="h-[64px] bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDark(!dark)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={19} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#1a2744] leading-none">{name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{role}</p>
              </div>
              <div className="w-9 h-9 bg-[#1a2744] rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
