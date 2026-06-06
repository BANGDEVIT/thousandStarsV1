import apiClient from '@/lib/axios';
import type { Room, CreateRoomDto, RoomsResponse, GetRoomsQuery, UpdateRoomDto, UpdateRoomStatusDto,RoomAvailabilityResponse,ConflictBooking } from '@/types/room.type';


// Hàm tạo phòng mới
export const createRoom = async (data: CreateRoomDto): Promise<Room> => {
  const response = await apiClient.post('/rooms', data);
  return response.data.data; // { success, data: Room }
};



export const updateRoom = async (id: string, data: UpdateRoomDto): Promise<Room> => {
  const response = await apiClient.patch(`/rooms/${id}`, data);
  return response.data.data;
};

export const updateRoomStatus = async (id: string, data: UpdateRoomStatusDto): Promise<Room> => {
  const response = await apiClient.patch(`/rooms/${id}/status`, data);
  return response.data.data;
};
 
export const addRoomImages = async (id: string, files: File[]): Promise<Room> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const response = await apiClient.post(`/rooms/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};
 
export const deleteRoomImages = async (id: string, imageUrls: string[]): Promise<Room> => {
  const response = await apiClient.delete(`/rooms/${id}/images`, {
    data: { imageUrls },
  });
  return response.data.data;
};
 
export const reorderRoomImages = async (id: string, imageUrls: string[]): Promise<Room> => {
  const response = await apiClient.patch(`/rooms/${id}/images/reorder`, { imageUrls });
  return response.data.data;
};

export const deleteRoom = async (id: string)=>{
  const response = await apiClient.delete(`/rooms/${id}`);
  return response.data.data;
}



const now = new Date().toISOString();

const fallbackRooms: Room[] = [
  {
    id: "mock-deluxe-ocean-suite",
    room_number: "A101",
    floor: 1,
    status: "available",
    created_at: now,
    updated_at: now,
    images: [],
    room_type: {
      id: "mock-deluxe",
      name: "Deluxe Ocean Suite",
      base_price: 1300000,
      capacity: 2,
      bed_type: "king",
      amenities: ["WiFi", "Ban công", "View biển"],
    },
  },
  {
    id: "mock-premier-garden-room",
    room_number: "B203",
    floor: 2,
    status: "available",
    created_at: now,
    updated_at: now,
    images: [],
    room_type: {
      id: "mock-premier",
      name: "Premier Garden Room",
      base_price: 1500000,
      capacity: 2,
      bed_type: "queen",
      amenities: ["WiFi", "Garden view", "Bồn tắm"],
    },
  },
  {
    id: "mock-royal-penthouse",
    room_number: "P501",
    floor: 5,
    status: "available",
    created_at: now,
    updated_at: now,
    images: [],
    room_type: {
      id: "mock-royal",
      name: "Royal Penthouse",
      base_price: 2500000,
      capacity: 4,
      bed_type: "king",
      amenities: ["WiFi", "Ban công", "Phòng khách"],
    },
  },
];

function isNetworkUnavailable(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ERR_NETWORK"
  );
}

function getFallbackRooms(params?: GetRoomsQuery): RoomsResponse {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? fallbackRooms.length;
  const status = params?.status;
  const data = status
    ? fallbackRooms.filter((room) => room.status === status)
    : fallbackRooms;

  return {
    data,
    total: data.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(data.length / limit)),
  };
}

function normalizeAvailabilityResponse(data: RoomAvailabilityResponse): RoomAvailabilityResponse {
  const conflictBookings =
    data.conflictBookings ??
    ((data.conflicting_booking ? [data.conflicting_booking] : []) as ConflictBooking[]);

  return {
    ...data,
    conflictBookings,
    conflicting_booking: data.conflicting_booking ?? conflictBookings[0] ?? null,
    message:
      data.message ??
      (conflictBookings.length > 0
        ? "Phòng đã có người đặt trong khoảng thời gian này. Vui lòng chọn ngày khác."
        : "Phòng còn trống trong khoảng thời gian này."),
  };
}

export const getRooms = async (
  params?: GetRoomsQuery,
): Promise<RoomsResponse> => {
  try {
    const response = await apiClient.get("/rooms", { params });
    return response.data.data;
  } catch (error) {
    // Keep the old static/mock browsing flow usable when the local API server
    // is not running. Real API errors still bubble up normally.
    if (isNetworkUnavailable(error)) {
      return getFallbackRooms(params);
    }
    throw error;
  }
};

export const getAvailableRooms = async (params: {
  check_in_date: string;
  check_out_date: string;
  page?: number;
  limit?: number;
  room_type_id?: string;
  capacity?: number;
}): Promise<RoomsResponse> => {
  try {
    const response = await apiClient.get("/rooms/available", { params });
    return response.data.data ?? response.data;
  } catch (error) {
    if (isNetworkUnavailable(error)) {
      return getFallbackRooms({
        page: params.page,
        limit: params.limit,
        status: "available",
      });
    }
    throw error;
  }
};

export const getRoomById = async (id: string): Promise<Room> => {
  try {
    const response = await apiClient.get(`/rooms/${id}`);
    return response.data.data;
  } catch (error) {
    const fallbackRoom = fallbackRooms.find((room) => room.id === id);
    if (isNetworkUnavailable(error) && fallbackRoom) {
      return fallbackRoom;
    }
    throw error;
  }
};

export const checkRoomAvailability = async (
  id: string,
  params: { check_in_date: string; check_out_date: string },
): Promise<RoomAvailabilityResponse> => {
  try {
    const response = await apiClient.get(`/rooms/${id}/availability`, {
      params: {
        checkInDate: params.check_in_date,
        checkOutDate: params.check_out_date,
      },
    });
    return normalizeAvailabilityResponse(response.data.data ?? response.data);
  } catch (error) {
    if (isNetworkUnavailable(error)) {
      const fallbackRoom = fallbackRooms.find((room) => room.id === id);
      return {
        room_id: id,
        room_number: fallbackRoom?.room_number ?? "",
        available: fallbackRoom?.status === "available",
        reason: fallbackRoom?.status === "available" ? null : "ROOM_STATUS_UNAVAILABLE",
        conflictBookings: [],
        conflicting_booking: null,
        message:
          fallbackRoom?.status === "available"
            ? "Phòng còn trống trong khoảng thời gian này."
            : "Phòng hiện không thể đặt.",
      };
    }
    throw error;
  }
};


