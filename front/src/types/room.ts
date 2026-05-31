export type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning" | "inactive";

export interface RoomTypeSummary {
  id: string;
  name: string;
  base_price: number;
  capacity: number;
  bed_type: string;
  amenities: string[];
}

export interface Room {
  id: string;
  room_number: string;
  floor: number;
  status: RoomStatus;
  room_type: RoomTypeSummary;
  created_at: string;
  updated_at: string;
}

export interface RoomFilters {
  status: string;
  room_type_id: string;
  floor: string;
  search: string;
  page: number;
  limit: number;
}

export interface CreateRoomPayload {
  room_number: string;
  room_type_id: string;
  floor: number;
}

export interface UpdateRoomPayload {
  room_number?: string;
  room_type_id?: string;
  floor?: number;
}

export interface UpdateRoomStatusPayload {
  status: RoomStatus;
}

export const ROOM_STATUS_TRANSITIONS: Record<RoomStatus, RoomStatus[]> = {
  available: ["cleaning", "maintenance"],
  cleaning: ["available"],
  maintenance: ["available"],
  occupied: ["cleaning"],
  inactive: [],
};

export function getAllowedStatusTransitions(status: RoomStatus): RoomStatus[] {
  return ROOM_STATUS_TRANSITIONS[status] ?? [];
}
