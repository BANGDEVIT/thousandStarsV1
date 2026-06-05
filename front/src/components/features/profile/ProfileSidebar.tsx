import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router";
import { Lock, Settings, LogOut, User, History } from "lucide-react";

interface Props {
  profile: {
    first_name?: string;
    last_name?: string;
    nationality?: string;
    reward_points?: number;
  };
  activeTab: "info" | "security" | "settings" | "history";
  onTabChange: (tab: "info" | "security" | "settings" | "history") => void;
}

const tabs = [
  { key: "info", label: "Thông tin cá nhân", icon: User },
  { key: "history", label: "Lịch sử đặt phòng", icon: History },
  { key: "security", label: "Bảo mật", icon: Lock },
  { key: "settings", label: "Tùy chọn", icon: Settings },
] as const;

export function ProfileSidebar({ profile, activeTab, onTabChange }: Props) {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const initials =
    profile.first_name?.charAt(0) ?? profile.last_name?.charAt(0) ?? "?";

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <aside className="w-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:sticky lg:top-28 lg:h-fit">
      <div className="flex flex-col items-center gap-3 border-b border-slate-100 pb-5 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#335F76] shadow-lg shadow-[#335F76]/20">
          <span className="text-2xl font-semibold text-white">{initials}</span>
        </div>
        <div>
          <p className="font-semibold text-slate-800">
            {profile.first_name} {profile.last_name}
          </p>
          <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
            CUSTOMER
          </span>
        </div>
        {profile.reward_points !== undefined && (
          <div className="w-full rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-2xl font-bold text-[#335F76]">{profile.reward_points}</p>
            <p className="text-xs text-slate-400">Điểm thưởng</p>
          </div>
        )}
      </div>

      <nav className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`inline-flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-[#335F76] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
      >
        <LogOut className="size-4" />
        Đăng xuất
      </button>
    </aside>
  );
}
