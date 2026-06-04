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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRoomStore } from '@/stores/room.store';
import { useRoomTypeStore } from '@/stores/roomType.store';
import type { Room } from '@/types/room.type';
import { Pencil } from 'lucide-react';

interface Props {
  room: Room;
}

const STATUS_OPTIONS: { value: Room['status']; label: string }[] = [
  { value: 'available',   label: 'Trống' },
  { value: 'occupied',    label: 'Đã đặt' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'cleaning',    label: 'Đang dọn' },
  { value: 'inactive',    label: 'Ngừng hoạt động' },
];

const STATUS_COLORS: Record<Room['status'], string> = {
  available:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  occupied:    'bg-blue-50 text-blue-700 border-blue-200',
  maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
  cleaning:    'bg-purple-50 text-purple-700 border-purple-200',
  inactive:    'bg-slate-100 text-slate-500 border-slate-200',
};

export function EditRoomDialog({ room }: Props) {
  const [open, setOpen] = useState(false);

  // Form state
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor]           = useState<number>(1);
  const [roomTypeId, setRoomTypeId] = useState('');
  const [status, setStatus]         = useState<Room['status']>('available');

  const { updateRoom, loading }                          = useRoomStore();
  const { roomTypes, fetchRoomTypes, loading: typesLoading } = useRoomTypeStore();

const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Reset form dựa trên room hiện tại
      setRoomNumber(room.room_number);
      setFloor(room.floor);
      setRoomTypeId(room.room_type?.id ?? '');
      setStatus(room.status);
      fetchRoomTypes(); // tải danh sách loại phòng mới
    }
    setOpen(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim() || !roomTypeId) return;
    const result = await updateRoom(room.id, {
      room_number: roomNumber.trim(),
      room_type_id: roomTypeId,
      floor,
      status,
    });
    if (result) setOpen(false);
  };

  const currentStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === room.status)?.label ?? room.status;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-[#335F76] hover:bg-[#335F76]/8 rounded-md transition-colors"
          title="Chỉnh sửa phòng"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Chỉnh sửa phòng {room.room_number}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-semibold text-slate-800">
                Chỉnh sửa phòng
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-0.5">
                Điều chỉnh thông tin phòng #{room.room_number}
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className={`text-xs font-normal ${STATUS_COLORS[room.status]}`}
            >
              {currentStatusLabel}
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5">

            {/* Thông tin cơ bản */}
            <section>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-roomNumber" className="text-sm text-slate-600">
                    Số phòng <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="edit-roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="VD: A101"
                    disabled={loading}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-floor" className="text-sm text-slate-600">
                    Tầng <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="edit-floor"
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    min={1}
                    disabled={loading}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Loại phòng */}
            <section>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                Phân loại
              </h3>
              <div className="space-y-1.5">
                <Label htmlFor="edit-roomType" className="text-sm text-slate-600">
                  Loại phòng <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={roomTypeId}
                  onValueChange={setRoomTypeId}
                  disabled={loading || typesLoading}
                >
                  <SelectTrigger id="edit-roomType" className="h-9 text-sm">
                    <SelectValue
                      placeholder={typesLoading ? 'Đang tải...' : 'Chọn loại phòng'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {!typesLoading && Array.isArray(roomTypes) && roomTypes.length === 0 && (
                      <SelectItem disabled value="none">
                        Không có loại phòng nào
                      </SelectItem>
                    )}
                    {Array.isArray(roomTypes) &&
                      roomTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <span className="font-medium">{type.name}</span>
                          <span className="ml-2 text-slate-400 text-xs">
                            {type.base_price.toLocaleString('vi-VN')}đ / đêm
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Trạng thái */}
            <section>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                Trạng thái vận hành
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    disabled={loading}
                    className={`
                      relative px-2 py-2 rounded-lg border text-xs font-medium
                      transition-all duration-150 cursor-pointer
                      ${
                        status === opt.value
                          ? `${STATUS_COLORS[opt.value]} border-current shadow-sm`
                          : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 bg-white'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {status === opt.value && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-8 px-4 text-sm"
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || !roomNumber.trim() || !roomTypeId}
              className="h-8 px-4 text-sm bg-[#335F76] hover:bg-[#2a4e63] text-white"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}