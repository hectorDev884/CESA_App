import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ redirectTo = "/login" }) {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return session ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
