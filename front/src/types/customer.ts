export type CustomerSource = "walk_in" | "online_registration";

export interface CustomerAccount {
  id: string;
  email: string;
  is_active: boolean;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  id_card: string | null;
  nationality: string | null;
  reward_points: number;
  source: CustomerSource;
  registered_at: string | null;
  created_at: string;
  updated_at: string;
  account: CustomerAccount | null;
}

export interface CustomerFilters {
  search: string;
  nationality: string;
  source: string;
  page: number;
  limit: number;
}

export interface CreateGuestPayload {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  id_card?: string;
  nationality?: string;
}

export interface UpdateCustomerPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  id_card?: string;
  nationality?: string;
}
