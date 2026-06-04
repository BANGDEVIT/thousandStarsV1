import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore(
    (s) => s.accessToken
  );

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}