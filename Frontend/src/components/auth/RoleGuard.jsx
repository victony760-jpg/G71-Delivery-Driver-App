import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function RoleGuard({ children, allowedRoles = [] }) {
  const { user, isAdmin } = useAuth();

  // Enforce single admin rule
  if (allowedRoles.includes('admin')) {
    if (!isAdmin || user?.email !== 'admin@g71.com') {
      return <Navigate to="/login" replace />;
    }
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    // redirect based on role
    if (user?.role === 'admin')
      return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'driver') return <Navigate to="/driver" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
