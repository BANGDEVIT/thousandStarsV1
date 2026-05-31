import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Home, ChevronRight, Upload, X, CheckCircle } from "lucide-react";

// mode="create" | "edit"  –  truyền qua props hoặc detect từ route
interface Props {
  mode?: "create" | "edit";
}

const BED_OPTIONS = ["Giường đôi", "Giường đơn", "Giường King", "Giường Queen"];

interface BedRow {
  type: string;
  count: number;
  enabled: boolean;
}

const defaultBeds: BedRow[] = BED_OPTIONS.map((t, i) => ({
  type: t,
  count: 1,
  enabled: i === 0,
}));

export default function RoomFormPage({ mode = "create" }: Props) {
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  // ---------- form state ----------
  const [name, setName] = useState(isEdit ? "Phòng Superior Hướng Vườn" : "");
  const [description, setDescription] = useState(
    isEdit
      ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem cupiditate delectus, quis minima inventore nostrum rem at ducimus, quisquam veniam exercitationem deleniti laboriosam quas fugit omnis, molestiae necessitatibus nemo. Ab."
      : ""
  );
  const [roomStatus, setRoomStatus] = useState<"active" | "inactive">(
    isEdit ? "inactive" : "active"
  );
  const [quantity, setQuantity] = useState(isEdit ? 1 : 1);
  const [basePrice, setBasePrice] = useState(isEdit ? "100.000.VND / Đêm" : "");
  const [surgeRate, setSurgeRate] = useState(isEdit ? "15%" : "");
  const [roomSize, setRoomSize] = useState(isEdit ? "50 m²" : "");
  const [beds, setBeds] = useState<BedRow[]>(defaultBeds);
  const [photos, setPhotos] = useState<string[]>([]);
  const [coverIdx, setCoverIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // ---------- helpers ----------
  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () =>
        setPhotos((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  };

  const saveSection = (label: string) => {
    setSaved(label);
    setTimeout(() => setSaved(null), 1800);
  };

  const toggleBed = (idx: number) =>
    setBeds((b) => b.map((row, i) => (i === idx ? { ...row, enabled: !row.enabled } : row)));

  const setBedCount = (idx: number, val: number) =>
    setBeds((b) => b.map((row, i) => (i === idx ? { ...row, count: val } : row)));

  // ---------- render ----------
  return (
    <div className="space-y-4 max-w-3xl">
      {/* Breadcrumb header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <nav className="flex items-center gap-1 text-xs text-slate-400 mb-2">
          <Home size={13} />
          <span>Bảng điều khiển</span>
          <ChevronRight size={12} />
          <span
            className="cursor-pointer hover:text-slate-600"
            onClick={() => navigate("/admin/rooms")}
          >
            Quản lý phòng
          </span>
          <ChevronRight size={12} />
          <span className="text-slate-600">
            {isEdit ? "Chỉnh phòng" : "Tạo phòng"}
          </span>
        </nav>
        <h2 className="text-3xl font-bold text-[#1a2744]">
          {isEdit ? "Chỉnh phòng" : "Tạo phòng"}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          {isEdit
            ? "Điều chỉnh thông tin loại phòng cho khách sạn"
            : "Tạo loại phòng cho khách sạn"}
        </p>
      </div>

      {/* 1. Thông tin cơ bản */}
      <Section
        title="Thông tin cơ bản"
        onSave={() => saveSection("basic")}
        saved={saved === "basic"}
      >
        <Field label="Tên loại phòng">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="Phòng Superior Hướng Vườn"
          />
        </Field>

        <Field label="Mô tả phòng">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={inputCls + " resize-none"}
            placeholder="Nhập mô tả..."
          />
        </Field>

        <Field label="Loại phòng">
          <div className="flex gap-4">
            {(["active", "inactive"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
                <div
                  onClick={() => setRoomStatus(v)}
                  className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    roomStatus === v
                      ? v === "active"
                        ? "border-slate-400 bg-slate-400"
                        : "border-blue-400 bg-blue-400"
                      : "border-slate-300"
                  }`}
                />
                <span className="text-slate-600">
                  {v === "active" ? "Hoạt động" : "Vô hiệu"}
                </span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Số lượng">
          <div className="relative">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={inputCls + " pr-52"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
              Số lượng phòng của loại phòng này
            </span>
          </div>
        </Field>
      </Section>

      {/* 2. Giá cả */}
      <Section
        title="Giá cả"
        onSave={() => saveSection("price")}
        saved={saved === "price"}
      >
        <Field label="Giá cơ bản">
          <input
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className={inputCls}
            placeholder="100.000.VND / Đêm"
          />
        </Field>
        <Field label="Tỉ lệ tăng vào ngày lễ / cuối tuần / giờ cao điểm">
          <input
            value={surgeRate}
            onChange={(e) => setSurgeRate(e.target.value)}
            className={inputCls}
            placeholder="15%"
          />
        </Field>
      </Section>

      {/* 3. Tuỳ chỉnh thông tin */}
      <Section
        title="Tuỳ chỉnh thông tin"
        onSave={() => saveSection("custom")}
        saved={saved === "custom"}
      >
        <Field label="Kích thước phòng">
          <input
            value={roomSize}
            onChange={(e) => setRoomSize(e.target.value)}
            className={inputCls}
            placeholder="50 m²"
          />
        </Field>

        <Field label="Loại giường">
          <div className="space-y-2">
            {beds.map((bed, idx) => (
              <div key={bed.type} className="flex items-center gap-3">
                <div
                  onClick={() => toggleBed(idx)}
                  className={`w-4 h-4 rounded border-2 transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                    bed.enabled ? "bg-blue-500 border-blue-500" : "border-slate-300"
                  }`}
                >
                  {bed.enabled && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-600 w-28">{bed.type}</span>
                {bed.enabled && (
                  <input
                    type="number"
                    min={1}
                    value={bed.count}
                    onChange={(e) => setBedCount(idx, Number(e.target.value))}
                    className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30"
                  />
                )}
              </div>
            ))}
          </div>
        </Field>
      </Section>

      {/* 4. Hình ảnh */}
      <Section
        title="Hình ảnh"
        onSave={() => saveSection("images")}
        saved={saved === "images"}
      >
        <Field label="Chọn hình ảnh cho phòng">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center gap-3 hover:border-[#4a90d9] hover:bg-blue-50/20 transition-all cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={32} className="text-slate-400" />
            <p className="text-sm font-medium text-slate-600">
              Drag and drop to upload Photo
            </p>
            <p className="text-xs text-slate-400">or</p>
            <button
              type="button"
              className="bg-blue-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
            >
              Upload Photo
            </button>
            <p className="text-xs text-slate-400 mt-1 text-center">
              ⓘ Up to 5 MB per image in JPG, PNG, WEBP
              <br />
              (Recommended: at least 4 images: bedroom, bathroom, view, and living area)
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </Field>

        {/* Thumbnail grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-2">
            {photos.map((src, i) => (
              <div
                key={i}
                className={`relative group rounded-xl overflow-hidden aspect-video cursor-pointer border-2 transition-colors ${
                  coverIdx === i ? "border-[#4a90d9]" : "border-transparent"
                }`}
                onClick={() => setCoverIdx(i)}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotos(photos.filter((_, idx) => idx !== i));
                    if (coverIdx === i) setCoverIdx(null);
                  }}
                >
                  <X size={12} className="text-white" />
                </button>
                {coverIdx === i && (
                  <span className="absolute bottom-1 left-1 text-[10px] bg-[#4a90d9] text-white px-1.5 py-0.5 rounded">
                    Ảnh đại diện
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <Field label="Chọn hình ảnh đại diện cho phòng">
          <div className="flex gap-3 flex-wrap">
            {/* placeholder thumbnails */}
            {[
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=100&fit=crop",
              "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=160&h=100&fit=crop",
              "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=160&h=100&fit=crop",
            ].map((src, i) => (
              <div
                key={i}
                className={`w-36 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
                  coverIdx === 100 + i ? "border-[#4a90d9]" : "border-slate-200"
                }`}
                onClick={() => setCoverIdx(100 + i)}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </Field>
      </Section>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 pb-6">
        <button
          onClick={() => navigate("/admin/rooms")}
          className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-colors"
        >
          Huỷ
        </button>
        <button
          onClick={() => saveSection("all")}
          className="px-6 py-2.5 bg-[#4ade80] text-white rounded-xl text-sm font-semibold hover:bg-green-400 transition-colors flex items-center gap-2"
        >
          {saved === "all" ? <CheckCircle size={15} /> : null}
          Lưu thông tin
        </button>
      </div>
    </div>
  );
}

// ---- helpers ----
const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9] focus:bg-white transition-all";

function Section({
  title,
  children,
  onSave,
  saved,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saved: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#1a2744]">{title}</h3>
        <button
          onClick={onSave}
          className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all ${
            saved
              ? "bg-green-100 text-green-600"
              : "bg-[#4ade80] text-white hover:bg-green-400"
          }`}
        >
          {saved ? "✓ Đã lưu" : "Lưu"}
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
