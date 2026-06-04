import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  const { signOut, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <LogOut className="w-4 h-4" />
      {loading ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
