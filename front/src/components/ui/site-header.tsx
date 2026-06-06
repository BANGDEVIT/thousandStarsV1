import { useLocation } from "react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titleByPath: Array<{ pattern: string; title: string; subtitle: string }> = [
  {
    pattern: "/admin/dashboard",
    title: "Dashboard",
    subtitle: "Theo dõi nhanh tình hình phòng, loại phòng và nhân sự.",
  },
  {
    pattern: "/admin/room-types",
    title: "Quản lý loại phòng",
    subtitle: "Thiết lập giá, sức chứa, loại giường và tiện nghi.",
  },
  {
    pattern: "/admin/employees",
    title: "Quản lý nhân viên",
    subtitle: "Theo dõi hồ sơ, liên hệ, vị trí và trạng thái tài khoản.",
  },
  {
    pattern: "/admin/revenue",
    title: "Báo cáo doanh thu",
    subtitle: "Theo dõi doanh thu, thanh toán và công nợ từ các booking.",
  },
  {
    pattern: "/admin/rooms",
    title: "Quản lý phòng",
    subtitle: "Quản lý số phòng, tầng, loại phòng và trạng thái vận hành.",
  },
];

export function SiteHeader() {
  const { pathname } = useLocation();
  const currentPage =
    titleByPath.find((item) => pathname.startsWith(item.pattern)) ?? {
      title: "Quản trị hệ thống",
      subtitle: "Bảng điều khiển nội bộ của Thousand Stars.",
    };

  return (
    <header className="sticky top-0 z-20 flex min-h-(--header-height) shrink-0 items-center border-b border-white/10 bg-[#335F76] text-white shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-3 px-4 py-3 lg:px-6">
        <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 hover:text-white" />
        <Separator
          orientation="vertical"
          className="mx-1 bg-white/20 data-[orientation=vertical]:h-8"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E5DAC2]">
            Thousand Stars Admin
          </p>
          <h1 className="font-['Lora'] text-xl font-bold tracking-wide text-white lg:text-2xl">
            {currentPage.title}
          </h1>
          <p className="mt-0.5 hidden text-sm font-medium text-white/70 md:block">
            {currentPage.subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
