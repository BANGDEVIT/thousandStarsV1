import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export const passwordSchema = z
  .string()
  .min(8, "Tối thiểu 8 ký tự")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Cần chữ hoa, thường, số và ký tự đặc biệt",
  );

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Vui lòng nhập tên"),
    lastName: z.string().min(1, "Vui lòng nhập họ"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
