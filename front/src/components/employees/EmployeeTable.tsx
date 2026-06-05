import { useEmployeeStore } from "@/stores/employeeStore";
import type { Employee } from "@/types/employess";
import { useState } from "react";

interface Props {
  onEdit: (emp: Employee) => void;
  onResetPassword: (emp: Employee) => void; // ← thêm prop
}

const GENDER_LABEL: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

export default function EmployeeTable({ onEdit, onResetPassword }: Props) {
  const {
    employees,
    loading,
    filters,
    total,
    totalPages,
    setFilters,
    deleteEmployee,
  } = useEmployeeStore();

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteEmployee(id);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const empCode = (idx: number) =>
    `EMP-${String((filters.page - 1) * filters.limit + idx + 1).padStart(4, "0")}`;

  if (loading && employees.length === 0) {
    return (
      <div
        className="bg-white border border-[#E2E2D8] rounded-xl p-12
                      text-center text-[#64748B] text-[13px]"
      >
        <div
          className="inline-block w-5 h-5 border-2 border-[#E2E2D8] border-t-[#1B3A5C]
                        rounded-full animate-spin mr-2 align-middle"
        />
        Đang tải danh sách nhân viên...
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E2D8] rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        {/* Head */}
        <thead className="bg-[#F0F0EA]">
          <tr>
            {[
              "Mã NV",
              "Họ tên",
              "Email",
              "Điện thoại",
              "Vị trí",
              "Giới tính",
              "Trạng thái",
              "Thao tác",
            ].map((h) => (
              <th
                key={h}
                className="px-3.5 py-2.5 text-left text-[11px] font-semibold
                           text-[#64748B] tracking-[0.8px] uppercase
                           border-b border-[#E2E2D8] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="text-center py-10 text-[13px] text-[#64748B]"
              >
                Không tìm thấy nhân viên nào
              </td>
            </tr>
          ) : (
            employees.map((emp, idx) => {
              const isActive = emp.account.is_active;
              return (
                <tr
                  key={emp.id}
                  className="hover:bg-[#FAFAF8] transition-colors"
                >
                  {/* Mã NV */}
                  <td className="px-3.5 py-2.5 border-b border-[#E2E2D8]">
                    <span className="text-[11px] text-[#64748B] font-mono font-medium">
                      {empCode(idx)}
                    </span>
                  </td>

                  {/* Họ tên */}
                  <td className="px-3.5 py-2.5 border-b border-[#E2E2D8]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-[30px] h-[30px] rounded-full bg-[#1B3A5C] text-white
                                      flex items-center justify-center text-[11px] font-semibold
                                      flex-shrink-0 overflow-hidden"
                      >
                        {emp.avatar_url ? (
                          <img
                            src={emp.avatar_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          `${emp.last_name[0]}${emp.first_name[0]}`
                        )}
                      </div>
                      <span className="text-[13px] font-medium text-[#0A0A0A]">
                        {emp.last_name} {emp.first_name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-3.5 py-2.5 border-b border-[#E2E2D8]">
                    <span className="text-[12px] text-[#64748B]">
                      {emp.account.email}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-3.5 py-2.5 border-b border-[#E2E2D8] text-[13px]">
                    {emp.phone ?? "—"}
                  </td>

                  {/* Vị trí */}
                  <td className="px-3.5 py-2.5 border-b border-[#E2E2D8]">
                    <span
                      className="bg-[#F0F0EA] text-[#1B3A5C] text-[11px] font-medium
                                     px-2.5 py-0.5 rounded-full"
                    >
                      {emp.position}
                    </span>
                  </td>

                  {/* Giới tính */}
                  <td className="px-3.5 py-2.5 border-b border-[#E2E2D8] text-[13px]">
                    {GENDER_LABEL[emp.gender] ?? emp.gender}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-3.5 py-2.5 border-b border-[#E2E2D8]">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full
                      ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isActive ? "● Hoạt động" : "● Ngừng"}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="px-3.5 py-2.5 border-b border-[#E2E2D8]">
                    <div className="flex items-center gap-1.5">
                      {/* Edit */}
                      <button
                        onClick={() => onEdit(emp)}
                        title="Chỉnh sửa"
                        className="p-1.5 rounded-md border border-[#E2E2D8] bg-white
                                   text-[#64748B] hover:border-[#1B3A5C] hover:text-[#1B3A5C]
                                   hover:bg-[#1B3A5C]/5 transition-all"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* Reset password ← mới thêm */}
                      <button
                        onClick={() => onResetPassword(emp)}
                        title="Reset mật khẩu"
                        className="p-1.5 rounded-md border border-[#E2E2D8] bg-white
                                   text-[#64748B] hover:border-[#C9A84C] hover:text-[#C9A84C]
                                   hover:bg-[#C9A84C]/5 transition-all"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </button>

                      {/* Delete / Confirm */}
                      {confirmId === emp.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(emp.id)}
                            disabled={deletingId === emp.id}
                            className="text-[11px] px-2 py-1 rounded-md bg-[#8C1D18]
                                       text-white disabled:opacity-60"
                          >
                            {deletingId === emp.id ? "..." : "Xác nhận"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-[11px] px-2 py-1 rounded-md border
                                       border-[#E2E2D8] text-[#64748B] hover:bg-[#F0F0EA]"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(emp.id)}
                          title="Xóa nhân viên"
                          className="p-1.5 rounded-md border border-[#E2E2D8] bg-white
                                     text-[#64748B] hover:border-[#8C1D18] hover:text-[#8C1D18]
                                     hover:bg-[#8C1D18]/5 transition-all"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-3.5 py-3
                      border-t border-[#E2E2D8] bg-[#F0F0EA]"
      >
        <span className="text-[12px] text-[#64748B]">
          Trang {filters.page} / {totalPages} · Tổng {total} nhân viên
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters({ page: filters.page - 1 })}
            className="text-[12px] px-3 py-1.5 rounded-md border border-[#E2E2D8]
                       bg-white text-[#0A0A0A] hover:bg-[#F0F0EA] disabled:opacity-40
                       disabled:cursor-not-allowed transition-colors"
          >
            ← Trước
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setFilters({ page: p })}
                className={`text-[12px] px-3 py-1.5 rounded-md border transition-colors
                  ${
                    p === filters.page
                      ? "bg-[#1B3A5C] text-white border-[#1B3A5C]"
                      : "border-[#E2E2D8] bg-white text-[#0A0A0A] hover:bg-[#F0F0EA]"
                  }`}
              >
                {p}
              </button>
            );
          })}

          <button
            disabled={filters.page >= totalPages}
            onClick={() => setFilters({ page: filters.page + 1 })}
            className="text-[12px] px-3 py-1.5 rounded-md border border-[#E2E2D8]
                       bg-white text-[#0A0A0A] hover:bg-[#F0F0EA] disabled:opacity-40
                       disabled:cursor-not-allowed transition-colors"
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
}
