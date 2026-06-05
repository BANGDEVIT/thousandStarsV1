import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '@/stores/room.store';
import type { Room } from '@/types/room.type';
import { Trash2, TriangleAlert, Loader2 } from 'lucide-react';

interface Props { room: Room }

export function DeleteRoomButton({ room }: Props) {
  const [open, setOpen]       = useState(false);
  const { deactiveRoom, loading } = useRoomStore();

  //const isInactive = room.status === 'inactive';
  const isMaintenance= room.status === 'maintenance';
  
  const handleConfirm = async () => {
    const ok = await deactiveRoom(room.id);
    if (ok) setOpen(false);
  };

  if (!isMaintenance) {
    return (
      <div className="relative group/tooltip">
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="h-8 w-8 p-0 text-slate-200 cursor-not-allowed rounded-md"
          title=""
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
        {/* Tooltip */}
        <div className="
          absolute bottom-full right-0 mb-2 w-48 px-3 py-2
          bg-slate-800 text-white text-xs rounded-lg leading-relaxed
          opacity-0 group-hover/tooltip:opacity-100 pointer-events-none
          transition-opacity duration-150 z-50 shadow-lg
        ">
          Chuyển phòng sang trạng thái
          <span className="font-semibold text-slate-300"> "Ngừng hoạt động" </span>
          trước khi xóa
          {/* Arrow */}
          <span className="absolute top-full right-3 border-4 border-transparent border-t-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="Xóa phòng"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Hủy kích hoạt phòng {room.room_number}</span>
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
                Hủy kích hoạt phòng #{room.room_number}?
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1 leading-relaxed">
                Hành động này sẽ khiến phòng bị hủy kích hoạt vĩnh viễn.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Info card */}
        <div className="mx-6 mb-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Số phòng</span>
            <span className="font-medium text-slate-700">{room.room_number}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Tầng</span>
            <span className="font-medium text-slate-700">{room.floor}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Loại phòng</span>
            <span className="font-medium text-slate-700">{room.room_type?.name ?? '—'}</span>
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
              ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Đang hủy kích hoạt...</>
              : <><Trash2 className="h-3.5 w-3.5 mr-1.5" />Hủy kích hoạt phòng</>
            }
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}