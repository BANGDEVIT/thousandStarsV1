import { NavLink, Outlet, useNavigate } from "react-router";
import { BedDouble, CalendarCheck, CalendarX, Settings, Bell, Moon, LogOut } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

const navItems = [
  { label: "Phòng", icon: BedDouble, path: "/employee/rooms" },
  { label: "Thuê phòng", icon: CalendarCheck, path: "/employee/rent" },
  { label: "Check in", icon: CalendarCheck, path: "/employee/checkin" },
  { label: "Check out", icon: CalendarX, path: "/employee/checkout" },
  { label: "Cài đặt", icon: Settings, path: "/employee/settings" },
];

function displayName(email?: string) {
  if (!email) return "Nhân viên";
  const local = email.split("@")[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function primaryRole(roles: string[]) {
  if (roles.includes("staff")) return "Lễ tân";
  if (roles.includes("manager")) return "Quản lý";
  if (roles.includes("admin")) return "Admin";
  return "Nhân viên";
}

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/signin", { replace: true });
  };

  return (
    <div
      style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}
      className="flex h-screen overflow-hidden"
    >
      <aside className="w-[180px] min-w-[180px] bg-[#1a2744] flex flex-col py-6 gap-2 z-10">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 rounded-xl mx-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#2d3f6e] text-white"
                  : "text-slate-300 hover:bg-[#243156] hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex items-center gap-3 px-5 py-3 rounded-xl mx-2 mt-auto text-sm text-slate-300 hover:bg-[#243156] hover:text-white"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f4fa]">
        <header className="h-[70px] bg-[#1a2744] flex items-center justify-between px-8 shrink-0">
          <h1 className="text-white text-2xl font-bold tracking-wide">Nhân viên</h1>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-slate-300" />
            <Moon size={20} className="text-slate-300" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white text-sm font-semibold leading-none">
                  {displayName(user?.email)}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{primaryRole(user?.roles ?? [])}</p>
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-pink-300 bg-[#2d3f6e] flex items-center justify-center text-white text-xs font-bold">
                {(user?.email?.[0] ?? "N").toUpperCase()}
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
