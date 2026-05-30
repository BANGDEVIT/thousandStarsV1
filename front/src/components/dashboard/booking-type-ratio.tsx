"use client"

import { useMemo } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { PaginatedResponse, Booking } from "@/types/dashboard"

interface BookingTypeRatioProps {
  bookingsData: PaginatedResponse<Booking>
}

// Bảng màu sang trọng cho các loại phòng
const TYPE_COLORS: Record<string, string> = {
  "VIP": "#8b5cf6",      // Tím
  "Suite": "#3b82f6",    // Xanh dương
  "Deluxe": "#06b6d4",   // Xanh lơ
  "Standard": "#94a3b8"  // Xám xanh
}

export function BookingTypeRatio({ bookingsData }: BookingTypeRatioProps) {
  const chartData = useMemo(() => {
    const bookings = bookingsData.data || []
    const typeCounts: Record<string, number> = {}

    bookings.forEach((booking) => {
      booking.rooms.forEach((room) => {
        const typeName = room.room_type_name
        typeCounts[typeName] = (typeCounts[typeName] || 0) + 1
      })
    })

    return Object.keys(typeCounts).map((key) => ({
      name: key,
      value: typeCounts[key],
      fill: TYPE_COLORS[key] || "#cbd5e1"
    }))
  }, [bookingsData])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Tỉ lệ loại phòng được đặt</CardTitle>
        <CardDescription>Dựa trên dữ liệu lịch sử đặt phòng</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={{}} className="mx-auto aspect-square max-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60} // Đồng bộ innerRadius với biểu đồ Trạng thái
                outerRadius={80}
                paddingAngle={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}