export type BedType = "single" | "double" | "twin" | "king" | "queen";

export type Amenity =
  | "wifi"
  | "tv"
  | "air_conditioning"
  | "minibar"
  | "bathtub"
  | "balcony"
  | "pool"
  | "gym"
  | "breakfast"
  | "parking"
  | "safe"
  | "hair_dryer";

export interface RoomType {
  id: string;
  name: string;
  base_price: number;
  capacity: number;
  bed_type: BedType;
  amenities: Amenity[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomTypeFilters {
  search: string;
  page: number;
  limit: number;
}

export interface CreateRoomTypePayload {
  name: string;
  base_price: number;
  capacity: number;
  bed_type: BedType;
  amenities?: Amenity[];
  is_active?: boolean;
}

export interface UpdateRoomTypePayload {
  name?: string;
  base_price?: number;
  capacity?: number;
  bed_type?: BedType;
  amenities?: Amenity[];
  is_active?: boolean;
}
