import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ redirectTo = "/" }) {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return session ? <Navigate to={redirectTo} replace /> : <Outlet />;
}
