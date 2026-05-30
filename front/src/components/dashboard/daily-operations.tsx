"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PaginatedResponse, Booking } from "@/types/dashboard"

interface DailyOperationsProps {
  bookingsData: PaginatedResponse<Booking>;
}

export function DailyOperations({ bookingsData }: DailyOperationsProps) {
  const bookings = bookingsData.data || []

  // Logic: Lọc các booking đang "pending" hoặc "confirmed" (cần xử lý)
  // và sắp xếp theo ngày check-in để đưa các lịch gần nhất lên đầu
  const recentBookings = [...bookings]
    .filter(b => b.status === "pending" || b.status === "confirmed")
    .sort((a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime())
    .slice(0, 5)

  // Helper function: Đổi màu Badge theo trạng thái
  const getStatusBadgeVariant = (status: Booking["status"]) => {
    switch (status) {
      case "completed": return "default"
      case "confirmed": return "secondary"
      case "pending": return "outline"
      case "cancelled": return "destructive"
      default: return "outline"
    }
  }

  // Helper function: Việt hóa label trạng thái
  const translateStatus = (status: Booking["status"]) => {
    switch (status) {
      case "completed": return "Hoàn thành"
      case "confirmed": return "Đã xác nhận"
      case "pending": return "Chờ xử lý"
      case "cancelled": return "Đã hủy"
      default: return status
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hoạt động check-in/out</CardTitle>
        <CardDescription>Các giao dịch sắp tới cần được xử lý</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking: Booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{booking.customer?.full_name || "Khách vãng lai"}</span>
                        <span className="text-xs text-muted-foreground">{booking.customer?.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Xử lý hiển thị nếu 1 booking đặt nhiều phòng cùng lúc */}
                      {booking.rooms?.length > 0 
                        ? booking.rooms.map(r => r.room_number).join(", ") 
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.check_in_date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {translateStatus(booking.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Không có hoạt động nào cần xử lý.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}