import api from "@/lib/axios";

export const profileService = {
  getProfile: async () => {
  const res = await api.get("/customers/profile");
  console.log("profile data:", res.data.data); // xem tất cả field
  return res.data.data;
},
  updateProfile: async (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    nationality?: string;
    id_card_img_url?: File;
    id_card_img_back_url?: File;
  }) => {
    const formData = new FormData();
    if (data.first_name) formData.append("first_name", data.first_name);
    if (data.last_name) formData.append("last_name", data.last_name);
    if (data.phone) formData.append("phone", data.phone);
    if (data.nationality) formData.append("nationality", data.nationality);
    if (data.id_card_img_url) formData.append("id_card_img_url", data.id_card_img_url);
    if (data.id_card_img_back_url) formData.append("id_card_img_back_url", data.id_card_img_back_url);

    const res = await api.patch("/customers/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
  changePassword: async (data: {
  email: string;
  current_password: string;
  new_password: string;
}) => {
  const res = await api.patch("/customers/profile/password", data);
  return res.data;
},
};