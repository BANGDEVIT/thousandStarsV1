// src/components/dashboard/RoomListPage.tsx (hoặc src/pages/admin/RoomsPage.tsx)
import { useEffect } from 'react';
import { useRoomStore } from '@/stores/room.store';
import { GenericTable } from '@/components/features/dashboard/GenericTable';
import { CreateRoomDialog } from '@/components/features/dashboard/CreateRoomDialog';
import { Badge } from '@/components/ui/badge';

export function RoomListPage() {
  const { rooms, loading, fetchRooms, totalPages, page } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, []);

  const columns = [
    { key: 'room_number', header: 'Số phòng' },
    { key: 'floor', header: 'Tầng' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row: any) => {
        const statusMap: Record<string, string> = {
          available: 'Trống',
          occupied: 'Đã đặt',
          maintenance: 'Bảo trì',
          cleaning: 'Đang dọn',
          inactive: 'Ngừng hoạt động',
        };
        return <Badge>{statusMap[row.status] || row.status}</Badge>;
      },
    },
    {
      key: 'room_type',
      header: 'Loại phòng',
      render: (row: any) => row.room_type?.name,
    },
  ];

  const toolbar = <CreateRoomDialog />;

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
        toolbar={toolbar}
      />
    </div>
  );
}