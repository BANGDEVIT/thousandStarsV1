import { BrowserRouter, Route, Routes } from "react-router";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignupPage";
import UserProfile from "./pages/UserProfile";
import { useInitAuth } from "./stores/useInitAuth";
import { useAuthStore } from "./stores/auth.store";
import { LoadingOverlay } from "./components/features/loading/LoadingOverlay";
import { useProfileStore } from "./stores/profile.store";
import { useEffect } from "react";
import AdminPage from "./pages/AdminPage";

function App() {
  useInitAuth();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const accessToken = useAuthStore((s) => s.accessToken)
  const fetchProfile = useProfileStore((s) => s.fetchProfile)

  useEffect(() => {
    if (accessToken) {
      fetchProfile()
    }
  }, [accessToken, fetchProfile])
  
  if (!isInitialized) {
  return <LoadingOverlay />;
}

  return (
    <>
      <LoadingOverlay />
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SigninPage />} />
          
          <Route path="/signup" element={<SignupPage />} />
          
          <Route path="/homepage" element={<HomePage />} />

          <Route path="/profile" element={<UserProfile />} />

          <Route path="/admin" element={<AdminPage />} />
          {/* Protected routes */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
