import { useState, useEffect } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileView } from "@/components/profile/ProfileView";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { BookingHistory } from "@/components/profile/BookingHistory";

import Navbar from "@/components/nav-bar/navbar";


export default function UserProfile() {
  const { profile, loading, fetchProfile, updateProfile } = useProfileStore();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [activeTab, setActiveTab] = useState<"info" |"history"| "security" | "settings">("info");

  useEffect(() => {
    if (accessToken) fetchProfile();
  }, [accessToken, fetchProfile]);

  if (loading && !profile) return <div>Đang tải...</div>;
  if (!profile) return null;

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-6 items-start">

          <ProfileSidebar
            profile={profile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="flex-1">
            {activeTab === "info" && (
              <ProfileView profile={profile} loading={loading} onUpdate={updateProfile} />
            )}
             {activeTab === "history" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <BookingHistory />
              </div>
            )}
            {activeTab === "security" && (
              <ChangePasswordForm />
            )}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-slate-400 text-sm">Đang phát triển</p>
              </div>
            )}
           
          </div>

        </div>
      </div>
    </div>
  );
}