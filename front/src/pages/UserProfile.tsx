import { useEffect } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileView } from "@/components/profile/ProfileView";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { LogoutButton } from "@/components/login-comp/LogoutButton";
import Navbar from "@/components/nav-bar/navbar";


export default function UserProfile() {
  const { profile, loading, fetchProfile, updateProfile } = useProfileStore();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (accessToken) fetchProfile();
  }, [accessToken, fetchProfile]);

  if (loading && !profile) return <div>Đang tải...</div>;
  if (!profile) return null;

  return (
    <div className="w-full min-h-screen !bg-[#F0F8FB] ">
      {/* Navigation Menu */}
      <Navbar />
      {/* Profile and other content */}
      <div className="w-full min-h-screen bg-gray-50 py-10">
        <div className="w-full max-w-7xl px-0 lg:px-12 flex flex-col items-center gap-6 mx-auto">
          <ProfileView profile={profile} onUpdate={updateProfile} loading={loading} />
          <ChangePasswordForm />
          <LogoutButton className="w-full py-2 border border-red-200 text-red-500 rounded-lg justify-center" />
        </div>
      </div>
    </div>
  );
}