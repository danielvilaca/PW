import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { user, perfil } = useAuth();
  if (user === undefined) return null; // loading
  return perfil?.role === 'admin' ? children : <Navigate to="/login" />;
};

export default AdminRoute;
