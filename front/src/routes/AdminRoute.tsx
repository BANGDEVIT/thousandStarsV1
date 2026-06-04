import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({
  children,
}: AdminRouteProps) {
  const roles = useAuthStore(
    (state) => state.roles
  );

  if (!roles.includes("manager")) {
    return (
      <Navigate
        to="/homepage"
        replace
      />
    );
  }

  return children;
}