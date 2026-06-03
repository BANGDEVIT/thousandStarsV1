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
          {/* Avatar tròn */}
          <div className="h-8 w-8 rounded-full bg-[#E5DAC2] flex items-center justify-center shrink-0">
            <span className="text-[#52483C] text-sm font-semibold">{initials}</span>
          </div>
          {/* Tên */}
          <span className="text-white text-sm font-medium hidden sm:block">
            {profile.first_name} {profile.last_name}
          </span>
          <ChevronsUpDown className="size-3.5 text-white/60 hidden sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56 rounded-xl shadow-lg border border-gray-100"
        align="end"
        sideOffset={10}
      >
        {/* Header */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="h-10 w-10 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0">
              <span className="text-white font-semibold">{initials}</span>
            </div>
            <div className="grid text-left leading-tight">
              <span className="font-semibold text-sm text-gray-800">
                {profile.first_name} {profile.last_name}
              </span>
              <span className="text-xs text-gray-400">{profile.account?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="cursor-pointer gap-2 px-3 py-2"
          >
            <BadgeCheck className="size-4 text-gray-500" />
            <span>Tài khoản</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2 px-3 py-2">
            <Bell className="size-4 text-gray-500" />
            <span>Thông báo</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-2 px-3 py-2 text-red-500 focus:text-red-500 focus:bg-red-50"
        >
          <LogOut className="size-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}