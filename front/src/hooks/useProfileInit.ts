import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";
import { useEffect } from "react";
export function useProfileInit() {
  const accessToken = useAuthStore(
    (s) => s.accessToken
  );

  const fetchProfile = useProfileStore(
    (s) => s.fetchProfile
  );

  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken, fetchProfile]);
}