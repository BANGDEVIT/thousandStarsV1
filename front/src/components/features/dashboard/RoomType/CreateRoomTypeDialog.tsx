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
import { useRoomTypeStore } from '@/stores/roomType.store';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

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

export function CreateRoomTypeDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [capacity, setCapacity] = useState<number>(2);
  const [bedType, setBedType] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  const { createRoomType, loading } = useRoomTypeStore();

  const handleToggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Vui lòng nhập tên loại phòng');
    }
    if (!basePrice || basePrice <= 0) {
      return toast.error('Vui lòng nhập giá cơ bản hợp lệ');
    }
    if (capacity < 1) {
      return toast.error('Sức chứa phải lớn hơn 0');
    }
    if (!bedType) {
      return toast.error('Vui lòng chọn loại giường');
    }

    try {
      await createRoomType({
        name: name.trim(),
        base_price: Number(basePrice),
        capacity,
        bed_type: bedType,
        amenities,
      });
      // Store đã tự bật toast.success rồi nên không cần gọi ở đây
      setOpen(false);
      resetForm();
    } catch {
      // Lỗi được store xử lý
    }
  };

  const resetForm = () => {
    setName('');
    setBasePrice('');
    setCapacity(2);
    setBedType('');
    setAmenities([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Thêm loại phòng
        </Button>
      </DialogTrigger>
      
      {/* Nới rộng Dialog ra một chút vì form này nhiều trường hơn */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo loại phòng mới</DialogTitle>
          <DialogDescription>
            Thiết lập thông tin, giá và các tiện nghi cho loại phòng mới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên loại phòng */}
          <div>
            <Label htmlFor="name">Tên loại phòng *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Deluxe City View"
              disabled={loading}
            />
          </div>

          {/* Grid chia 2 cột cho Giá và Sức chứa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="basePrice">Giá cơ bản (VNĐ) *</Label>
              <Input
                id="basePrice"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="VD: 1500000"
                min={0}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="capacity">Sức chứa (Người) *</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                min={1}
                disabled={loading}
              />
            </div>
          </div>

          {/* Loại giường */}
          <div>
            <Label htmlFor="bedType">Loại giường *</Label>
            <Select value={bedType} onValueChange={setBedType} disabled={loading}>
              <SelectTrigger>
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

          {/* Tiện nghi (Amenities) */}
          <div>
            <Label className="mb-2 block">Tiện nghi có sẵn</Label>
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

          {/* Nút hành động */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#335F76] hover:bg-[#254658]">
              {loading ? 'Đang xử lý...' : 'Tạo loại phòng'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}