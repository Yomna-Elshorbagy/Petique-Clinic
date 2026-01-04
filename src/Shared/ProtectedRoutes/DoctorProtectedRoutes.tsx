import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DoctorProtectedRouteProps {
  children: ReactNode;
}

interface JwtPayload {
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

export default function DoctorProtectedRoute({
  children,
}: DoctorProtectedRouteProps) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const userRole = decoded.role;

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" />;
    }

    if (userRole !== "doctor" && userRole !== "owner") {
      return <Navigate to="/" />;
    }

    return <>{children}</>;
  } catch (error) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" />;
  }
}
