import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRoomTypeStore } from '@/stores/roomType.store';
import type { GetRoomsQuery } from '@/types/room.type';
import { Search, X } from 'lucide-react';

interface Props {
  filters: GetRoomsQuery;
  onChange: (filters: GetRoomsQuery) => void;
}

const STATUS_OPTIONS = [
  { value: 'available', label: 'Trống' },
  { value: 'occupied', label: 'Đã đặt' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'cleaning', label: 'Đang dọn' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];

const SORT_OPTIONS = [
  { value: 'room_number', label: 'Số phòng' },
  { value: 'floor', label: 'Tầng' },
  { value: 'status', label: 'Trạng thái' },
  { value: 'created_at', label: 'Ngày tạo' },
];

const DEFAULT_FILTERS: GetRoomsQuery = {
  page: 1,
  status: undefined,
  room_type_id: undefined,
  floor: undefined,
  sortBy: undefined,
  order: 'asc',
  search: undefined,
};

const isDirty = (filters: GetRoomsQuery) =>
  filters.status || filters.room_type_id || filters.floor || filters.sortBy || filters.search;

export function RoomFilterBar({ filters, onChange }: Props) {
  const { roomTypes, fetchRoomTypes } = useRoomTypeStore();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const set = (key: keyof GetRoomsQuery, value: unknown) => {
    onChange({
      ...filters,
      page: 1,
      [key]: value || undefined,
    });
  };

  const handleSearch = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      set('search', value.trim());
    }, 400);
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <div className="relative w-full shrink-0 sm:w-[200px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Tìm số phòng..."
          defaultValue={filters.search ?? ''}
          onChange={(event) => handleSearch(event.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      <Select
        value={filters.status ?? '__all__'}
        onValueChange={(value) => set('status', value === '__all__' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-full shrink-0 text-sm sm:w-[320px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tất cả trạng thái (trừ ngừng hoạt động)</SelectItem>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.room_type_id ?? '__all__'}
        onValueChange={(value) => set('room_type_id', value === '__all__' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-full shrink-0 text-sm sm:w-[180px]">
          <SelectValue placeholder="Loại phòng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tất cả loại phòng</SelectItem>
          {roomTypes.map((roomType) => (
            <SelectItem key={roomType.id} value={roomType.id}>
              {roomType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="Tầng"
        min={1}
        value={filters.floor ?? ''}
        onChange={(event) => set('floor', event.target.value ? Number(event.target.value) : '')}
        className="h-9 w-full shrink-0 text-sm sm:w-[80px]"
      />

      <Select
        value={filters.sortBy ?? '__none__'}
        onValueChange={(value) => set('sortBy', value === '__none__' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-full shrink-0 text-sm sm:w-[150px]">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">Mặc định</SelectItem>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filters.sortBy && (
        <Select value={filters.order ?? 'asc'} onValueChange={(value) => set('order', value)}>
          <SelectTrigger className="h-9 w-full shrink-0 text-sm sm:w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A → Z</SelectItem>
            <SelectItem value="desc">Z → A</SelectItem>
          </SelectContent>
        </Select>
      )}

      {isDirty(filters) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ ...DEFAULT_FILTERS })}
          className="h-9 shrink-0 px-3 text-slate-500 hover:text-slate-800"
        >
          <X className="mr-1 h-4 w-4" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
