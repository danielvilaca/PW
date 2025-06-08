import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { perfil, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">

        {/* Marca / Home */}
        <Link className="navbar-brand fw-bold" to="/">
          SmartCondo
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Links de navegação */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Mostrar “Condomínios” apenas para admin / senhorio */}
            {perfil && perfil.role !== 'inquilino' && (
              <li className="nav-item">
                <Link className="nav-link" to="/condominios">
                  Condomínios
                </Link>
              </li>
            )}
            {/* Todos autenticados têm acesso a “Pedidos” */}
            <li className="nav-item">
              <NavLink
                to="/pedidos"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Pedidos
              </NavLink>
            </li>

            {/* Todos autenticados têm acesso a “Faturas” */}
            <li className="nav-item">
              <NavLink
                to="/faturas"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Faturas
              </NavLink>
            </li>

            {/* Todos autenticados têm acesso a “Pagamentos” */}
            <li className="nav-item">
              <NavLink
                to="/pagamentos"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Pagamentos
              </NavLink>
            </li>

            {/* Todos autenticados têm acesso a “Minha Conta” */}
            <li className="nav-item">
              <NavLink
                to="/conta"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Minha Conta
              </NavLink>
            </li>

            {/* Apenas admin vê “Gestão de Contas” */}
            {perfil?.role === 'admin' && (
              <li className="nav-item">
                <NavLink
                  to="/gestao-contas"
                  className={({ isActive }) =>
                    'nav-link' + (isActive ? ' active' : '')
                  }
                >
                  Gestão de Contas
                </NavLink>
              </li>
            )}
          </ul>

          {/* Lado direito: avatar + nome + logout */}
          {perfil && (
            <div className="d-flex align-items-center">
              {/* Avatar (ou ícone placeholder caso não exista foto) */}
              <img
                src={perfil.foto_url || 'https://placehold.co/32'}
                alt="avatar"
                className="rounded-circle me-2"
                width="32"
                height="32"
              />

              {/* Mostrar nome do utilizador (ou email) */}
              <span className="me-3">{perfil.nome || perfil.email}</span>

              {/* Botão de Logout */}
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
