import { BrowserRouter, Route, Routes } from "react-router";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SigninPage />} />
          
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
