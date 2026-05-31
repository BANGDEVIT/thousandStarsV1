import { z } from "zod";
import { requiresReferenceNumber } from "@/features/payments/api/paymentApi";

export const createPaymentSchema = z
  .object({
    invoice_id: z.string().min(1, "Không được để trống"),
    amount: z.number().min(1, "Số tiền phải lớn hơn 0"),
    payment_method: z.enum(["cash", "bank_transfer", "e_wallet", "credit_card"], {
      message: "Phương thức thanh toán không hợp lệ",
    }),
    reference_number: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (requiresReferenceNumber(data.payment_method) && !data.reference_number?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Mã giao dịch bắt buộc với chuyển khoản và ví điện tử",
        path: ["reference_number"],
      });
    }
  });

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
