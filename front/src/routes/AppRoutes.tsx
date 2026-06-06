import SigninPage from "@/pages/SigninPage";
import SignupPage from "@/pages/SignupPage";
import UserProfile from "@/pages/UserProfile";
import HomePage from "@/pages/HomePage";
import AdminPage from "@/pages/AdminPage";
import StaffPage from "@/pages/StaffPage";
import RoomsPage from "@/pages/RoomsPage";
import RoomDetailPage from "@/pages/RoomDetailPage";
import { DashboardOverviewPage } from "@/components/features/dashboard/DashboardOverviewPage";
import { RoomListPage } from "@/components/features/dashboard/RoomListPage";
import { RoomTypeListPage } from "@/components/features/dashboard/RoomTypeListPage";
import { EmployeeListPage } from "@/components/features/dashboard/EmployeeListPage";
import { RevenueReportPage } from "@/components/features/dashboard/RevenueReportPage";
import { StaffBookingsPage } from "@/components/features/staff/StaffBookingsPage";
import { StaffCheckInPage } from "@/components/features/staff/StaffCheckInPage";
import { StaffCheckOutPage } from "@/components/features/staff/StaffCheckOutPage";
import { StaffRoomsPage } from "@/components/features/staff/StaffRoomsPage";

import { Navigate, Route, Routes } from "react-router";

import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "@/routes/AdminRoute";
import { StaffRoute } from "@/routes/StaffRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/homepage"
            replace
          />
        }
      />

      <Route
        path="/signin"
        element={<SigninPage />}
      />

      <Route
        path="/signup"
        element={<SignupPage />}
      />

      <Route
        path="/homepage"
        element={<HomePage />}
      />

      <Route
        path="/rooms"
        element={<RoomsPage />}
      />

      <Route
        path="/rooms/:id"
        element={<RoomDetailPage />}
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverviewPage />} />
        <Route path="rooms" element={<RoomListPage />} />
        <Route path="room-types" element={<RoomTypeListPage />} />
        <Route path="employees" element={<EmployeeListPage />} />
        <Route path="revenue" element={<RevenueReportPage />} />
      </Route>

      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <StaffRoute>
              <StaffPage />
            </StaffRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/staff/check-in" replace />} />
        <Route path="check-in" element={<StaffCheckInPage />} />
        <Route path="check-out" element={<StaffCheckOutPage />} />
        <Route path="rooms" element={<StaffRoomsPage />} />
        <Route path="bookings" element={<StaffBookingsPage />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/homepage"
            replace
          />
        }
      />
    </Routes>
  );
}
