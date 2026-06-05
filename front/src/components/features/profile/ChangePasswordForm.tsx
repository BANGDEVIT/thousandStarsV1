import { useState } from "react";
import { useProfileStore } from "@/stores/profile.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { X } from "lucide-react";

export function ChangePasswordForm() {
  const { changePassword, loading } = useProfileStore();
  const email = useAuthStore((s) => s.user?.email ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }
    await changePassword({
      email,
      current_password: form.current_password,
      new_password: form.new_password,
    });
    setForm({ current_password: "", new_password: "", confirm_password: "" });
    setIsOpen(false);
  };

  const handleClose = () => {
    setForm({ current_password: "", new_password: "", confirm_password: "" });
    setIsOpen(false);
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left">
          <h2 className="font-['Lora'] text-xl font-bold text-[#335F76]">
            Bảo mật tài khoản
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Cập nhật mật khẩu định kỳ để bảo vệ tài khoản của bạn.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#335F76] px-4 text-sm font-semibold text-[#335F76] transition hover:bg-[#335F76] hover:text-white"
        >
          Đổi mật khẩu
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-800">Đổi mật khẩu</h3>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4 text-left">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-500">
                Mật khẩu hiện tại
                <input
                  type="password"
                  value={form.current_password}
                  onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                  className="h-11 rounded-xl border border-slate-200 px-3 text-slate-700 outline-none transition focus:border-[#335F76]"
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-500">
                Mật khẩu mới
                <input
                  type="password"
                  value={form.new_password}
                  onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                  className="h-11 rounded-xl border border-slate-200 px-3 text-slate-700 outline-none transition focus:border-[#335F76]"
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-500">
                Xác nhận mật khẩu mới
                <input
                  type="password"
                  value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  className="h-11 rounded-xl border border-slate-200 px-3 text-slate-700 outline-none transition focus:border-[#335F76]"
                  required
                />
              </label>

              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-xl bg-[#335F76] text-sm font-semibold text-white transition hover:bg-[#294d61] disabled:opacity-60"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
