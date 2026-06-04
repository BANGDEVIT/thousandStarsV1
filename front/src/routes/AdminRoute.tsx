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
  console.log("User roles:", roles); // Debug: log roles to verify
  if (!roles.includes("manager")) {
    console.log("Không danh không phận mà đòi vào đây à")
    return (
      <Navigate
        to="/homepage"
        replace
      />
    );
  }
  else{
    return children;
  }

  return children;
}