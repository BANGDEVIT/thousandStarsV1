import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEmployeeStore } from '@/stores/employee.store';
import type { Employee } from '@/types/employee.type';
import { Trash2, TriangleAlert, Loader2, UserRoundX } from 'lucide-react';

interface Props { employee: Employee }

export function DeleteEmployeeButton({ employee }: Props) {
  const [open, setOpen] = useState(false);
  const { deactiveEmployee, loading } = useEmployeeStore();

  // Nếu đã bị khóa rồi thì không cho khóa nữa
  const isDeactivated = !employee.account?.is_active;

  const handleConfirm = async () => {
    const ok = await deactiveEmployee(employee.id);
    if (ok) setOpen(false);
  };

  if (isDeactivated) {
    return (
      <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0 opacity-50 cursor-not-allowed">
        <UserRoundX className="h-4 w-4 text-slate-400" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="Hủy kích hoạt tài khoản"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <TriangleAlert className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-800">
                Khóa tài khoản nhân viên?
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1 leading-relaxed">
                Tài khoản đăng nhập của <strong>{employee.full_name}</strong> sẽ bị vô hiệu hóa. Nhân viên này sẽ bị đăng xuất và không thể truy cập hệ thống nữa.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mx-6 mb-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Mã NV / Email</span>
            <span className="font-medium text-slate-700">{employee.email}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Chức vụ</span>
            <span className="font-medium text-slate-700">{employee.position}</span>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={loading} className="h-8 px-4 text-sm">
            Huỷ
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={loading} className="h-8 px-4 text-sm bg-red-500 hover:bg-red-600 text-white">
            {loading ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Đang xử lý...</> : 'Xác nhận khóa'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}