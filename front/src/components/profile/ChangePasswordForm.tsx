// ChangePasswordForm.tsx
import { useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useAuthStore } from "@/stores/useAuthStore";
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
    <>
      {/* Nút trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-2 border border-[#101953] text-[#101953] rounded-lg text-sm mt-2"
      >
        Đổi mật khẩu
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handleClose} // click ngoài để đóng
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()} // ngăn click lan ra overlay
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Đổi mật khẩu</h3>
              <button type="button" onClick={handleClose}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400 text-left">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={form.current_password}
                  onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                  className="border rounded-lg p-2 text-sm outline-none focus:border-[#101953]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400 text-left">Mật khẩu mới</label>
                <input
                  type="password"
                  value={form.new_password}
                  onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                  className="border rounded-lg p-2 text-sm outline-none focus:border-[#101953]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400 text-left">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  className="border rounded-lg p-2 text-sm outline-none focus:border-[#101953]"
                  required
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-[#101953] text-white rounded-lg text-sm"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}