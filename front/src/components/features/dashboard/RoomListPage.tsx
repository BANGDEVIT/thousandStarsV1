import { useEffect, useState } from 'react';
import { useRoomStore } from '@/stores/room.store';
import { GenericTable } from '@/components/features/dashboard/GenericTable';
import { CreateRoomDialog } from '@/components/features/dashboard/Room/CreateRoomDialog';
import { EditRoomDialog } from '@/components/features/dashboard/Room/EditRoomDialog';
import { RoomDetailDialog } from '@/components/features/dashboard/Room/RoomDitailDialog';
import { DeleteRoomButton } from '@/components/features/dashboard/Room/DeleteRoomButton';
import { RoomFilterBar } from '@/components/features/dashboard/Room/RoomFilterBar';
import { Badge } from '@/components/ui/badge';
import type { Room, GetRoomsQuery } from '@/types/room.type';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  available:   { label: 'Trống',           className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  occupied:    { label: 'Đã đặt',          className: 'border-blue-200 bg-blue-50 text-blue-700' },
  maintenance: { label: 'Bảo trì',         className: 'border-amber-200 bg-amber-50 text-amber-700' },
  cleaning:    { label: 'Đang dọn',        className: 'border-purple-200 bg-purple-50 text-purple-700' },
  inactive:    { label: 'Ngừng hoạt động', className: 'border-slate-200 bg-slate-100 text-slate-500' },
};

const DEFAULT_FILTERS: GetRoomsQuery = { page: 1 };

export function RoomListPage() {
  const { rooms, loading, fetchRooms, totalPages, page } = useRoomStore();
  const [filters, setFilters] = useState<GetRoomsQuery>(DEFAULT_FILTERS);

  // Gọi API mỗi khi filters thay đổi
  useEffect(() => {
    fetchRooms(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: GetRoomsQuery) => {
    setFilters(newFilters);
  };

  const columns = [
    {
      key: 'room_number',
      header: 'Số phòng',
      render: (row: Room) => (
        <span className="font-medium text-slate-800">{row.room_number}</span>
      ),
    },
    { key: 'floor', header: 'Tầng' },
    {
      key: 'room_type',
      header: 'Loại phòng',
      render: (row: Room) => (
        <span className="text-slate-600">{row.room_type?.name ?? '—'}</span>
      ),
    },
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
      key: 'actions',
      header: '',
      render: (row: Room) => (
        <div className="flex justify-end items-center gap-0.5">
          <RoomDetailDialog room={row} />
          <EditRoomDialog room={row} />
          <DeleteRoomButton room={row} />
        </div>
      ),
    },
  ];

  const toolbar = (
    <div className="flex items-center justify-between w-full gap-3">
      <RoomFilterBar filters={filters} onChange={handleFilterChange} />
      <CreateRoomDialog />
    </div>
  );

  return (
    <div className="p-6">
      <GenericTable
        columns={columns}
        data={rooms}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setFilters((f) => ({ ...f, page: newPage }))}
        keyExtractor={(row) => row.id}
        toolbar={toolbar}
      />
    </div>
  );
}