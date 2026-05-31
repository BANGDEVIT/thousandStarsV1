import axiosInstance from "@/api/axiosInstance";
import type { ApiResponse, PaginatedResult } from "@/api/types";
import { normalizePagination } from "@/api/types";
import type {
  CreateGuestPayload,
  Customer,
  CustomerFilters,
  UpdateCustomerPayload,
} from "@/types/customer";

type RawCustomer = {
  id: string;
  full_name: string;
  phone: string | null;
  id_card: string | null;
  nationality: string | null;
  reward_points: number;
  source?: Customer["source"];
  registered_at?: string | null;
  created_at?: string;
  updated_at: string;
  account: Customer["account"];
};

function mapCustomer(raw: RawCustomer): Customer {
  return {
    id: raw.id,
    full_name: raw.full_name,
    email: raw.account?.email ?? null,
    phone: raw.phone,
    id_card: raw.id_card,
    nationality: raw.nationality,
    reward_points: Number(raw.reward_points),
    source: raw.source ?? "walk_in",
    registered_at: raw.registered_at ?? null,
    created_at: raw.created_at ?? raw.updated_at,
    updated_at: raw.updated_at,
    account: raw.account,
  };
}

export const customerApi = {
  getAll: async (filters: CustomerFilters) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedResult<RawCustomer>>>("/customers", {
      params: {
        search: filters.search || undefined,
        nationality: filters.nationality || undefined,
        source: filters.source || undefined,
        page: filters.page,
        limit: filters.limit,
      },
    });
    const page = normalizePagination(res.data.data);
    return {
      ...page,
      data: page.data.map(mapCustomer),
    };
  },

  getById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<RawCustomer>>(`/customers/${id}`);
    return mapCustomer(res.data.data);
  },

  createGuest: async (payload: CreateGuestPayload) => {
    const res = await axiosInstance.post<ApiResponse<RawCustomer>>("/customers/guest", payload);
    return mapCustomer(res.data.data);
  },

  update: async (id: string, payload: UpdateCustomerPayload) => {
    const res = await axiosInstance.patch<ApiResponse<RawCustomer>>(`/customers/${id}`, payload);
    return mapCustomer(res.data.data);
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/customers/${id}`);
  },
};
