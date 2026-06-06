import * as React from "react";
import { NavLink, useNavigate } from "react-router";
import {
  BedDouble,
  Building2,
  CalendarCheck,
  ClipboardList,
  DoorClosed,
  DoorOpen,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const staffNavItems = [
  {
    title: "Check-in",
    description: "Nhận phòng",
    url: "/staff/check-in",
    icon: DoorOpen,
  },
  {
    title: "Check-out",
    description: "Trả phòng",
    url: "/staff/check-out",
    icon: DoorClosed,
  },
  {
    title: "Rooms",
    description: "Danh sách phòng",
    url: "/staff/rooms",
    icon: BedDouble,
  },
  {
    title: "Bookings",
    description: "Quản lý booking",
    url: "/staff/bookings",
    icon: ClipboardList,
  },
];

export function StaffSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    navigate("/homepage", { replace: true });
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className={["border-r border-white/10 bg-[#0D2535] text-white", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <SidebarHeader className="border-b border-white/10 bg-[#0D2535] px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto rounded-xl p-0 text-white hover:bg-white/10 hover:text-white data-[slot=sidebar-menu-button]:p-0!"
            >
              <NavLink to="/staff/check-in" className="flex items-center gap-3 px-2 py-2">
                <span className="flex size-11 items-center justify-center rounded-xl border border-[#E5DAC2]/30 bg-[#335F76] shadow-sm">
                  <CalendarCheck className="size-5 text-[#E5DAC2]" />
                </span>
                <span className="min-w-0">
                  <span className="block font-['Lora'] text-base font-bold uppercase tracking-wide text-white">
                    Thousand Stars
                  </span>
                  <span className="block text-xs font-medium text-[#E5DAC2]/75">
                    Staff Console
                  </span>
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-[#0D2535] px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#E5DAC2]/70">
            Nghiệp vụ
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 gap-2">
              {staffNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        [
                          "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all",
                          isActive
                            ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10 hover:bg-white/15 hover:text-white"
                            : "text-white/75 hover:bg-white/10 hover:text-white",
                        ].join(" ")
                      }
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#E5DAC2] group-hover:bg-white/15 group-hover:text-white">
                        <item.icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block leading-tight">{item.title}</span>
                        <span className="block text-xs font-medium opacity-70">
                          {item.description}
                        </span>
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-2 pt-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Building2 className="mb-3 size-5 text-[#E5DAC2]" />
            <p className="text-xs font-medium leading-relaxed text-white/65">
              Khu vực dành cho nhân viên lễ tân xử lý phòng và booking trong ngày.
            </p>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-[#0D2535] p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-3 text-sm font-bold text-red-100 transition hover:bg-red-500/20 hover:text-white"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
            <LogOut className="size-4" />
          </span>
          <span>Đăng xuất</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
