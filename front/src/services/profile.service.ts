import api from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/types/user.type";

// Chọn base endpoint theo role
const profileBase = (): string => {
  const roles = useAuthStore.getState().roles;
  if (roles.includes("manager") || roles.includes("admin") || roles.includes("employee") || roles.includes("receptionist")) {
    return "/employees/profile";
  }
  return "/customers/profile";
};

export const profileService = {
  getProfile: async (): Promise<User> => {
    const res = await api.get(profileBase());
    return res.data.data;
  },

  // Chỉ dùng cho customer (employee có form riêng nếu cần)
  updateProfile: async (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    nationality?: string;
    id_card_img_url?: File;
    id_card_img_back_url?: File;
  }) => {
    const formData = new FormData();
    if (data.first_name)           formData.append("first_name", data.first_name);
    if (data.last_name)            formData.append("last_name", data.last_name);
    if (data.phone)                formData.append("phone", data.phone);
    if (data.nationality)          formData.append("nationality", data.nationality);
    if (data.id_card_img_url)      formData.append("id_card_img_url", data.id_card_img_url);
    if (data.id_card_img_back_url) formData.append("id_card_img_back_url", data.id_card_img_back_url);

    const res = await api.patch(profileBase(), formData, {
      //headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  changePassword: async (data: {
    email: string;
    current_password: string;
    new_password: string;
  }) => {
    const base = profileBase();
    const res = await api.patch(`${base}/password`, data);
    return res.data;
  },
};