import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRoomTypeStore } from '@/stores/roomType.store';
import type { RoomType } from '@/types/roomtype.type';
import { Trash2, TriangleAlert, Loader2 } from 'lucide-react';

interface Props { roomType: RoomType }

export function DeleteRoomTypeButton({ roomType }: Props) {
  const [open, setOpen] = useState(false);
  const { deactiveRoomType, loading } = useRoomTypeStore();

  const handleConfirm = async () => {
    const ok = await deactiveRoomType(roomType.id);
    if (ok) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="Xóa loại phòng"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Xóa loại phòng {roomType.name}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <TriangleAlert className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-800">
                Xóa loại phòng "{roomType.name}"?
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1 leading-relaxed">
                Hành động này sẽ khiến loại phòng bị vô hiệu hóa và ẩn khỏi danh sách cho phép đặt phòng.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Info card (Đã đổi sang hiển thị thông tin của Room Type) */}
        <div className="mx-6 mb-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Tên loại</span>
            <span className="font-medium text-slate-700">{roomType.name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Giá cơ bản</span>
            <span className="font-medium text-slate-700">
              {roomType.base_price.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Sức chứa</span>
            <span className="font-medium text-slate-700">{roomType.capacity} người</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="h-8 px-4 text-sm"
          >
            Huỷ
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
            className="h-8 px-4 text-sm bg-red-500 hover:bg-red-600 text-white"
          >
            {loading
              ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Đang xử lý...</>
              : <><Trash2 className="h-3.5 w-3.5 mr-1.5" />Xác nhận xóa</>
            }
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}