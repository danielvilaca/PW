import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, perfil, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // navbar só aparece autenticado

  const isAdmin = perfil?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
      <div className="container-fluid">

        {/* Marca / título */}
        <Link className="navbar-brand fw-bold" to="/condominios">
          Gestão
        </Link>

        {/* Botão mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            {/* Condomínios & Gestão de Pedidos → só admin ou senhorio */}
            {(perfil?.role === 'admin' || perfil?.role === 'senhorio') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/condominios">
                    <i className="bi bi-house" /> Condomínios
                  </Link>
                </li>
              </>
            )}
            
            <li className="nav-item">
              <Link className="nav-link" to="/gestao-pedidos">
                <i className="bi bi-tools" /> Gestão Pedidos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/pagamentos">
                <i className="bi bi-cash-stack" /> Pagamentos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/faturas">
                <i className="bi bi-file-earmark-text" /> Faturas
              </Link>
            </li>

            {/* Só aparece para admin */}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/gestao-contas">
                  <i className="bi bi-people" /> Gestão Contas
                </Link>
              </li>
            )}

            {/* Página pessoal (conta) */}
            <li className="nav-item">
              <Link className="nav-link" to="/conta">
                <i className="bi bi-person-circle" /> {perfil?.nome || user.email}
              </Link>
            </li>
          </ul>

          {/* Botão logout */}
          <button onClick={handleLogout} className="btn btn-outline-danger">
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
