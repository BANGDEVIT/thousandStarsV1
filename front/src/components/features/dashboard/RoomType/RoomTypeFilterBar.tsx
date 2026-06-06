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
  { value: 'twin', label: 'Giường Twin' },
  { value: 'king', label: 'Giường King' },
  { value: 'queen', label: 'Giường Queen' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Tên loại phòng' },
  { value: 'base_price', label: 'Giá cơ bản' },
  { value: 'capacity', label: 'Sức chứa' },
  { value: 'created_at', label: 'Ngày tạo' },
];

const DEFAULT_FILTERS: GetRoomsTypeQuery = {
  page: 1,
  bed_type: undefined,
  capacity: undefined,
  sortBy: undefined,
  order: 'asc',
  search: undefined,
};

const isDirty = (filters: GetRoomsTypeQuery) =>
  filters.bed_type || filters.capacity || filters.sortBy || filters.search;

export function RoomTypeFilterBar({ filters, onChange }: Props) {
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (key: keyof GetRoomsTypeQuery, value: unknown) => {
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
      <div className="relative w-full shrink-0 sm:w-[240px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Tìm tên loại phòng..."
          defaultValue={filters.search ?? ''}
          onChange={(event) => handleSearch(event.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      <Select
        value={filters.bed_type ?? '__all__'}
        onValueChange={(value) => set('bed_type', value === '__all__' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-full shrink-0 text-sm sm:w-[180px]">
          <SelectValue placeholder="Loại giường" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tất cả loại giường</SelectItem>
          {BED_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="Sức chứa (người)"
        min={1}
        value={filters.capacity ?? ''}
        onChange={(event) => set('capacity', event.target.value ? Number(event.target.value) : '')}
        className="h-9 w-full shrink-0 text-sm sm:w-[140px]"
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
          <SelectTrigger className="h-9 w-full shrink-0 text-sm sm:w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Tăng dần</SelectItem>
            <SelectItem value="desc">Giảm dần</SelectItem>
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
