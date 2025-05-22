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
  <nav className="navbar navbar-expand-lg bg-white shadow fixed-top px-4 py-3 d-flex justify-content-between align-items-center">
      <div className="d-flex gap-4 align-items-center">
        <Link to="/condominios" className="text-dark d-flex align-items-center gap-1 fw-medium text-decoration-none">
          <FiHome /> Condomínios
        </Link>
        <Link to="/gestao-pedidos" className="text-dark d-flex align-items-center gap-1 fw-medium text-decoration-none">
          <FiSettings /> Gestão de Pedidos
        </Link>
        <Link to="/novo-pedido" className="text-dark d-flex align-items-center gap-1 fw-medium text-decoration-none">
          <FiPlusCircle /> Novo Pedido
        </Link>
        <Link to="/faturas" className="text-dark d-flex align-items-center gap-1 fw-medium text-decoration-none">
          <FiFileText /> Faturas
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-link text-danger d-flex align-items-center gap-1 fw-medium text-decoration-none"
      >
        <FiLogOut /> Logout
         </button>
    </nav>
  );
};

export default Navbar;
