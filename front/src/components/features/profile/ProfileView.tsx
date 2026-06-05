import { useMemo, useState } from "react";
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
    <div className="grid gap-2 border-b border-slate-100 py-4 text-sm last:border-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
      <span className="font-medium text-slate-400">{label}</span>
      {isEditing ? (
        <input
          value={form[field]}
          onChange={(e) => onChange(field, e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-700 outline-none transition focus:border-[#335F76]"
        />
      ) : (
        <span className="font-semibold text-slate-700">
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
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-['Lora'] text-xl font-bold text-[#335F76]">
            Thông tin cá nhân
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Quản lý thông tin hồ sơ của bạn
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-[#335F76] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#294d61]"
            >
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#335F76] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#294d61] disabled:opacity-60"
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-2">
        <Row label="Họ" field="first_name" value={form.first_name} isEditing={isEditing} form={form} onChange={handleChange} />
        <Row label="Tên" field="last_name" value={form.last_name} isEditing={isEditing} form={form} onChange={handleChange} />
        <Row label="Số điện thoại" field="phone" value={form.phone} isEditing={isEditing} form={form} onChange={handleChange} />
        <Row label="Quốc tịch" field="nationality" value={form.nationality} isEditing={isEditing} form={form} onChange={handleChange} />
        <div className="grid gap-2 py-4 text-sm sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
          <span className="font-medium text-slate-400">Email</span>
          <span className="break-all font-semibold text-slate-700">
            {profile.account?.email ?? profile.email}
          </span>
        </div>
      </div>
    </form>
  );
}
