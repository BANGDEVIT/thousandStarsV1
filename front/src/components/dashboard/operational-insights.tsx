"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowDownRightIcon, ArrowUpRightIcon, GlobeIcon, StoreIcon } from "lucide-react"
import type { PaginatedResponse, Booking } from "@/types/dashboard"

interface OperationalInsightsProps {
  bookingsData: PaginatedResponse<Booking>
}

export function OperationalInsights({ bookingsData }: OperationalInsightsProps) {
  // 1. Lấy ngày thực tế của hệ thống và định dạng theo chuẩn vi-VN (DD/MM/YYYY)
  const actualDateLabel = useMemo(() => {
    return new Date().toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }, [])

  const insights = useMemo(() => {
    const bookings = bookingsData.data || []
    
    // Lưu ý: Biến 'today' này dùng để lọc dữ liệu từ file JSON mockup của bạn.
    // Khi lên môi trường chạy thật (Production), bạn hãy đổi dòng dưới thành:
    // const today = new Date().toISOString().split("T")[0]
    const today = "2026-05-29"

    let arrivals = 0
    let departures = 0
    let pendingCount = 0
    let onlineCount = 0
    let offlineCount = 0

    bookings.forEach(b => {
      // Đếm luồng khách trong ngày
      if (b.check_in_date === today) arrivals++
      if (b.check_out_date === today) departures++
      
      // Đếm ngoại lệ cần xử lý
      if (b.status === "pending") pendingCount++

      // Đếm kênh đặt phòng
      if (b.booking_type === "online") onlineCount++
      if (b.booking_type === "offline") offlineCount++
    })

    const totalChannels = onlineCount + offlineCount
    const onlinePercentage = totalChannels > 0 ? (onlineCount / totalChannels) * 100 : 0

    return { arrivals, departures, pendingCount, onlineCount, offlineCount, onlinePercentage }
  }, [bookingsData])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Tiêu điểm vận hành</CardTitle>
        {/* ĐÃ THAY THẾ: Hiển thị ngày thực tế động từ hệ thống tại đây */}
        <CardDescription>Ngày {actualDateLabel}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6">
        
        {/* 1. Lưu lượng khách trong ngày */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ArrowDownRightIcon className="size-4 text-emerald-500" />
              Khách đến (Check-in)
            </div>
            <div className="text-3xl font-bold">{insights.arrivals}</div>
            <div className="text-xs text-muted-foreground">Lịch dự kiến hôm nay</div>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ArrowUpRightIcon className="size-4 text-orange-500" />
              Khách đi (Check-out)
            </div>
            <div className="text-3xl font-bold">{insights.departures}</div>
            <div className="text-xs text-muted-foreground">Lịch dự kiến hôm nay</div>
          </div>
        </div>

        {/* 2. Hiệu suất kênh phân phối */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Nguồn đặt phòng</span>
            <span className="text-muted-foreground">Trên tổng hệ thống</span>
          </div>
          <Progress value={insights.onlinePercentage} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <GlobeIcon className="size-3 text-primary" />
              <span>Online ({insights.onlineCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StoreIcon className="size-3" />
              <span>Trực tiếp ({insights.offlineCount})</span>
            </div>
          </div>
        </div>        
      </CardContent>
    </Card>
  )
}