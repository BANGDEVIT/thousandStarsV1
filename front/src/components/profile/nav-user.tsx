import { useProfileStore } from "@/stores/useProfileStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuthStore } from "@/stores/useAuthStore"

export function NavUser() {
  const { profile } = useProfileStore()
  const { signOut } = useAuthStore()
  const navigate = useNavigate()

  if (!profile) return null

  const handleLogout = async () => {
    await signOut()
    navigate("/signin")
  }

  const initials = profile.first_name?.charAt(0) ?? profile.last_name?.charAt(0) ?? "?"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-white/10 cursor-pointer outline-none transition-colors">
          {/* Avatar tròn ngoài Navbar - Giữ màu kem cát sang trọng */}
          <div className="h-8 w-8 rounded-full bg-[#E5DAC2] flex items-center justify-center shrink-0">
            <span className="text-[#52483C] text-sm font-semibold">{initials}</span>
          </div>
          {/* Tên */}
          <span className="text-white text-xs font-semibold hidden sm:block">
            {profile.first_name} {profile.last_name}
          </span>
          <ChevronsUpDown className="size-3 text-white/60 hidden sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-1"
        align="end"
        sideOffset={10}
      >
        {/* Header Dropdown */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-3 py-3">
            {/* ĐỒNG BỘ: Đổi bg-[#3B82F6] thành màu thương hiệu của Navbar hoặc tiệp màu cát */}
            <div className="h-9 w-9 rounded-full bg-[#335F76] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
            <div className="grid text-left leading-tight">
              <span className="font-bold text-xs text-slate-800 font-['Lora']">
                {profile.first_name} {profile.last_name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                {profile.account?.email ?? profile.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-50" />

        {/* Các mục chức năng */}
        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="cursor-pointer gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 focus:text-slate-800 focus:bg-slate-50 rounded-lg transition-colors"
          >
            <BadgeCheck className="size-4 text-slate-400 group-hover:text-slate-600" />
            <span>Tài khoản</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 focus:text-slate-800 focus:bg-slate-50 rounded-lg transition-colors">
            <Bell className="size-4 text-slate-400 group-hover:text-slate-600" />
            <span>Thông báo</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-50" />

        {/* Nút Đăng xuất */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-2.5 px-3 py-2 text-xs font-semibold text-red-500 focus:text-red-500 focus:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="size-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}