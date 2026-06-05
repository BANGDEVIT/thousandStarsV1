import { useEmployeeStore } from "@/stores/employeeStore";
import type { Employee } from "@/types/employess";
import { useEffect, useState } from "react";
import EmployeeFilters from "./EmployeeFilter";
import EmployeeTable from "./EmployeeTable";
import EmployeeForm from "./EmployeeForm";

interface Toast {
  msg: string;
  type: "success" | "error";
}

export default function EmployeeManagement() {
  const { fetchEmployees, total, error, clearError, resetPassword } =
    useEmployeeStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!error) return;
    clearError();
  }, [error]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string, type: Toast["type"] = "success") =>
    setToast({ msg, type });

  const handleEdit = (emp: Employee) => {
    setEditTarget(emp);
    setFormOpen(true);
  };
  const handleCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const handleClose = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  // ← Gọi API resetPassword đúng cách
  const handleResetPassword = async (emp: Employee) => {
    try {
      await resetPassword(emp.id);
      showToast(
        `Đã reset mật khẩu cho ${emp.last_name} ${emp.first_name}`,
        "success",
      );
    } catch {
      showToast("Reset mật khẩu thất bại", "error");
    }
  };

  return (
    <div className="relative">
      {/* ── Toast ──────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[999] bg-white border border-[#E2E2D8]
                         rounded-xl px-4 py-3 flex items-center gap-2.5
                         shadow-[0_8px_24px_rgba(0,0,0,0.1)] max-w-[320px]
                         animate-[slideIn_0.25s_ease]`}
          style={{ animation: "slideIn 0.25s ease" }}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
            ${toast.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {toast.type === "success" ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#0A0A0A]">
              {toast.type === "success" ? "Thành công" : "Lỗi"}
            </p>
            <p className="text-[12px] text-[#64748B] mt-0.5">{toast.msg}</p>
          </div>
        </div>
      )}

      {/* ── Breadcrumb ─────────────────────────── */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] mb-4">
        <span>Bảng điều khiển</span>
        <span className="text-[#E2E2D8]">/</span>
        <span className="text-[#1B3A5C] font-medium">Quản lý nhân viên</span>
      </div>

      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p
            className="text-[11px] font-semibold text-[#64748B] tracking-[1px]
                        uppercase mb-1"
          >
            Quản trị nhân sự
          </p>
          <h1 className="text-[22px] font-medium text-[#0A0A0A] leading-tight">
            Nhân viên{" "}
            <span className="text-[#C9A84C] italic">
              / <em>{total}</em>
            </span>
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Quản lý hồ sơ, vai trò và quyền truy cập của toàn bộ nhân viên khách
            sạn.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#1B3A5C] text-white px-4 py-2.5
                     rounded-lg text-[13px] font-medium hover:bg-[#0F2440]
                     transition-colors whitespace-nowrap"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tạo nhân viên mới
        </button>
      </div>

      {/* ── Filters ────────────────────────────── */}
      <EmployeeFilters />

      {/* ── Table ──────────────────────────────── */}
      {/* ← truyền onResetPassword xuống đây */}
      <EmployeeTable
        onEdit={handleEdit}
        onResetPassword={handleResetPassword}
      />

      {/* ── Form modal ─────────────────────────── */}
      <EmployeeForm
        open={formOpen}
        onClose={handleClose}
        employee={editTarget}
        onSuccess={(msg) => showToast(msg, "success")}
      />

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
