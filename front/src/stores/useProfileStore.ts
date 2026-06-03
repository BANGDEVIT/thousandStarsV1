import { create } from "zustand";
import { toast } from "sonner";
import { profileService } from "@/services/profileService";
import type { User } from "@/types/user";

type UpdateProfileData = Parameters<typeof profileService.updateProfile>[0];
type ChangePasswordData = Parameters<typeof profileService.changePassword>[0];

interface ProfileState {
  profile: User | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,

  fetchProfile: async () => {
    try {
      set({ loading: true });
      const data = await profileService.getProfile();
      set({ profile: data });
    } catch {
      toast.error("Không thể tải thông tin profile");
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      set({ loading: true });
      const updated = await profileService.updateProfile(data);
      set({ profile: updated });
      toast.success("Cập nhật thành công");
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      set({ loading: false });
    }
  },

  changePassword: async (data) => {
    try {
      set({ loading: true });
      await profileService.changePassword(data);
      toast.success("Đổi mật khẩu thành công");
    } catch (error: unknown) {
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response: { status?: number } }).response.status
          : undefined;
      if (status === 400) {
        toast.error("Mật khẩu hiện tại không đúng hoặc mật khẩu mới trùng mật khẩu cũ");
      } else {
        toast.error("Đổi mật khẩu thất bại");
      }
    } finally {
      set({ loading: false });
    }
  },

  // uploadAvatar: async (file) => {
  //   try {
  //     set({ loading: true });
  //     const updated = await profileService.uploadAvatar(file);
  //     set({ profile: updated });
  //     toast.success("Cập nhật ảnh đại diện thành công");
  //   } catch {
  //     toast.error("Tải ảnh lên thất bại");
  //   } finally {
  //     set({ loading: false });
  //   }
  // },
}));