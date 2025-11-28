import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: ReactNode;
}

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  if (localStorage.getItem("accessToken") == null) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
