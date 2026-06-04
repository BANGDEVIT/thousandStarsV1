import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export const useInitAuth = () => {
  const { setAccessToken,setInitialized  } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      try {
        const newToken = await authService.refresh();
        setAccessToken(newToken);
      } catch {
        toast.error("Chưa đăng nhập hoặc phiên đã hết hạn");
      }
      finally {
        setInitialized(); // luôn đánh dấu đã init xong
      }
    };

    init();
  }, []);
};