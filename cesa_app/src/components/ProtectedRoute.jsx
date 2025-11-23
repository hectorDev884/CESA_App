// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ redirectTo = '/login' }) {
  const { session } = useAuth();
  return session ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
