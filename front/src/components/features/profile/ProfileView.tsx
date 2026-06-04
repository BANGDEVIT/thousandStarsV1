import { useState, useMemo } from "react";
import type { User } from "@/types/user.type";

interface FormState {
  first_name: string;
  last_name: string;
  phone: string;
  nationality: string;
}

function Row({
  label,
  value,
  field,
  isEditing,
  form,
  onChange,
}: {
  label: string;
  value: string;
  field: keyof FormState;
  isEditing: boolean;
  form: FormState;
  onChange: (field: keyof FormState, value: string) => void;
}) {
  return (
    <div className="flex justify-between items-center py-3.5 border-b border-slate-100 text-sm last:border-0">
      <span className="text-slate-400 shrink-0 mr-4">{label}</span>
      {isEditing ? (
        <input
          value={form[field]}
          onChange={(e) => onChange(field, e.target.value)}
          className="text-right border-b border-[#335F76] outline-none bg-transparent text-slate-700 font-medium w-full max-w-[60%]"
        />
      ) : (
        <span className="text-slate-700 font-medium text-right">
          {value || "Chưa cập nhật"}
        </span>
      )}
    </div>
  );
}

interface Props {
  profile: User;
  loading: boolean;
  onUpdate: (data: FormState) => Promise<void>;
}

function getFormFromProfile(profile: User): FormState {
  return {
    first_name: profile.first_name ?? "",
    last_name: profile.last_name ?? "",
    phone: profile.phone ?? "",
    nationality: profile.nationality ?? "",
  };
}

export function ProfileView({ profile, loading, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const profileForm = useMemo(() => getFormFromProfile(profile), [profile]);
  const [form, setForm] = useState<FormState>(profileForm);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm(profileForm);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(form);
    setIsEditing(false);
  };


  return (
    <div className="w-full flex flex-col gap-4">

      {/* Card chính */}
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[#335F76] text-xl font-bold font-['Lora']">
              Thông tin cá nhân
            </h2>
            <p className="text-slate-400 text-sm">Quản lý thông tin hồ sơ của bạn</p>
          </div>

          {/* Buttons — nằm trong form nên submit hoạt động đúng */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 bg-[#335F76] text-white rounded-lg text-sm cursor-pointer transition-opacity ${isEditing ? "hidden" : ""}`}
            >
              Chỉnh sửa
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-[#335F76] text-white rounded-lg text-sm cursor-pointer ${!isEditing ? "hidden" : ""}`}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer ${!isEditing ? "hidden" : ""}`}
            >
              Hủy
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="w-full">
          <Row label="Họ" field="first_name" value={form.first_name} isEditing={isEditing} form={form} onChange={handleChange} />
          <Row label="Tên" field="last_name" value={form.last_name} isEditing={isEditing} form={form} onChange={handleChange} />
          <Row label="Số điện thoại" field="phone" value={form.phone} isEditing={isEditing} form={form} onChange={handleChange} />
          <Row label="Quốc tịch" field="nationality" value={form.nationality} isEditing={isEditing} form={form} onChange={handleChange} />
          <div className="flex justify-between items-center py-3.5 text-sm">
            <span className="text-slate-400 shrink-0 mr-4">Email</span>
            <span className="text-slate-700 font-medium">{profile.account?.email ?? profile.email}</span>
          </div>
        </div>

      </form>
    </div>
  );
}