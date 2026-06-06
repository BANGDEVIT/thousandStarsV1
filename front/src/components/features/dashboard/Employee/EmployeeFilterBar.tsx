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

// const ROLE_OPTIONS = [
//   { value: 'staff', label: 'Nhân viên (Staff)' },
//   { value: 'manager', label: 'Quản lý (Manager)' },
//   { value: 'admin', label: 'Quản trị viên (Admin)' },
// ];

const DEFAULT_FILTERS: GetEmployeesQuery = {
  page: 1, limit: 10, search: undefined, position: undefined, gender: undefined
};

const isDirty = (f: GetEmployeesQuery) => f.search || f.position || f.gender !== undefined;

export function EmployeeFilterBar({ filters, onChange }: Props) {
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (key: keyof GetEmployeesQuery, value: unknown) => {
    onChange({ ...filters, page: 1, [key]: value !== '__all__' && value !== '' ? value : undefined });
  };

  const handleName = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => set('search', value), 400);
  };
  const handlePosition = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => set('position', value), 400);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* Tìm kiếm */}
      <div className="relative w-[260px] shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Tìm tên, email, SĐT..."
          defaultValue={filters.search ?? ''}
          onChange={(e) => handleName(e.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      {/* Lọc Vai trò */}
      {/* <Select value={filters.role ?? '__all__'} onValueChange={(v) => set('role', v)}>
        <SelectTrigger className="h-9 w-[180px] text-sm shrink-0">
          <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tất cả vai trò</SelectItem>
          {ROLE_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select> */}
      <div className="relative w-[260px] shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Tìm vị trí..."
          defaultValue={filters.position ?? ''}
          onChange={(e) => handlePosition(e.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      {/* Lọc Trạng thái Account */}
      {/* <Select 
        value={filters.is_active === undefined ? '__all__' : filters.is_active.toString()} 
        onValueChange={(v) => set('is_active', v === '__all__' ? undefined : v === 'true')}
      >
        <SelectTrigger className="h-9 w-[160px] text-sm shrink-0">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tất cả trạng thái</SelectItem>
          <SelectItem value="true">Đang hoạt động</SelectItem>
          <SelectItem value="false">Đã bị khóa</SelectItem>
        </SelectContent>
      </Select> */}

        <Select 
        value={filters.gender??'all'} 
        onValueChange={(v) => set('gender', v === 'all' ? undefined : v )}
      >
        <SelectTrigger className="h-9 w-[160px] text-sm shrink-0">
          <SelectValue placeholder="Giới tính" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Giới tính</SelectItem>
          <SelectItem value="male">Nam</SelectItem>
          <SelectItem value="female">Nữ</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      {isDirty(filters) && (
        <Button variant="ghost" size="sm" onClick={() => onChange({ ...DEFAULT_FILTERS })} className="h-9 px-3 text-slate-500 shrink-0">
          <X className="h-4 w-4 mr-1" /> Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}