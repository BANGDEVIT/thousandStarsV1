import { z } from "zod";

export const createRoomSchema = z.object({
  room_number: z.string().min(1, "Không được để trống"),
  room_type_id: z.string().min(1, "Không được để trống"),
  floor: z.number().int().min(0, "Tầng không hợp lệ"),
});

export const updateRoomStatusSchema = z.object({
  status: z.enum(["available", "occupied", "maintenance", "cleaning", "inactive"], {
    message: "Trạng thái không hợp lệ",
  }),
});

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>;
export type UpdateRoomStatusFormValues = z.infer<typeof updateRoomStatusSchema>;
