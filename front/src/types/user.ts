export interface User {
  id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  roles: string[];
  phone?: string;
  id_card?: string;
  id_card_img_url?: string;
  id_card_img_back_url?: string;
  nationality?: string;
  reward_points?: number;
  account: {
    id: string;
    email: string;
    roles: string[];
  };
  updated_at?: string;
}