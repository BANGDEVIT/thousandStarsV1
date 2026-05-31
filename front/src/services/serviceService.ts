import api from "@/lib/axios";

export interface Service {
  id: string;
  name: string;
  category: string | null;
  price: number;
  is_active: boolean;
}

interface PaginatedServices {
  data: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const serviceService = {
  getAll: async (): Promise<PaginatedServices> => {
    const res = await api.get<ApiEnvelope<PaginatedServices>>("/services");
    return res.data.data;
  },
};
