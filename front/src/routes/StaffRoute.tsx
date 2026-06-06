import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";

interface StaffRouteProps {
  children: React.ReactNode;
}

export function StaffRoute({ children }: StaffRouteProps) {
  const roles = useAuthStore((state) => state.roles);
  const canAccessStaff = roles.some((role) =>
    ["staff", "manager", "admin"].includes(role),
  );

  if (!canAccessStaff) {
    return <Navigate to="/homepage" replace />;
  }

  return children;
}
