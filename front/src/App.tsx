import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import PaymentPage from "./pages/PaymentPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import BookingPage from "./pages/BookingPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import HotelListPage from "./pages/HotelListPage";
import CheckinPage from "./pages/CheckinPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "@/pages/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import RoomsPage from "@/pages/admin/RoomsPage";
import RoomFormPage from "@/pages/admin/RoomFormPage";
import EmployeesPage from "@/pages/admin/EmployeesPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import AdminPlaceholderPage from "@/pages/admin/AdminPlaceholderPage";
import EmployeeLayout from "@/pages/employee/EmployeeLayout";
import EmployeeCheckinPage from "@/pages/employee/CheckinPage";
import CheckoutListPage from "@/pages/employee/CheckoutListPage";
import CheckoutDetailPage from "@/pages/employee/CheckoutDetailPage";
import EmployeePlaceholderPage from "@/pages/employee/EmployeePlaceholderPage";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-bookings" element={<BookingHistoryPage />} />
          <Route path="/checkin" element={<CheckinPage />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<Navigate to="/profile" replace />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="/homepage" element={<Navigate to="/" replace />} />

          <Route path="/login" element={<Navigate to="/signin" replace />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin", "manager"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="rooms/new" element={<RoomFormPage mode="create" />} />
            <Route path="rooms/:id/edit" element={<RoomFormPage mode="edit" />} />
            <Route
              path="bookings"
              element={
                <AdminPlaceholderPage
                  title="Đặt phòng"
                  description="Quản lý booking — nối API khi sẵn sàng."
                />
              }
            />
            <Route
              path="invoices"
              element={
                <AdminPlaceholderPage
                  title="Hóa đơn"
                  description="Quản lý hóa đơn — nối API khi sẵn sàng."
                />
              }
            />
            <Route
              path="shifts"
              element={<AdminPlaceholderPage title="Ca làm" />}
            />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route
              path="permissions"
              element={<AdminPlaceholderPage title="Phân quyền" />}
            />
            <Route
              path="settings"
              element={<AdminPlaceholderPage title="Cài đặt" />}
            />
          </Route>

          <Route
            path="/employee"
            element={
              <ProtectedRoute roles={["staff", "manager", "admin"]}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="checkin" replace />} />
            <Route path="checkin" element={<EmployeeCheckinPage />} />
            <Route path="checkout" element={<CheckoutListPage />} />
            <Route path="checkout/:id" element={<CheckoutDetailPage />} />
            <Route
              path="rooms"
              element={<EmployeePlaceholderPage title="Phòng" />}
            />
            <Route
              path="rent"
              element={<EmployeePlaceholderPage title="Thuê phòng" />}
            />
            <Route
              path="settings"
              element={<EmployeePlaceholderPage title="Cài đặt" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
