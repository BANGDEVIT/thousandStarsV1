import { useState, useMemo } from "react";
import type { User } from "@/types/user";

interface FormState {
  first_name: string;
  last_name: string;
  phone: string;
  nationality: string;
}

// Khai báo Row NGOÀI component
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
    <div className="flex justify-between items-center py-3.5 border-b border-gray-100 text-sm last:border-0">
      <span className="text-gray-400 shrink-0 mr-4">{label}</span>
      {isEditing ? (
        <input
          value={form[field]}
          onChange={(e) => onChange(field, e.target.value)}
          className="text-right border-b border-[#101953] outline-none bg-transparent text-gray-700 font-medium w-full max-w-[60%]"
        />
      ) : (
        <span className="text-gray-700 font-medium text-right">
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-#335F76 rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center w-full">

        {/* Avatar */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 w-full">
          <div className="w-28 h-28 rounded-full bg-[#3B82F6] flex items-center justify-center mb-4 shadow-inner">
            <span className="text-white text-3xl font-semibold">
              {profile.first_name?.charAt(0) ?? profile.last_name?.charAt(0) ?? "?"}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {profile.first_name} {profile.last_name}
          </h3>
          <p className="text-xs text-gray-400">{profile.nationality ?? "Chưa cập nhật"}</p>
        </div>

        {/* Fields */}
        <div className="w-full pt-2">
          <Row label="Họ" field="first_name" value={form.first_name} isEditing={isEditing} form={form} onChange={handleChange} />
          <Row label="Tên" field="last_name" value={form.last_name} isEditing={isEditing} form={form} onChange={handleChange} />
          <Row label="Số điện thoại" field="phone" value={form.phone} isEditing={isEditing} form={form} onChange={handleChange} />
          <Row label="Quốc tịch" field="nationality" value={form.nationality} isEditing={isEditing} form={form} onChange={handleChange} />
          <div className="flex justify-between items-center py-3.5 text-sm">
            <span className="text-gray-400 shrink-0 mr-4">Email</span>
            <span className="text-gray-700 font-medium text-right">
              {profile.account?.email ?? profile.email}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`w-full py-2 bg-[#101953] text-white rounded-lg text-sm ${isEditing ? "hidden" : ""}`}
          >
            Chỉnh sửa thông tin
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 bg-[#101953] text-white rounded-lg text-sm ${!isEditing ? "hidden" : ""}`}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={`flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 ${!isEditing ? "hidden" : ""}`}
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  );
}