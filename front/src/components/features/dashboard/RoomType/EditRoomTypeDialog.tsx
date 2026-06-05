import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useRoomTypeStore } from '@/stores/roomType.store';
import type { RoomType } from '@/types/roomtype.type';
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AMENITIES_LIST = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'tv', label: 'TV' },
  { id: 'air_conditioning', label: 'Điều hoà' },
  { id: 'bathtub', label: 'Bồn tắm' },
  { id: 'minibar', label: 'Minibar' },
  { id: 'gym', label: 'Gym' },
  { id: 'parking', label: 'Đỗ xe' },
  { id: 'breakfast', label: 'Ăn sáng' },
];

const BED_TYPES = [
  { id: 'single', label: 'Giường Đơn' },
  { id: 'double', label: 'Giường Đôi' },
  { id: 'twin', label: 'Giường Twin' },
  { id: 'king', label: 'Giường King' },
  { id: 'queen', label: 'Giường Queen' },
];

interface Props { roomType: RoomType }

export function EditRoomTypeDialog({ roomType }: Props) {
  const [open, setOpen] = useState(false);
  
  // States
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [capacity, setCapacity] = useState<number>(2);
  const [bedType, setBedType] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  const { updateRoomType, loading } = useRoomTypeStore();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setName(roomType.name);
      setBasePrice(roomType.base_price);
      setCapacity(roomType.capacity);
      setBedType(roomType.bed_type);
      setAmenities(roomType.amenities || []);
    }
    setOpen(isOpen);
  };

  const handleToggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return toast.error('Vui lòng nhập tên loại phòng');
    if (!basePrice || basePrice <= 0) return toast.error('Giá cơ bản không hợp lệ');
    if (!bedType) return toast.error('Vui lòng chọn loại giường');

    const result = await updateRoomType(roomType.id, {
      name: name.trim(),
      base_price: Number(basePrice),
      capacity,
      bed_type: bedType,
      amenities,
    });
    
    if (result) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-[#335F76] hover:bg-[#335F76]/8 rounded-md transition-colors"
          title="Chỉnh sửa loại phòng"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Chỉnh sửa {roomType.name}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <DialogTitle className="text-base font-semibold text-slate-800">
            Chỉnh sửa loại phòng
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 mt-0.5">
            Cập nhật thông tin cho {roomType.name}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSaveInfo}>
            <div className="px-6 py-5 space-y-6">

              {/* Tên loại phòng */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-sm text-slate-600">
                  Tên loại phòng <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Deluxe City View"
                  disabled={loading}
                  className="h-9 text-sm"
                />
              </div>

              {/* Giá & Sức chứa */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price" className="text-sm text-slate-600">
                    Giá cơ bản (VNĐ) <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    min={0}
                    disabled={loading}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-capacity" className="text-sm text-slate-600">
                    Sức chứa (Người) <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min={1}
                    disabled={loading}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Loại giường */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-bedType" className="text-sm text-slate-600">
                  Loại giường <span className="text-red-400">*</span>
                </Label>
                <Select value={bedType} onValueChange={setBedType} disabled={loading}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Chọn loại giường" />
                  </SelectTrigger>
                  <SelectContent>
                    {BED_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tiện nghi */}
              <div>
                <Label className="mb-2 block text-sm text-slate-600">Tiện nghi có sẵn</Label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map((amenity) => {
                    const isSelected = amenities.includes(amenity.id);
                    return (
                      <Button
                        key={amenity.id}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 rounded-full px-3 text-xs ${
                          isSelected ? 'bg-[#335F76] hover:bg-[#254658]' : 'text-slate-500'
                        }`}
                        onClick={() => handleToggleAmenity(amenity.id)}
                        disabled={loading}
                      >
                        {amenity.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

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
                disabled={loading || !name.trim()}
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