// src/components/admin/CreateRoomDialog.tsx
import { useState, useEffect } from 'react';
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
import { useRoomStore } from '@/stores/room.store';
import { useRoomTypeStore } from '@/stores/roomType.store';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export function CreateRoomDialog() {
  const [open, setOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [roomTypeId, setRoomTypeId] = useState('');

  const { createRoom, loading } = useRoomStore();
  const { roomTypes, fetchRoomTypes, loading: typesLoading } = useRoomTypeStore();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (open) {
      fetchRoomTypes();
    }
  }, [open, fetchRoomTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      toast.error('Vui lòng nhập số phòng');
      return;
    }
    if (!roomTypeId) {
      toast.error('Vui lòng chọn loại phòng');
      return;
    }
    if (floor < 1) {
      toast.error('Tầng phải lớn hơn 0');
      return;
    }
    try {
      console.log('accessToken exists?', !!accessToken);
      await createRoom({
        room_number: roomNumber.trim(),
        room_type_id: roomTypeId,
        floor,
      });
      toast.success('Thêm thành công')
      setOpen(false);
      resetForm();
    } catch {
      // Lỗi đã được xử lý trong store (toast.error)
      // Không cần làm gì thêm
    }
  };

  const resetForm = () => {
    setRoomNumber('');
    setFloor(1);
    setRoomTypeId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Thêm phòng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo phòng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin phòng. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="roomNumber">Số phòng *</Label>
            <Input
              id="roomNumber"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="VD: A101"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="floor">Tầng *</Label>
            <Input
              id="floor"
              type="number"
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              min={1}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="roomType">Loại phòng *</Label>
            <Select value={roomTypeId} onValueChange={setRoomTypeId} disabled={loading || typesLoading}>
              <SelectTrigger>
                <SelectValue placeholder={typesLoading ? 'Đang tải...' : 'Chọn loại phòng'} />
              </SelectTrigger>
              <SelectContent>
                {!typesLoading && Array.isArray(roomTypes) && roomTypes.length === 0 && (
                  <SelectItem disabled value="none">Không có loại phòng nào</SelectItem>
                )}
                {Array.isArray(roomTypes) && roomTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} - {type.base_price.toLocaleString()}đ / đêm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo phòng'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
