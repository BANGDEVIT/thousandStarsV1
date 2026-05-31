import { z } from "zod";
import { passwordSchema } from "@/features/auth/schemas/authSchema";

export const createEmployeeSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: passwordSchema,
  first_name: z.string().min(1, "Không được để trống"),
  last_name: z.string().min(1, "Không được để trống"),
  phone: z.string().optional(),
  position: z.string().min(1, "Không được để trống"),
  gender: z.enum(["male", "female", "other"], { message: "Giới tính không hợp lệ" }),
  salary: z.number().min(0, "Phải lớn hơn hoặc bằng 0").optional(),
  hired_date: z.string().min(1, "Không được để trống"),
  role: z.enum(["staff", "manager"], { message: "Vai trò không hợp lệ" }),
});

export const updateEmployeeSchema = createEmployeeSchema
  .omit({ email: true, password: true, role: true })
  .partial();

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeSchema>;
