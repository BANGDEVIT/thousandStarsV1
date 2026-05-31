import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse } from "@/api/types";
import type { CustomerProfile } from "@/features/customer/types";

type RawProfile = {
  id: string;
  full_name: string;
  phone: string | null;
  nationality: string | null;
  reward_points: number;
  updated_at: string;
  account: { email: string };
};

function mapProfile(raw: RawProfile): CustomerProfile {
  return {
    id: raw.id,
    full_name: raw.full_name,
    email: raw.account?.email ?? null,
    phone: raw.phone,
    nationality: raw.nationality,
    reward_points: Number(raw.reward_points),
    updated_at: raw.updated_at,
  };
}

export const customerProfileApi = {
  getProfile: async () => {
    const res = await axiosInstance.get<ApiResponse<RawProfile>>("/customers/profile");
    return mapProfile(res.data.data);
  },

  updateProfile: async (payload: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    nationality?: string;
  }) => {
    const res = await axiosInstance.patch<ApiResponse<RawProfile>>(
      "/customers/profile",
      payload,
    );
    return mapProfile(res.data.data);
  },
};
