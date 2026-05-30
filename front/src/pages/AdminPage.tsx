import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Outlet } from "react-router"
import type { DashboardContextType } from "@/types/dashboard";
import roomsJSON from "../components/dashboard/rooms.json";
import bookingsJSON from "../components/dashboard/bookings.json";

export default function Page() {
    const contextValue: DashboardContextType = {
      roomsData: roomsJSON as DashboardContextType["roomsData"],
      bookingsData: bookingsJSON as DashboardContextType["bookingsData"],
    };
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
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* main content here */}
                <Outlet context={contextValue} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
