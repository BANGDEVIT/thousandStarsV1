import { z } from "zod";

export const createGuestSchema = z.object({
  first_name: z.string().min(1, "Không được để trống"),
  last_name: z.string().min(1, "Không được để trống"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  id_card: z.string().optional(),
  nationality: z.string().optional(),
});

export const updateCustomerSchema = createGuestSchema.partial();

export type CreateGuestFormValues = z.infer<typeof createGuestSchema>;
