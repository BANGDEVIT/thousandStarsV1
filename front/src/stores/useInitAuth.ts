import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";

export const useInitAuth = () => {
  const { setAccessToken, setInitialized } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      try {
        const { accessToken, roles } = await authService.refresh();
        setAccessToken(accessToken, roles); // roles từ JWT → AdminRoute hoạt động đúng sau reload
      } catch {
        // Silent — chưa đăng nhập là bình thường
      } finally {
        setInitialized();
      }
    };
    init();
  }, []);
};