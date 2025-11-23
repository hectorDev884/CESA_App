// GuestRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ redirectTo = "/" }) {
  const { session } = useAuth();

  return session ? <Navigate to={redirectTo} replace /> : <Outlet />;
}
