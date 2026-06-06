import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useProfileStore } from "@/stores/profile.store";
import { useAuthStore } from "@/stores/auth.store";
import { getRoleHomePath } from "@/lib/auth-redirect";
import { ProfileView } from "@/components/features/profile/ProfileView";
import { ChangePasswordForm } from "@/components/features/profile/ChangePasswordForm";
import { ProfileSidebar } from "@/components/features/profile/ProfileSidebar";
import { BookingHistory } from "@/components/features/profile/BookingHistory";
import Navbar from "@/components/features/nav-bar/navbar";

export default function UserProfile() {
  const { profile, loading, fetchProfile, updateProfile } = useProfileStore();
  const accessToken = useAuthStore((s) => s.accessToken);
  const roles = useAuthStore((s) => s.roles);
  const [activeTab, setActiveTab] = useState<"info" | "history" | "security" | "settings">("info");

  useEffect(() => {
    if (accessToken) fetchProfile();
  }, [accessToken, fetchProfile]);

  const roleHomePath = getRoleHomePath(roles);
  if (roleHomePath !== "/profile") {
    return <Navigate to={roleHomePath} replace />;
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto flex max-w-6xl items-center justify-center px-5 py-20 text-sm text-slate-500">
          Đang tải thông tin cá nhân...
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b8862b]">
            Thousand Stars
          </p>
          <h1 className="mt-2 font-['Lora'] text-3xl font-bold text-[#253f50]">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Quản lý thông tin tài khoản, bảo mật và lịch sử đặt phòng của bạn.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <ProfileSidebar
            profile={profile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <section className="min-w-0">
            {activeTab === "info" && (
              <ProfileView profile={profile} loading={loading} onUpdate={updateProfile} />
            )}
            {activeTab === "history" && (
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                <BookingHistory />
              </div>
            )}
            {activeTab === "security" && <ChangePasswordForm />}
            {activeTab === "settings" && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-400">Đang phát triển</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
