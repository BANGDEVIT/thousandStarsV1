import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEmployeeStore } from '@/stores/employee.store';
import type { Employee } from '@/types/employee.type';
import { toast } from 'sonner';
import { Pencil, Loader2, UserCircle, Settings2 } from 'lucide-react';

interface Props {
  employee: Employee;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

export function EditEmployeeDialog({ employee }: Props) {
  const [open, setOpen] = useState(false);
  
  // States cho Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState<number | ''>('');
  const [hiredDate, setHiredDate] = useState('');
  const [gender, setGender] = useState('');
  const [isActive, setIsActive] = useState<boolean>(true);

  const { updateEmployee, loading } = useEmployeeStore();

  // Hàm helper để tách full_name thành first_name và last_name nếu backend không trả về lẻ
  // Tuy nhiên ở đây ta giả định backend trả về thông tin account có email
  const handleOpenChange = (isOpen: boolean) => {
  if (isOpen && employee) {
    // Đổ dữ liệu vào form NGAY KHI dialog bắt đầu mở
    setFirstName(employee.first_name || '');
    setLastName(employee.last_name || '');
    setEmail(employee.email || '');
    setPhone(employee.phone || '');
    setPosition(employee.position || '');
    setSalary(employee.salary || '');
    setIsActive(employee.account?.is_active ?? true);
    setGender(employee.gender || '');

    // Định dạng ngày
    if (employee.hired_date) {
      setHiredDate(employee.hired_date.split('T')[0]);
    } else {
      setHiredDate('');
    }
  }
  
  // Cập nhật state mở/đóng cuối cùng
  setOpen(isOpen);
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !position.trim() || !salary) {
      return toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
    }

    const result = await updateEmployee(employee.id, {
      email: email.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      position: position.trim(),
      salary: Number(salary),
      hired_date: hiredDate,
      gender,
      is_active: isActive,
    });

    if (result) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-[#335F76] hover:bg-[#335F76]/10 rounded-md transition-colors"
          title="Chỉnh sửa nhân viên"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2 text-[#335F76]">
             Chỉnh sửa hồ sơ nhân viên
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân và trạng thái tài khoản của {employee.full_name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="overflow-y-auto px-6 py-4 space-y-6">
            
            {/* PHẦN 1: TRẠNG THÁI & EMAIL */}
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Settings2 className="h-4 w-4" /> Quản lý tài khoản
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Email liên hệ</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <Label>Trạng thái tài khoản</Label>
                  <Select 
                    value={isActive.toString()} 
                    onValueChange={(v) => setIsActive(v === 'true')} 
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Đang hoạt động</SelectItem>
                      <SelectItem value="false">Khóa tài khoản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* PHẦN 2: THÔNG TIN CHI TIẾT */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <UserCircle className="h-4 w-4" /> Hồ sơ nhân viên
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Họ *</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tên *</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Số điện thoại</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <Label>Giới tính *</Label>
                  <Select value={gender} onValueChange={setGender} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Vị trí công việc *</Label>
                  <Input value={position} onChange={(e) => setPosition(e.target.value)} disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <Label>Mức lương (VND) *</Label>
                  <Input 
                    type="number" 
                    value={salary} 
                    onChange={(e) => setSalary(e.target.value === '' ? '' : Number(e.target.value))} 
                    disabled={loading} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Ngày vào làm</Label>
                <Input type="date" value={hiredDate} onChange={(e) => setHiredDate(e.target.value)} disabled={loading} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Hủy</Button>
            <Button type="submit" disabled={loading} className="bg-[#335F76] hover:bg-[#2a4e63]">
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</>
              ) : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}