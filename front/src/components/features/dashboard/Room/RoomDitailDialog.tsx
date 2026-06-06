import { useState } from 'react';
import {
  Dialog, DialogContent, DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Room } from '@/types/room.type';
import {
  Eye, BedDouble, Users, Wifi, Tv, Wind, Droplets,
  Coffee, Dumbbell, Car, Utensils, ChevronLeft, ChevronRight,
  Building2, Hash, CalendarDays, ImageOff,
} from 'lucide-react';

interface Props { room: Room }

const STATUS_CONFIG: Record<Room['status'], { label: string; cls: string }> = {
  available:   { label: 'Trống',           cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  occupied:    { label: 'Đã đặt',          cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  maintenance: { label: 'Bảo trì',         cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  cleaning:    { label: 'Đang dọn',        cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  inactive:    { label: 'Ngừng hoạt động', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi:        <Wifi className="h-3.5 w-3.5" />,
  tv:          <Tv className="h-3.5 w-3.5" />,
  air_conditioning: <Wind className="h-3.5 w-3.5" />,
  bathtub:     <Droplets className="h-3.5 w-3.5" />,
  minibar:     <Coffee className="h-3.5 w-3.5" />,
  gym:         <Dumbbell className="h-3.5 w-3.5" />,
  parking:     <Car className="h-3.5 w-3.5" />,
  breakfast:   <Utensils className="h-3.5 w-3.5" />,
};

const AMENITY_LABELS: Record<string, string> = {
  wifi:             'WiFi',
  tv:               'TV',
  air_conditioning: 'Điều hoà',
  bathtub:          'Bồn tắm',
  minibar:          'Minibar',
  gym:              'Gym',
  parking:          'Đỗ xe',
  breakfast:        'Ăn sáng',
};

const BED_TYPE_LABELS: Record<string, string> = {
  single:  'Giường đơn',
  double:  'Giường đôi',
  twin:    'Giường twin',
  king:    'Giường king',
  queen:   'Giường queen',
  suite:   'Suite',
};

function ImageGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-slate-100 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400">
        <ImageOff className="h-10 w-10 opacity-40" />
        <span className="text-sm">Chưa có hình ảnh</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden group">
        <img
          src={images[current]}
          alt={`Ảnh ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>

        {/* Nav arrows — chỉ show khi có nhiều hơn 1 ảnh */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {images.map((url, idx) => (
            <button
              key={url}
              onClick={() => setCurrent(idx)}
              className={`shrink-0 w-14 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                idx === current ? 'border-[#335F76]' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function RoomDetailDialog({ room }: Props) {
  const [open, setOpen] = useState(false);
  const status = STATUS_CONFIG[room.status];
  const rt = room.room_type;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-[#335F76] hover:bg-[#335F76]/8 rounded-md transition-colors"
          title="Xem chi tiết phòng"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="sr-only">Xem chi tiết phòng {room.room_number}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col">

        {/* Header — ảnh + overlay info */}
        <div className="relative shrink-0">
          <ImageGallery images={room.images ?? []} />

          {/* Overlay header trên ảnh đầu — chỉ khi có ảnh */}
          {(room.images?.length ?? 0) > 0 && (
            <div className="absolute top-0 inset-x-0 px-4 pt-4 flex items-start justify-between pointer-events-none">
              <div className="bg-black/50 backdrop-blur-sm text-white rounded-lg px-3 py-1.5">
                <p className="text-xs opacity-70 leading-none mb-0.5">Phòng</p>
                <p className="text-lg font-semibold leading-none">#{room.room_number}</p>
              </div>
              <Badge variant="outline" className={`${status.cls} backdrop-blur-sm pointer-events-auto`}>
                {status.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Header text khi không có ảnh */}
          {(room.images?.length ?? 0) === 0 && (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Phòng #{room.room_number}</h2>
              <Badge variant="outline" className={`text-xs font-normal ${status.cls}`}>
                {status.label}
              </Badge>
            </div>
          )}

          {/* Thông tin cơ bản */}
          <section>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Thông tin phòng
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Hash className="h-3.5 w-3.5" />
                  <span className="text-xs">Số phòng</span>
                </div>
                <span className="text-base font-semibold text-slate-800">{room.room_number}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="text-xs">Tầng</span>
                </div>
                <span className="text-base font-semibold text-slate-800">{room.floor}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-xs">Sức chứa</span>
                </div>
                <span className="text-base font-semibold text-slate-800">{rt?.capacity ?? '—'} người</span>
              </div>
            </div>
          </section>

          {/* Loại phòng */}
          <section>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Loại phòng
            </h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              {/* Tên + giá */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <span className="font-medium text-slate-800">{rt?.name ?? '—'}</span>
                <span className="text-[#335F76] font-semibold">
                  {rt?.base_price?.toLocaleString('vi-VN')}
                  <span className="text-xs font-normal text-slate-400 ml-1">đ / đêm</span>
                </span>
              </div>
              {/* Giường */}
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 border-b border-slate-100">
                <BedDouble className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{BED_TYPE_LABELS[rt?.bed_type ?? ''] ?? rt?.bed_type ?? '—'}</span>
              </div>
              {/* Tiện nghi */}
              {rt?.amenities && rt.amenities.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {rt.amenities.map((a) => (
                      <div
                        key={a}
                        className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600"
                      >
                        <span className="text-[#335F76]">
                          {AMENITY_ICONS[a] ?? <Coffee className="h-3.5 w-3.5" />}
                        </span>
                        {AMENITY_LABELS[a] ?? a}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Metadata */}
          <section>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Thông tin hệ thống
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Ngày tạo</span>
                </div>
                <span className="text-slate-600">{formatDate(room.created_at)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Cập nhật lần cuối</span>
                </div>
                <span className="text-slate-600">{formatDate(room.updated_at)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash className="h-3.5 w-3.5" />
                  <span>ID</span>
                </div>
                <span className="text-slate-400 font-mono text-xs">{room.id}</span>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-end">
          <Button
            variant="outline" size="sm"
            onClick={() => setOpen(false)}
            className="h-8 px-4 text-sm"
          >
            Đóng
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}