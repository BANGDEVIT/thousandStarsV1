"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSignIcon, PercentIcon, BedIcon, CreditCardIcon } from "lucide-react"

import type { PaginatedResponse, Room, Booking } from "@/types/dashboard";

interface SectionCardsProps {
  roomsData: PaginatedResponse<Room>;
  bookingsData: PaginatedResponse<Booking>;
}

export function SectionCards({ roomsData, bookingsData }: SectionCardsProps) {
  const rooms = roomsData.data; // TypeScript hiểu ngay đây là mảng Room[]
  const bookings = bookingsData.data; // TypeScript hiểu ngay đây là mảng Booking[]

  const totalRevenue = bookings.reduce((sum, b) => sum + b.invoice.total_amount, 0);
  const occupiedCount = rooms.filter((r) => r.status === "occupied").length;
  const occupancyRate = rooms.length > 0 ? (occupiedCount / rooms.length) * 100 : 0;
  const adr = bookings.length > 0 ? totalRevenue / bookings.length : 0;

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <DollarSignIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">Dựa trên tổng hóa đơn</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
          <PercentIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">{occupiedCount} phòng đang có khách</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ADR (Giá trung bình)</CardTitle>
          <BedIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(adr)}</div>
          <p className="text-xs text-muted-foreground mt-1">Doanh thu trên mỗi đêm</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lượt đặt phòng</CardTitle>
          <CreditCardIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingsData.total || bookings.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Tổng số booking hệ thống</p>
        </CardContent>
      </Card>
    </div>
  )
} 