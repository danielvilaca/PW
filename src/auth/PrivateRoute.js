import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>; // Spinner
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
