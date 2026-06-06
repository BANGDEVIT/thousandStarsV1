import { useEffect, useState } from "react";
import type { ElementType } from "react";
import {
  BedDouble,
  Building2,
  CircleCheck,
  Hotel,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import { useRoomTypeStore } from "@/stores/roomType.store";
import { useEmployeeStore } from "@/stores/employee.store";
import { getRooms } from "@/services/room.service";
import type { Room } from "@/types/room.type";

const statusLabels: Record<Room["status"], string> = {
  available: "Trống",
  occupied: "Đã đặt",
  maintenance: "Bảo trì",
  cleaning: "Đang dọn",
  inactive: "Ngừng hoạt động",
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: ElementType;
}) {
  return (
    <article className="rounded-2xl border border-[#335F76]/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B8852D]">
            {title}
          </p>
          <p className="mt-3 text-3xl font-bold text-[#0D2535]">{value}</p>
          <p className="mt-2 text-sm text-[#335F76]/70">{description}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#335F76]/10 text-[#335F76]">
          <Icon className="size-5" />
        </span>
      </div>
    </article>
  );
}

export function DashboardOverviewPage() {
  const { roomTypes, fetchRoomTypes } = useRoomTypeStore();
  const { employees, total: employeeTotal, fetchEmployees } = useEmployeeStore();
  const [dashboardRooms, setDashboardRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchRoomTypes({ page: 1, limit: 100 });
    fetchEmployees({ page: 1, limit: 100 });

    const fetchAllRoomStatuses = async () => {
      const statuses = Object.keys(statusLabels) as Room["status"][];
      const responses = await Promise.all(
        statuses.map((status) => getRooms({ page: 1, limit: 100, status })),
      );
      const mergedRooms = responses.flatMap((response) => response.data);
      const uniqueRooms = Array.from(
        new Map(mergedRooms.map((room) => [room.id, room])).values(),
      );

      setDashboardRooms(uniqueRooms);
    };

    fetchAllRoomStatuses();
  }, [fetchRoomTypes, fetchEmployees]);

  const roomTotal = dashboardRooms.length;
  const activeEmployees = employees.length
    ? employees.filter((employee) => employee.account?.is_active).length
    : employeeTotal;
  const availableRooms = dashboardRooms.filter((room) => room.status === "available").length;
  const maintenanceRooms = dashboardRooms.filter((room) => room.status === "maintenance").length;

  const roomStatusStats = Object.entries(statusLabels).map(([status, label]) => ({
    status,
    label,
    count: dashboardRooms.filter((room) => room.status === status).length,
  }));

  return (
    <div className="flex flex-col gap-6 p-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tổng phòng"
          value={roomTotal}
          description="Tất cả phòng trong hệ thống."
          icon={Building2}
        />
        <StatCard
          title="Phòng trống"
          value={availableRooms}
          description="Phòng đang sẵn sàng vận hành."
          icon={CircleCheck}
        />
        <StatCard
          title="Loại phòng"
          value={roomTypes.length}
          description="Các hạng phòng đang cấu hình."
          icon={Hotel}
        />
        <StatCard
          title="Nhân viên"
          value={activeEmployees}
          description="Tài khoản nhân sự đang hoạt động."
          icon={UsersRound}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-[#335F76]/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-['Lora'] text-xl font-bold text-[#0D2535]">
                Trạng thái phòng
              </h2>
              <p className="mt-1 text-sm text-[#335F76]/70">
                Tổng hợp nhanh theo dữ liệu phòng hiện tại.
              </p>
            </div>
            <BedDouble className="size-6 text-[#B8852D]" />
          </div>

          <div className="space-y-3">
            {roomStatusStats.map((item) => {
              const percent = roomTotal ? Math.round((item.count / roomTotal) * 100) : 0;

              return (
                <div key={item.status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#0D2535]">{item.label}</span>
                    <span className="text-[#335F76]/70">
                      {item.count} phòng
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F5F0E8]">
                    <div
                      className="h-full rounded-full bg-[#B8852D]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-amber-200 bg-[#FFF8E9] p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ShieldAlert className="size-5" />
            </span>
            <div>
              <h2 className="font-['Lora'] text-xl font-bold text-[#0D2535]">
                Cần chú ý
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#335F76]/80">
                Hiện có <strong>{maintenanceRooms}</strong> phòng đang bảo trì.
                Hãy kiểm tra trạng thái phòng trước khi mở bán hoặc xác nhận đặt phòng.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
