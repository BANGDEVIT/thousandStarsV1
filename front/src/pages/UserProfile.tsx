import { useState, useEffect } from "react";
import { useProfileStore } from "@/stores/profile.store";
import { useAuthStore } from "@/stores/auth.store";
import { ProfileView } from "@/components/features/profile/ProfileView";
import { ChangePasswordForm } from "@/components/features/profile/ChangePasswordForm";
import { ProfileSidebar } from "@/components/features/profile/ProfileSidebar";
import { BookingHistory } from "@/components/features/profile/BookingHistory";

import Navbar from "@/components/features/nav-bar/navbar";


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
    <div className="w-full min-h-screen bg-slate-50 ">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 ">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-auto">
            <ProfileSidebar
            
            profile={profile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          </div>
          
          <div className="flex-1 w-full">
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