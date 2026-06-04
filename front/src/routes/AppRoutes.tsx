import SigninPage from "@/pages/SigninPage";
import SignupPage from "@/pages/SignupPage";
import UserProfile from "@/pages/UserProfile";
import HomePage from "@/pages/HomePage";
import AdminPage from "@/pages/AdminPage";

import { Navigate, Route, Routes } from "react-router";

import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "@/routes/AdminRoute";

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
      />

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