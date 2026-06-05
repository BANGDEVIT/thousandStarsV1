import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import { Toaster } from "sonner";
import AdminLayout from "./pages/AdminLayout";
import EmployeeManagement from "./components/employees/EmployeeManagement";

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
        <AdminLayout>
          <Routes>
            <Route
              path="/"
              element={
                <div className="text-[#64748B]">Dashboard — Coming soon</div>
              }
            />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route
              path="/rooms"
              element={
                <div className="text-[#64748B]">Rooms — Coming soon</div>
              }
            />
            <Route
              path="/bookings"
              element={
                <div className="text-[#64748B]">Bookings — Coming soon</div>
              }
            />
            <Route
              path="/invoices"
              element={
                <div className="text-[#64748B]">Invoices — Coming soon</div>
              }
            />
            <Route path="*" element={<Navigate to="/employees" replace />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </>
  );
}

export default App;
