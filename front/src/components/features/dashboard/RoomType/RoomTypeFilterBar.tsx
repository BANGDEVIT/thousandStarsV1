import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { GetRoomsTypeQuery } from '@/types/roomtype.type';
import { Search, X } from 'lucide-react';

interface Props {
  filters: GetRoomsTypeQuery;
  onChange: (filters: GetRoomsTypeQuery) => void;
}

const BED_OPTIONS = [
  { value: 'single', label: 'Giường Đơn' },
  { value: 'double', label: 'Giường Đôi' },
  { value: 'twin',   label: 'Giường Twin' },
  { value: 'king',   label: 'Giường King' },
  { value: 'queen',  label: 'Giường Queen' },
];

const SORT_OPTIONS = [
  { value: 'name',       label: 'Tên loại phòng' },
  { value: 'base_price', label: 'Giá cơ bản' },
  { value: 'capacity',   label: 'Sức chứa' },
  { value: 'created_at', label: 'Ngày tạo' },
];

const DEFAULT_FILTERS: GetRoomsTypeQuery = {
  page: 1,
  bed_type: undefined,
  capacity: undefined,
  sortBy:   undefined,
  order:    'asc',
  search:   undefined, // Trong Type của bạn nếu dùng 'name' để search thì sửa lại nhé
};

// Kiểm tra filter có khác default không để hiện nút Reset
const isDirty = (f: GetRoomsTypeQuery) =>
  f.bed_type || f.capacity || f.sortBy || f.search;

export function RoomTypeFilterBar({ filters, onChange }: Props) {
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper: update 1 field, reset page về 1
  const set = (key: keyof GetRoomsTypeQuery, value: unknown) => {
    onChange({
      ...filters,
      page: 1,
      [key]: value || undefined,
    });
  };

  // Search debounce 400ms
  const handleSearch = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      set('search', value); // Nếu backend yêu cầu key là 'name', hãy đổi 'search' thành 'name'
    }, 400);
  };

  const handleReset = () => onChange({ ...DEFAULT_FILTERS });

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">

      {/* Search theo tên */}
      <div className="relative w-[240px] shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Tìm tên loại phòng..."
          defaultValue={filters.search ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      {/* Loại giường */}
      <Select
        value={filters.bed_type ?? '__all__'}
        onValueChange={(v) => set('bed_type', v === '__all__' ? '' : v)}
      >
        <SelectTrigger className="h-9 w-[180px] text-sm shrink-0">
          <SelectValue placeholder="Loại giường" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tất cả loại giường</SelectItem>
          {BED_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sức chứa */}
      <Input
        type="number"
        placeholder="Sức chứa (người)"
        min={1}
        value={filters.capacity ?? ''}
        onChange={(e) => set('capacity', e.target.value ? Number(e.target.value) : '')}
        className="h-9 w-[130px] text-sm shrink-0"
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
            <SelectItem value="asc">Tăng dần</SelectItem>
            <SelectItem value="desc">Giảm dần</SelectItem>
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