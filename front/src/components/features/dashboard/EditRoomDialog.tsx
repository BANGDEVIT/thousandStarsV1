import { useState, useRef } from 'react';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useRoomStore } from '@/stores/room.store';
import { useRoomTypeStore } from '@/stores/roomType.store';
import * as roomService from '@/services/room.service';
import type { Room } from '@/types/room.type';
import { Pencil, Upload, X, Star, Loader2, ImageOff } from 'lucide-react';
import { toast } from 'sonner';

interface Props { room: Room }

// State machine — chỉ show transition hợp lệ
const VALID_TRANSITIONS: Record<Room['status'], Room['status'][]> = {
  available:   ['cleaning', 'maintenance'],
  cleaning:    ['available'],
  maintenance: ['available'],
  occupied:    ['cleaning'],
  inactive:    [],
};

const STATUS_LABELS: Record<Room['status'], string> = {
  available:   'Trống',
  occupied:    'Đã đặt',
  maintenance: 'Bảo trì',
  cleaning:    'Đang dọn',
  inactive:    'Ngừng hoạt động',
};

const STATUS_COLORS: Record<Room['status'], string> = {
  available:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  occupied:    'bg-blue-50 text-blue-700 border-blue-200',
  maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
  cleaning:    'bg-purple-50 text-purple-700 border-purple-200',
  inactive:    'bg-slate-100 text-slate-500 border-slate-200',
};

export function EditRoomDialog({ room }: Props) {
  const [open, setOpen]           = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor]           = useState<number>(1);
  const [roomTypeId, setRoomTypeId] = useState('');

  // Image state
  const [images, setImages]         = useState<string[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  const { updateRoom, loading }                              = useRoomStore();
  const { roomTypes, fetchRoomTypes, loading: typesLoading } = useRoomTypeStore();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setRoomNumber(room.room_number);
      setFloor(room.floor);
      setRoomTypeId(room.room_type?.id ?? '');
      setImages(room.images ?? []);
      fetchRoomTypes();
    }
    setOpen(isOpen);
  };

  // Lưu thông tin cơ bản
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomNumber.trim() || !roomTypeId) return;
    const result = await updateRoom(room.id, {
      room_number: roomNumber.trim(),
      room_type_id: roomTypeId,
      floor,
    });
    console.log("update", result);
    if (result) setOpen(false);
  };

  // Đổi trạng thái — gọi PATCH /:id/status
  const handleStatusChange = async (newStatus: Room['status']) => {
    try {
      setImgLoading(true); // reuse loading indicator
      await roomService.updateRoomStatus(room.id, { status: newStatus });
      await useRoomStore.getState().fetchRooms({ page: useRoomStore.getState().page });
      toast.success(`Đổi trạng thái thành "${STATUS_LABELS[newStatus]}"`);
      setOpen(false);
    } catch {
      toast.error('Không thể đổi trạng thái');
    } finally {
      setImgLoading(false);
    }
  };

  // Upload ảnh mới
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Validate size < 5MB
    const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length) {
      toast.error('Ảnh không được vượt quá 5MB');
      return;
    }

    try {
      setImgLoading(true);
      const updated = await roomService.addRoomImages(room.id, files);
      setImages(updated.images ?? []);
      toast.success('Thêm ảnh thành công');
    } catch {
      toast.error('Thêm ảnh thất bại');
    } finally {
      setImgLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Xóa một ảnh
  const handleDeleteImage = async (url: string) => {
    try {
      setImgLoading(true);
      const updated = await roomService.deleteRoomImages(room.id, [url]);
      setImages(updated.images ?? []);
      toast.success('Đã xóa ảnh');
    } catch {
      toast.error('Xóa ảnh thất bại');
    } finally {
      setImgLoading(false);
    }
  };

  // Đặt ảnh đại diện — chuyển ảnh đó lên index 0, gọi reorder
  const handleSetThumbnail = async (url: string) => {
    if (images[0] === url) return; // đã là thumbnail rồi
    const reordered = [url, ...images.filter((img) => img !== url)];
    try {
      setImgLoading(true);
      const updated = await roomService.reorderRoomImages(room.id, reordered);
      setImages(updated.images ?? reordered);
      toast.success('Đã đặt ảnh đại diện');
    } catch {
      toast.error('Không thể đổi ảnh đại diện');
    } finally {
      setImgLoading(false);
    }
  };

  const validNextStatuses = VALID_TRANSITIONS[room.status];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-[#335F76] hover:bg-[#335F76]/8 rounded-md transition-colors"
          title="Chỉnh sửa phòng"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Chỉnh sửa phòng {room.room_number}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col">

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-semibold text-slate-800">
                Chỉnh sửa phòng
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-0.5">
                Phòng #{room.room_number}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={`text-xs font-normal ${STATUS_COLORS[room.status]}`}>
              {STATUS_LABELS[room.status]}
            </Badge>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSaveInfo}>
            <div className="px-6 py-5 space-y-6">

              {/* ── Section 1: Thông tin cơ bản ── */}
              <section>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
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
                <div className="space-y-1.5">
                  <Label htmlFor="edit-roomType" className="text-sm text-slate-600">
                    Loại phòng <span className="text-red-400">*</span>
                  </Label>
                  <Select value={roomTypeId} onValueChange={setRoomTypeId} disabled={loading || typesLoading}>
                    <SelectTrigger id="edit-roomType" className="h-9 text-sm">
                      <SelectValue placeholder={typesLoading ? 'Đang tải...' : 'Chọn loại phòng'} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(roomTypes) && roomTypes.map((type) => (
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

              {/* ── Section 2: Trạng thái ── */}
              <section>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                  Chuyển trạng thái
                </h3>
                {validNextStatuses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Trạng thái hiện tại không thể chuyển tiếp thủ công.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {validNextStatuses.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStatusChange(s)}
                        disabled={loading || imgLoading}
                        className={`
                          px-3 py-1.5 rounded-lg border text-xs font-medium
                          transition-all duration-150 cursor-pointer
                          ${STATUS_COLORS[s]}
                          hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        → {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* ── Section 3: Hình ảnh ── */}
              <section>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                  Hình ảnh
                </h3>

                {/* Upload zone */}
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#335F76]/40 hover:bg-slate-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imgLoading ? (
                    <Loader2 className="h-8 w-8 mx-auto text-slate-300 animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                  )}
                  <p className="text-sm text-slate-500 mt-1">
                    Kéo thả hoặc <span className="text-[#335F76] font-medium">chọn ảnh</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP · Tối đa 5MB / ảnh</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleUpload}
                    disabled={imgLoading}
                  />
                </div>

                {/* Grid ảnh */}
                {images.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-2">
                      Chọn hình ảnh đại diện cho phòng
                      <span className="ml-1 text-[#335F76]">(click ⭐ để đặt làm đại diện)</span>
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((url, idx) => (
                        <div key={url} className="relative group rounded-lg overflow-hidden aspect-video bg-slate-100">
                          <img
                            src={url}
                            alt={`Ảnh ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Thumbnail badge */}
                          {idx === 0 && (
                            <div className="absolute top-1 left-1 bg-amber-400 text-white rounded px-1.5 py-0.5 text-[10px] font-medium flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-white" />
                              Đại diện
                            </div>
                          )}

                          {/* Hover actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetThumbnail(url)}
                                disabled={imgLoading}
                                className="bg-amber-400 hover:bg-amber-500 text-white rounded-full p-1.5 transition-colors"
                                title="Đặt làm ảnh đại diện"
                              >
                                <Star className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(url)}
                              disabled={imgLoading}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                              title="Xóa ảnh"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <ImageOff className="h-4 w-4" />
                    Chưa có ảnh nào cho phòng này
                  </div>
                )}
              </section>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
              <Button
                type="button" variant="outline" size="sm"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="h-8 px-4 text-sm"
              >
                Huỷ
              </Button>
              <Button
                type="submit" size="sm"
                disabled={loading || !roomNumber.trim() || !roomTypeId}
                className="h-8 px-4 text-sm bg-[#335F76] hover:bg-[#2a4e63] text-white"
              >
                {loading ? (
                  <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Đang lưu...</>
                ) : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </div>

      </DialogContent>
    </Dialog>
  );
}