import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";

export function NavUser() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const signOut = useAuthStore((state) => state.signOut);
  const profile = useProfileStore((state) => state.profile);

  const handleSignOut = async () => {
    await signOut();
    navigate("/homepage");
  };

  if (!accessToken) {
    return (
      <button
        type="button"
        onClick={() => navigate("/signin")}
        className="rounded-full bg-[#E5DAC2] px-5 py-2 text-sm font-bold text-[#0D2535] transition hover:bg-white"
      >
        Đăng nhập
      </button>
    );
  }

  const displayName =
    profile?.display_name ||
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "Profile";

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        <User className="h-4 w-4" />
        <span className="max-w-32 truncate">{displayName}</span>
      </button>
      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
        aria-label="Đăng xuất"
        title="Đăng xuất"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
