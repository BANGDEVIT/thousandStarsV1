"use client"

import { useDashboardContext } from "@/types/dashboard"; // Import custom hook
import { RevenueAreaChart } from "@/components/dashboard/revenue-area-chart";
import { RoomStatusDonut } from "@/components/dashboard/room-status-donut";
import { BookingTypeRatio } from "@/components/dashboard/booking-type-ratio"
import { OperationalInsights } from "./operational-insights";


export default function ChartInfo() {
  const { roomsData, bookingsData } = useDashboardContext();

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8">
      {/* ... SectionCards ... */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RevenueAreaChart bookingsData={bookingsData} />
        </div>
        <div className="md:col-span-1">
          {/* Module cũ: Trạng thái phòng hiện tại */}
          <RoomStatusDonut roomsData={roomsData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {/* MODULE MỚI: Tỉ lệ đặt theo loại phòng */}
          <BookingTypeRatio bookingsData={bookingsData} />
        </div>
        <div className="lg:col-span-2">
          <OperationalInsights bookingsData={bookingsData} />
        </div>
      </div>
    </div>
  )
}