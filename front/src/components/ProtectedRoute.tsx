import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { UserRole } from "@/features/auth/types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasRole = useAuthStore((s) => s.hasRole);

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (roles && !roles.some((role) => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
