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
import { useRoomTypeStore } from '@/stores/roomtype.store';
import type { GetRoomsQuery } from '@/types/room.type';
import { Search, X } from 'lucide-react';

interface Props {
  filters: GetRoomsQuery;
  onChange: (filters: GetRoomsQuery) => void;
}

const STATUS_OPTIONS = [
  { value: 'available',   label: 'Trống' },
  { value: 'occupied',    label: 'Đã đặt' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'cleaning',    label: 'Đang dọn' },
  { value: 'inactive',    label: 'Ngừng hoạt động' },
];

const SORT_OPTIONS = [
  { value: 'room_number', label: 'Số phòng' },
  { value: 'floor',       label: 'Tầng' },
  { value: 'status',      label: 'Trạng thái' },
  { value: 'created_at',  label: 'Ngày tạo' },
];

const DEFAULT_FILTERS: GetRoomsQuery = {
  page:   1,
  status:      undefined,
  room_type_id: undefined,
  floor:       undefined,
  sortBy:      undefined,
  order:       'asc',
  search:      undefined,
};

// Kiểm tra filter có khác default không để hiện nút Reset
const isDirty = (f: GetRoomsQuery) =>
  f.status || f.room_type_id || f.floor || f.sortBy || f.search;

export function RoomFilterBar({ filters, onChange }: Props) {
  const { roomTypes, fetchRoomTypes } = useRoomTypeStore();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  // Helper: update 1 field, reset page về 1
  const set = (key: keyof GetRoomsQuery, value: unknown) => {
    onChange({
      ...filters,
      page: 1,
      [key]: value || undefined, // empty string → undefined để không gửi lên API
    });
  };

  // Search debounce 400ms tránh gọi API mỗi keystroke
  const handleSearch = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      set('search', value);
    }, 400);
  };

  const handleReset = () => onChange({ ...DEFAULT_FILTERS });

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">

      {/* Search */}
      {/* SỬA Ở ĐÂY: Bỏ flex-1, set cứng w-[200px] hoặc w-48 là đủ cho số phòng */}
      <div className="relative w-[200px] shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Tìm số phòng..."
          defaultValue={filters.search ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      {/* Trạng thái */}
      <Select
        value={filters.status ?? '__all__'}
        onValueChange={(v) => set('status', v === '__all__' ? '' : v)}
      >
        {/* Tăng width lên một chút để không bị lẹm chữ "Tất cả trạng thái" */}
        <SelectTrigger className="h-9 w-[360px] text-sm shrink-0">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tất cả trạng thái (trừ ngừng hoạt động)</SelectItem>
          {STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Loại phòng */}
      <Select
        value={filters.room_type_id ?? '__all__'}
        onValueChange={(v) => set('room_type_id', v === '__all__' ? '' : v)}
      >
        <SelectTrigger className="h-9 w-[180px] text-sm shrink-0">
          <SelectValue placeholder="Loại phòng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tất cả loại phòng</SelectItem>
          {roomTypes.map((t) => (
            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tầng */}
      <Input
        type="number"
        placeholder="Tầng"
        min={1}
        value={filters.floor ?? ''}
        onChange={(e) => set('floor', e.target.value ? Number(e.target.value) : '')}
        className="h-9 w-[80px] text-sm shrink-0"
      />

      {/* Sắp xếp theo */}
      <Select
        value={filters.sortBy ?? '__none__'}
        onValueChange={(v) => set('sortBy', v === '__none__' ? '' : v)}
      >
        <SelectTrigger className="h-9 w-[150px] text-sm shrink-0">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">Mặc định</SelectItem>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Thứ tự */}
      {filters.sortBy && (
        <Select
          value={filters.order ?? 'asc'}
          onValueChange={(v) => set('order', v)}
        >
          <SelectTrigger className="h-9 w-[90px] text-sm shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A → Z</SelectItem>
            <SelectItem value="desc">Z → A</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Nút Reset */}
      {isDirty(filters) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-9 px-3 text-slate-500 hover:text-slate-800 shrink-0"
        >
          <X className="h-4 w-4 mr-1" />
          Xóa bộ lọc
        </Button>
      )}

    </div>
  );
}