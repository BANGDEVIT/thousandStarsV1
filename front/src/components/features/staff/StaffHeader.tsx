import { useLocation } from "react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titleByPath: Array<{ pattern: string; title: string; subtitle: string }> = [
  {
    pattern: "/staff/check-in",
    title: "Check-in",
    subtitle: "Xác nhận khách nhận phòng theo booking đã được xác nhận.",
  },
  {
    pattern: "/staff/check-out",
    title: "Check-out",
    subtitle: "Hoàn tất trả phòng và chuyển phòng sang trạng thái dọn dẹp.",
  },
  {
    pattern: "/staff/rooms",
    title: "Danh sách phòng",
    subtitle: "Theo dõi nhanh số phòng, loại phòng, tầng và trạng thái.",
  },
  {
    pattern: "/staff/bookings",
    title: "Quản lý booking",
    subtitle: "Tra cứu, xác nhận, check-in, check-out và hủy booking.",
  },
];

export function StaffHeader() {
  const { pathname } = useLocation();
  const currentPage =
    titleByPath.find((item) => pathname.startsWith(item.pattern)) ?? {
      title: "Staff Console",
      subtitle: "Nghiệp vụ vận hành khách sạn Thousand Stars.",
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
            Thousand Stars Staff
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
