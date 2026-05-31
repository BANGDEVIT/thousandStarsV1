import { z } from "zod";

const amenityEnum = z.enum([
  "wifi",
  "tv",
  "air_conditioning",
  "minibar",
  "bathtub",
  "balcony",
  "pool",
  "gym",
  "breakfast",
  "parking",
  "safe",
  "hair_dryer",
]);

export const roomTypeSchema = z.object({
  name: z.string().min(1, "Không được để trống"),
  base_price: z.number().min(1, "Phải lớn hơn 0"),
  capacity: z.number().int().min(1, "Phải lớn hơn 0"),
  bed_type: z.enum(["single", "double", "twin", "king", "queen"], {
    message: "Loại giường không hợp lệ",
  }),
  amenities: z.array(amenityEnum).optional().default([]),
  is_active: z.boolean().optional().default(true),
});

export type RoomTypeFormValues = z.infer<typeof roomTypeSchema>;
