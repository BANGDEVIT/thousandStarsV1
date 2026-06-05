import { useEffect } from 'react';
import { useRoomStore } from '@/stores/room.store';
import { GenericTable } from '@/components/features/dashboard/GenericTable';
import { CreateRoomDialog } from '@/components/features/dashboard/CreateRoomDialog';
import { EditRoomDialog } from '@/components/features/dashboard/EditRoomDialog';
import { RoomDetailDialog } from '@/components/features/dashboard/RoomDitailDialog';
import { Badge } from '@/components/ui/badge';
import type { Room } from '@/types/room.type';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  available:   { label: 'Trống',           className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  occupied:    { label: 'Đã đặt',          className: 'border-blue-200 bg-blue-50 text-blue-700' },
  maintenance: { label: 'Bảo trì',         className: 'border-amber-200 bg-amber-50 text-amber-700' },
  cleaning:    { label: 'Đang dọn',        className: 'border-purple-200 bg-purple-50 text-purple-700' },
  inactive:    { label: 'Ngừng hoạt động', className: 'border-slate-200 bg-slate-100 text-slate-500' },
};

export function RoomListPage() {
  const { rooms, loading, fetchRooms, totalPages, page } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, []);

  const columns = [
    { key: 'room_number', header: 'Số phòng' },
    { key: 'floor',       header: 'Tầng' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row: Room) => {
        const s = STATUS_MAP[row.status] ?? { label: row.status, className: '' };
        return (
          <Badge variant="outline" className={`text-xs font-normal ${s.className}`}>
            {s.label}
          </Badge>
        );
      },
    },
    {
      key: 'room_type',
      header: 'Loại phòng',
      render: (row: Room) => (
        <span className="text-slate-600">{row.room_type?.name ?? '—'}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row: Room) => (
        <div className="flex justify-end gap-0.5">
          <RoomDetailDialog room={row} />
          <EditRoomDialog room={row} />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <GenericTable
        columns={columns}
        data={rooms}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => fetchRooms({ page: newPage })}
        keyExtractor={(row) => row.id}
        toolbar={<CreateRoomDialog />}
      />
    </div>
  );
}