import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Spinner from '../components/Spinner';

const PrivateRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Spinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
