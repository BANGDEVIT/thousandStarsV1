import { z } from "zod";

export const createBookingSchema = z.object({
  customer_id: z.string().min(1, "Không được để trống"),
  room_ids: z.array(z.string().min(1)).min(1, "Chọn ít nhất một phòng"),
  check_in_date: z.string().min(1, "Không được để trống"),
  check_out_date: z.string().min(1, "Không được để trống"),
  booking_type: z.enum(["online", "walk_in"], { message: "Loại đặt phòng không hợp lệ" }),
  special_requests: z.string().optional(),
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;
