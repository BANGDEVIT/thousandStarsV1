import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { GetEmployeesQuery } from '@/types/employee.type';
import { Search, X } from 'lucide-react';

interface Props {
  filters: GetEmployeesQuery;
  onChange: (filters: GetEmployeesQuery) => void;
}

const DEFAULT_FILTERS: GetEmployeesQuery = {
  page: 1,
  limit: 10,
  search: undefined,
  position: undefined,
  gender: undefined,
};

const isDirty = (filters: GetEmployeesQuery) =>
  filters.search || filters.position || filters.gender !== undefined;

export function EmployeeFilterBar({ filters, onChange }: Props) {
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const positionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (key: keyof GetEmployeesQuery, value: unknown) => {
    onChange({
      ...filters,
      page: 1,
      [key]: value !== '__all__' && value !== '' ? value : undefined,
    });
  };

  const handleSearch = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => set('search', value.trim()), 400);
  };

  const handlePosition = (value: string) => {
    if (positionTimerRef.current) clearTimeout(positionTimerRef.current);
    positionTimerRef.current = setTimeout(() => set('position', value.trim()), 400);
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <div className="relative w-full shrink-0 sm:w-[260px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Tìm tên, email, SĐT..."
          defaultValue={filters.search ?? ''}
          onChange={(event) => handleSearch(event.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      <div className="relative w-full shrink-0 sm:w-[260px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Tìm vị trí..."
          defaultValue={filters.position ?? ''}
          onChange={(event) => handlePosition(event.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      <Select
        value={filters.gender ?? 'all'}
        onValueChange={(value) => set('gender', value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="h-9 w-full shrink-0 text-sm sm:w-[160px]">
          <SelectValue placeholder="Giới tính" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Giới tính</SelectItem>
          <SelectItem value="male">Nam</SelectItem>
          <SelectItem value="female">Nữ</SelectItem>
        </SelectContent>
      </Select>

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
