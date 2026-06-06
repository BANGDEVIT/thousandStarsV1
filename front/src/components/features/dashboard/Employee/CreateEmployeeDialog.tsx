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
import { toast } from 'sonner';
import { Plus, Loader2, ShieldCheck, UserCircle } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'staff', label: 'Nhân viên (Staff)' },
  { value: 'manager', label: 'Quản lý (Manager)' },

];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

export function CreateEmployeeDialog() {
  const [open, setOpen] = useState(false);

  // States cho Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState<number | ''>('');
  const [hiredDate, setHiredDate] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState<'staff' | 'manager' | ''>('');

  const { createEmployee, loading } = useEmployeeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation cơ bản
    if (!email.trim() || !password.trim() || !role) {
      return toast.error('Vui lòng điền đầy đủ thông tin tài khoản hệ thống');
    }
    if (!firstName.trim() || !lastName.trim() || !position.trim() || !salary || !hiredDate || !gender) {
      return toast.error('Vui lòng điền đầy đủ thông tin hồ sơ nhân viên');
    }

    const result = await createEmployee({
      email: email.trim(),
      password: password.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      position: position.trim(),
      salary: Number(salary),
      hired_date: hiredDate,
      gender,
      role: role as 'staff' | 'manager' 
    });

    if (result) {
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setPosition('');
    setSalary('');
    setHiredDate('');
    setGender('');
    setRole('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#335F76] hover:bg-[#254658]">
          <Plus className="mr-2 h-4 w-4" /> Thêm nhân viên
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2 text-[#335F76]">
            Thêm nhân viên & Cấp tài khoản
          </DialogTitle>
          <DialogDescription>
            Tạo hồ sơ nhân sự mới đồng thời khởi tạo thông tin đăng nhập hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="overflow-y-auto px-6 py-4 space-y-6">

            {/* PHẦN 1: TÀI KHOẢN (Auth) */}
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" /> Tài khoản đăng nhập
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-email">Email hệ thống *</Label>
                  <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@hotel.com" disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">Mật khẩu tạm thời *</Label>
                  <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Vai trò phân quyền *</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as 'staff' | 'manager' )}
                  disabled={loading}
                >
                  <SelectTrigger><SelectValue placeholder="Chọn vai trò" /></SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* PHẦN 2: HỒ SƠ (Profile) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <UserCircle className="h-4 w-4" /> Thông tin cá nhân
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Họ (Last Name) *</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nguyễn Văn" disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tên (First Name) *</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Hào" disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Số điện thoại</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090..." disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <Label>Giới tính *</Label>
                  <Select value={gender} onValueChange={setGender} disabled={loading}>
                    <SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Vị trí công việc *</Label>
                  <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="VD: Lễ tân" disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <Label>Mức lương (VND) *</Label>
                  <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value === '' ? '' : Number(e.target.value))} min={0} disabled={loading} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Ngày vào làm *</Label>
                <Input type="date" value={hiredDate} onChange={(e) => setHiredDate(e.target.value)} disabled={loading} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Hủy</Button>
            <Button type="submit" disabled={loading} className="bg-[#335F76] hover:bg-[#2a4e63]">
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...</>
              ) : 'Xác nhận tạo nhân viên'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}