import { Outlet } from "react-router";
import { StaffSidebar } from "@/components/features/staff/StaffSidebar";
import { StaffHeader } from "@/components/features/staff/StaffHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function StaffPage() {
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <StaffSidebar variant="inset" />
        <SidebarInset>
          <StaffHeader />
          <main className="flex flex-1 flex-col bg-[#F5F0E8]">
            <div className="@container/main flex flex-1 flex-col">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
