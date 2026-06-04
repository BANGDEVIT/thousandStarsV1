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

export function ProfileSidebar({ profile, activeTab, onTabChange }: Props) {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const initials = profile.first_name?.charAt(0) ?? profile.last_name?.charAt(0) ?? "?";

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="w-full md:w-64 md:shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6 h-fit">

      {/* Avatar + tên */}
      <div className="flex flex-col items-center gap-3 pb-6 border-b border-slate-100">
        <div className="w-16 h-16 rounded-full bg-[#335F76] flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">{initials}</span>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-800">{profile.first_name} {profile.last_name}</p>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">CUSTOMER</span>
        </div>
        {profile.reward_points !== undefined && (
          <div className="w-full bg-slate-50 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[#335F76]">{profile.reward_points}</p>
            <p className="text-xs text-slate-400">Điểm thưởng</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1">
        <button
          onClick={() => onTabChange("info")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors w-full text-left
            ${activeTab === "info" ? "bg-[#335F76] text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <User className="size-4" />
          Thông tin cá nhân
        </button>
        <button
          onClick={() => onTabChange("security")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors w-full text-left
            ${activeTab === "security" ? "bg-[#335F76] text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <Lock className="size-4" />
          Bảo mật
        </button>
        <button
          onClick={() => onTabChange("settings")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors w-full text-left
            ${activeTab === "settings" ? "bg-[#335F76] text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <Settings className="size-4" />
          Tuỳ chọn
        </button>
        <button
          onClick={() => onTabChange("history")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors w-full text-left
            ${activeTab === "history" ? "bg-[#335F76] text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <History className="size-4" />
          Lịch sử đặt phòng
        </button>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors mt-auto"
      >
        <LogOut className="size-4" />
        Đăng xuất
      </button>

    </div>
  );
}