import { useEffect, useState } from 'react';
import { useRoomTypeStore } from '@/stores/roomType.store';
import { GenericTable } from '@/components/features/dashboard/GenericTable';
import { CreateRoomTypeDialog } from '@/components/features/dashboard/RoomType/CreateRoomTypeDialog';
import { Badge } from '@/components/ui/badge';
import { Wifi, Tv, Wind, Droplets, Coffee, Dumbbell, Car, Utensils, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { RoomType, GetRoomsTypeQuery } from '@/types/roomtype.type';
import { DeleteRoomTypeButton } from '@/components/features/dashboard/RoomType/DeleteRoomTypeButton';
import { EditRoomTypeDialog } from '@/components/features/dashboard/RoomType/EditRoomTypeDialog';
import { RoomTypeFilterBar } from '@/components/features/dashboard/RoomType/RoomTypeFilterBar';

const AMENITY_MAP: Record<string, { icon: React.ReactNode; label: string }> = {
  wifi: { icon: <Wifi className="h-3.5 w-3.5" />, label: 'WiFi' },
  tv: { icon: <Tv className="h-3.5 w-3.5" />, label: 'TV' },
  air_conditioning: { icon: <Wind className="h-3.5 w-3.5" />, label: 'Điều hòa' },
  bathtub: { icon: <Droplets className="h-3.5 w-3.5" />, label: 'Bồn tắm' },
  minibar: { icon: <Coffee className="h-3.5 w-3.5" />, label: 'Minibar' },
  gym: { icon: <Dumbbell className="h-3.5 w-3.5" />, label: 'Gym' },
  parking: { icon: <Car className="h-3.5 w-3.5" />, label: 'Đỗ xe' },
  breakfast: { icon: <Utensils className="h-3.5 w-3.5" />, label: 'Ăn sáng' },
};

const BED_TYPE_LABELS: Record<string, string> = {
  single: 'Đơn',
  double: 'Đôi',
  twin: 'Twin',
  king: 'King',
  queen: 'Queen',
};

const INLINE_LIMIT = 2;

function AmenitiesCell({ amenities }: { amenities: string[] }) {
  if (!amenities?.length) return <span className="text-xs text-slate-400">—</span>;

  const inline = amenities.slice(0, INLINE_LIMIT);
  const overflow = amenities.length - INLINE_LIMIT;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {inline.map((amenity) => {
        const meta = AMENITY_MAP[amenity];

        return (
          <Badge
            key={amenity}
            variant="outline"
            className="flex items-center gap-1 border-slate-200 px-2 py-0.5 text-[11px] font-normal text-slate-500"
          >
            <span className="text-[#335F76]">{meta?.icon}</span>
            {meta?.label ?? amenity}
          </Badge>
        );
      })}

      {overflow > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#335F76] hover:underline"
            >
              <Plus className="h-3 w-3" />
              {overflow} khác
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">Tất cả tiện nghi</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 pt-2">
              {amenities.map((amenity) => {
                const meta = AMENITY_MAP[amenity];

                return (
                  <Badge
                    key={amenity}
                    variant="outline"
                    className="flex items-center gap-1.5 border-slate-200 px-2.5 py-1 text-xs font-normal text-slate-600"
                  >
                    <span className="text-[#335F76]">{meta?.icon}</span>
                    {meta?.label ?? amenity}
                  </Badge>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function RoomTypeListPage() {
  const { roomTypes, loading, totalPage, fetchRoomTypes } = useRoomTypeStore();
  const [filters, setFilters] = useState<GetRoomsTypeQuery>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchRoomTypes(filters);
  }, [fetchRoomTypes, filters]);

  const columns = [
    {
      key: 'name',
      header: 'Tên loại phòng',
      render: (row: RoomType) => (
        <span className="font-medium text-slate-800">{row.name}</span>
      ),
    },
    {
      key: 'base_price',
      header: 'Giá / đêm',
      render: (row: RoomType) => (
        <span className="font-medium text-[#335F76]">
          {row.base_price.toLocaleString('vi-VN')}
          <span className="ml-1 text-xs font-normal text-slate-400">đ</span>
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'Sức chứa',
      render: (row: RoomType) => (
        <span className="text-slate-600">{row.capacity} người</span>
      ),
    },
    {
      key: 'bed_type',
      header: 'Loại giường',
      render: (row: RoomType) => (
        <span className="text-slate-600">
          {BED_TYPE_LABELS[row.bed_type] ?? row.bed_type}
        </span>
      ),
    },
    {
      key: 'amenities',
      header: 'Tiện nghi',
      render: (row: RoomType) => <AmenitiesCell amenities={row.amenities} />,
    },
    {
      key: 'actions',
      header: '',
      render: (row: RoomType) => (
        <div className="flex items-center justify-end gap-2">
          <EditRoomTypeDialog roomType={row} />
          <DeleteRoomTypeButton roomType={row} />
        </div>
      ),
    },
  ];

  const toolbar = (
    <div className="flex w-full flex-col items-start justify-between gap-3 xl:flex-row xl:items-center">
      <RoomTypeFilterBar filters={filters} onChange={setFilters} />
      <div className="shrink-0">
        <CreateRoomTypeDialog />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <GenericTable
        columns={columns}
        data={roomTypes}
        loading={loading}
        page={filters.page || 1}
        totalPages={totalPage || 1}
        onPageChange={(newPage) => setFilters((current) => ({ ...current, page: newPage }))}
        keyExtractor={(row) => row.id}
        toolbar={toolbar}
      />
    </div>
  );
}
