import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Employee } from "@/types/employess";
import { useEmployeeStore } from "@/stores/employeeStore";

const pwdSchema = z
  .string()
  .min(8, "Tối thiểu 8 ký tự")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Cần chữ hoa, chữ thường, số và ký tự đặc biệt",
  );

const createSchema = z.object({
  first_name: z.string().min(1, "Không được để trống"),
  last_name: z.string().min(1, "Không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: pwdSchema,
  phone: z.string().optional(),
  position: z.string().min(1, "Chọn vị trí"),
  gender: z.enum(["male", "female", "other"]),
  salary: z.coerce.number().min(0).optional(),
  hired_date: z.string().min(1, "Chọn ngày vào làm"),
  role: z.enum(["staff", "manager"]),
});

const editSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  salary: z.coerce.number().min(0).optional(),
  hired_date: z.string().optional(),
  is_active: z.boolean().optional(),
});

type CreateForm = z.infer<typeof createSchema>;
type EditForm = z.infer<typeof editSchema>;

const POSITIONS = [
  "Lễ tân",
  "Quản lý",
  "Bảo vệ",
  "Kỹ thuật",
  "Đầu bếp",
  "Dọn phòng",
];

interface Props {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSuccess: (msg: string) => void;
}

// Shared input class
const inputCls = (hasErr?: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-[13px] text-[#0A0A0A] bg-white outline-none
   transition-all focus:ring-2
   ${
     hasErr
       ? "border-[#8C1D18] focus:border-[#8C1D18] focus:ring-[#8C1D18]/10"
       : "border-[#E2E2D8] focus:border-[#1B3A5C] focus:ring-[#1B3A5C]/10"
   }`;

export default function EmployeeForm({
  open,
  onClose,
  employee,
  onSuccess,
}: Props) {
  const { createEmployee, updateEmployee } = useEmployeeStore();
  const isEdit = !!employee;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateForm | EditForm>({
    resolver: zodResolver(isEdit ? editSchema : createSchema) as any,
    defaultValues: isEdit
      ? {
          first_name: employee.first_name,
          last_name: employee.last_name,
          phone: employee.phone ?? "",
          position: employee.position,
          gender: employee.gender as "male" | "female",
          salary: employee.salary,
          hired_date: employee.hired_date?.split("T")[0] ?? "",
          is_active: employee.account.is_active,
        }
      : {
          gender: "male",
          role: "staff",
          hired_date: new Date().toISOString().split("T")[0],
        },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (values: any) => {
    try {
      if (isEdit && employee) {
        if (values.is_active !== undefined)
          values.is_active =
            values.is_active === "true" || values.is_active === true;
        await updateEmployee(employee.id, values);
        onSuccess("Cập nhật nhân viên thành công");
      } else {
        await createEmployee(values);
        onSuccess("Tạo nhân viên thành công");
      }
      onClose();
    } catch {
      /* handled in store */
    }
  };

  if (!open) return null;
  const err = errors as any;

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl p-6 w-[500px] max-w-[95vw]
                      max-h-[88vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between mb-5 pb-3.5
                        border-b border-[#E2E2D8]"
        >
          <h3 className="text-[16px] font-medium text-[#0A0A0A]">
            {isEdit ? "✎ Chỉnh sửa nhân viên" : "+ Tạo nhân viên mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:bg-[#F0F0EA] rounded-lg px-2 py-1
                       text-lg transition-colors leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Họ & Tên */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Họ *
              </label>
              <input
                className={inputCls(err.last_name)}
                {...register("last_name")}
                placeholder="Nguyễn"
              />
              {err.last_name && (
                <p className="text-[11px] text-[#8C1D18] mt-1">
                  {err.last_name.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Tên *
              </label>
              <input
                className={inputCls(err.first_name)}
                {...register("first_name")}
                placeholder="Văn A"
              />
              {err.first_name && (
                <p className="text-[11px] text-[#8C1D18] mt-1">
                  {err.first_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email — tạo mới */}
          {!isEdit && (
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Email đăng nhập *
              </label>
              <input
                className={inputCls(err.email)}
                type="email"
                {...register("email" as any)}
                placeholder="nva@hotel.com"
              />
              {err.email && (
                <p className="text-[11px] text-[#8C1D18] mt-1">
                  {err.email.message}
                </p>
              )}
            </div>
          )}

          {/* Password — tạo mới */}
          {!isEdit && (
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Mật khẩu *
              </label>
              <input
                className={inputCls(err.password)}
                type="password"
                {...register("password" as any)}
                placeholder="Password@123"
              />
              {err.password && (
                <p className="text-[11px] text-[#8C1D18] mt-1">
                  {err.password.message}
                </p>
              )}
            </div>
          )}

          {/* Phone & Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Điện thoại
              </label>
              <input
                className={inputCls()}
                {...register("phone")}
                placeholder="0909123456"
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Vị trí *
              </label>
              <select
                className={inputCls(err.position)}
                {...register("position")}
              >
                <option value="">-- Chọn vị trí --</option>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {err.position && (
                <p className="text-[11px] text-[#8C1D18] mt-1">
                  {err.position.message}
                </p>
              )}
            </div>
          </div>

          {/* Gender & Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Giới tính *
              </label>
              <select className={inputCls()} {...register("gender")}>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Lương (VNĐ)
              </label>
              <input
                className={inputCls()}
                type="number"
                {...register("salary")}
                placeholder="5000000"
              />
            </div>
          </div>

          {/* Date & Role/Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[11px] font-semibold text-[#64748B]
                                uppercase tracking-wide mb-1.5"
              >
                Ngày vào làm {!isEdit && "*"}
              </label>
              <input
                className={inputCls()}
                type="date"
                {...register("hired_date")}
              />
            </div>

            {!isEdit ? (
              <div>
                <label
                  className="block text-[11px] font-semibold text-[#64748B]
                                  uppercase tracking-wide mb-1.5"
                >
                  Role *
                </label>
                <select className={inputCls()} {...register("role" as any)}>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            ) : (
              <div>
                <label
                  className="block text-[11px] font-semibold text-[#64748B]
                                  uppercase tracking-wide mb-1.5"
                >
                  Trạng thái
                </label>
                <select
                  className={inputCls()}
                  defaultValue={String(employee?.account.is_active)}
                  {...register("is_active" as any)}
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Ngừng hoạt động</option>
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 justify-end pt-4 border-t border-[#E2E2D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] rounded-lg border border-[#E2E2D8]
                         bg-white text-[#0A0A0A] hover:bg-[#F0F0EA] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-[13px] font-medium rounded-lg
                         bg-[#1B3A5C] text-white hover:bg-[#0F2440]
                         disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? "Đang lưu..."
                : isEdit
                  ? "✓ Lưu thay đổi"
                  : "+ Tạo nhân viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
