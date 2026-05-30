"use client"

import { useMemo } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { PaginatedResponse, Room } from "@/types/dashboard"

interface RoomStatusDonutProps {
  roomsData: PaginatedResponse<Room>
}

// Định nghĩa kiểu cấu hình tường minh dựa trên union type Room["status"]
const STATUS_CONFIG: Record<Room["status"], { label: string; color: string }> = {
  available: { label: "Sẵn sàng", color: "#10b981" },   // Xanh lá
  occupied: { label: "Đang ở", color: "#3b82f6" },      // Xanh dương
  cleaning: { label: "Đang dọn", color: "#f59e0b" },    // Vàng cam
  maintenance: { label: "Bảo trì", color: "#ef4444" }   // Đỏ
}

export function RoomStatusDonut({ roomsData }: RoomStatusDonutProps) {
  const chartData = useMemo(() => {
    const rooms = roomsData.data || []
    
    // 1. Khởi tạo giá trị ban đầu với đầy đủ các key để tránh lỗi undefined khi cộng dồn
    const initialCounts: Record<Room["status"], number> = {
      available: 0,
      occupied: 0,
      cleaning: 0,
      maintenance: 0
    }

    // 2. Định nghĩa Generic Type cho reduce: <Record<Room["status"], number>>
    // Giúp hàm tự hiểu acc và room có type cụ thể là gì
    const counts = rooms.reduce<Record<Room["status"], number>>((acc, room) => {
      acc[room.status] += 1
      return acc
    }, initialCounts)

    // 3. Ép kiểu (Type Casting) cho mảng các keys để khớp với kiểu Room["status"]
    const statusKeys = Object.keys(STATUS_CONFIG) as Array<Room["status"]>

    return statusKeys.map(key => ({
      name: STATUS_CONFIG[key].label,
      value: counts[key],
      fill: STATUS_CONFIG[key].color
    }))
  }, [roomsData])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Trạng thái phòng</CardTitle>
        <CardDescription>Tình trạng cơ sở vật chất hiện tại</CardDescription>
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
                innerRadius={60}
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