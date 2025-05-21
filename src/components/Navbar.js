import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiTool, FiFileText, FiPlusCircle, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 px-6 py-3 flex justify-between items-center">
      <div className="flex gap-6 items-center">
        <Link to="/condominios" className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-medium">
          <FiHome /> Condomínios
        </Link>
        <Link to="/gestao-pedidos" className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-medium">
          <FiSettings /> Gestão de Pedidos
        </Link>
        <Link to="/novo-pedido" className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-medium">
          <FiPlusCircle /> Novo Pedido
        </Link>
        <Link to="/faturas" className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-medium">
          <FiFileText /> Faturas
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 text-red-600 hover:underline font-medium"
      >
        <FiLogOut /> Logout
      </button>
    </nav>
  );
};

export default Navbar;
