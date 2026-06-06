import { useEffect, useState } from 'react';
import { useEmployeeStore } from '@/stores/employee.store';
import { GenericTable } from '@/components/features/dashboard/GenericTable';
import { CreateEmployeeDialog } from '@/components/features/dashboard/Employee/CreateEmployeeDialog';
import { DeleteEmployeeButton } from '@/components/features/dashboard/Employee/DeleteEmployeeButton';
import { EmployeeFilterBar } from '@/components/features/dashboard/Employee/EmployeeFilterBar';
import { Badge } from '@/components/ui/badge';
import type { Employee, GetEmployeesQuery } from '@/types/employee.type';
import { UserCircle2 } from 'lucide-react';
import { EditEmployeeDialog } from '@/components/features/dashboard/Employee/EditEmployeeDialog';

const GENDER_LABELS: Record<string, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
};

export function EmployeeListPage() {
  const { employees, loading, totalPages, page, fetchEmployees } = useEmployeeStore();
  const [filters, setFilters] = useState<GetEmployeesQuery>({ page: 1, limit: 10 });

  useEffect(() => {
    fetchEmployees(filters);
  }, [fetchEmployees, filters]);

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (row: Employee) => (
        <span className="text-sm font-medium text-[#335F76]">{row.id}</span>
      ),
    },
    {
      key: 'full_name',
      header: 'Nhân viên',
      render: (row: Employee) => (
        <div className="flex items-center gap-3">
          {row.avatar_url ? (
            <img
              src={row.avatar_url}
              alt={row.full_name}
              className="h-9 w-9 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <UserCircle2 className="h-9 w-9 text-slate-300" />
          )}
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{row.full_name}</span>
            <span className="text-xs text-slate-500">
              {GENDER_LABELS[row.gender] ?? 'Khác'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Liên hệ',
      render: (row: Employee) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#335F76]">{row.email}</span>
          <span className="mt-0.5 text-xs text-slate-500">
            {row.phone || 'Chưa cập nhật SĐT'}
          </span>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Vị trí & Lương',
      render: (row: Employee) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">{row.position}</span>
          <span className="mt-0.5 text-xs text-slate-500">
            {row.salary.toLocaleString('vi-VN')} đ/tháng
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row: Employee) => (
        row.account?.is_active ? (
          <Badge className="border-emerald-200 bg-emerald-50 font-normal text-emerald-600 hover:bg-emerald-50">
            Đang hoạt động
          </Badge>
        ) : (
          <Badge variant="outline" className="border-slate-200 bg-slate-50 font-normal text-slate-500">
            Đã bị khóa
          </Badge>
        )
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row: Employee) => (
        <div className="flex items-center justify-end gap-1">
          <EditEmployeeDialog employee={row} />
          <DeleteEmployeeButton employee={row} />
        </div>
      ),
    },
  ];

  const toolbar = (
    <div className="flex w-full flex-col items-start justify-between gap-3 xl:flex-row xl:items-center">
      <EmployeeFilterBar filters={filters} onChange={setFilters} />
      <div className="shrink-0">
        <CreateEmployeeDialog />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <GenericTable
        columns={columns}
        data={employees}
        loading={loading}
        page={page || 1}
        totalPages={totalPages || 1}
        onPageChange={(newPage) => setFilters((current) => ({ ...current, page: newPage }))}
        keyExtractor={(row) => row.id}
        toolbar={toolbar}
      />
    </div>
  );
}
