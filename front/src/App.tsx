import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { useInitAuth } from "./stores/useInitAuth";
import { useAuthStore } from "./stores/auth.store";
import { LoadingOverlay } from "./components/features/loading/LoadingOverlay";
import { useProfileStore } from "./stores/profile.store";
import { useEffect } from "react";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  useInitAuth();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    if (isInitialized && accessToken) { 
      fetchProfile();
    }
    
  }, [isInitialized, accessToken, fetchProfile]);

  return (
    // BrowserRouter phải là outer shell — KHÔNG BAO GIỜ bị unmount
    <BrowserRouter>
      <LoadingOverlay />
      <Toaster richColors />

      {/* Block routing cho đến khi auth init xong, nhưng BrowserRouter vẫn sống */}
      {isInitialized && <AppRoutes />}
    </BrowserRouter>
  );
}

export default App;
