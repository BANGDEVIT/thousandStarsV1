"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

export function RevenueAreaChart({ bookingsData }: { bookingsData: any }) {
  const chartData = useMemo(() => {
    const bookings = bookingsData.data || []
    
    // Gom nhóm doanh thu theo ngày check-in
    const grouped = bookings.reduce((acc: any, curr: any) => {
      const date = curr.check_in_date
      const amount = curr.invoice?.total_amount || 0
      if (!acc[date]) acc[date] = 0
      acc[date] += amount
      return acc
    }, {})

    // Chuyển object thành mảng cho Recharts và sắp xếp theo ngày
    return Object.keys(grouped)
      .map(date => ({ date, revenue: grouped[date] }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [bookingsData])

  const chartConfig = {
    revenue: { label: "Doanh thu (VNĐ)", color: "var(--primary)" }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu</CardTitle>
        <CardDescription>Biến động doanh thu theo ngày check-in</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                tickFormatter={(val) => new Date(val).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fillOpacity={1}
                fill="url(#fillRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}