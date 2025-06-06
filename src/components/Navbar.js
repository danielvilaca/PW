// src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { perfil, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        {/* Logo / Marca */}
        <Link className="navbar-brand" to="/condominios">
          Gestão Condomínios
        </Link>

        {/* Botão de toggle para telas menores */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Itens do menu */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Sempre visível */}
            <li className="nav-item">
              <Link className="nav-link" to="/condominios">
                Condomínios
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/pedidos">
                Pedidos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/faturas">
                Faturas
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/pagamentos">
                Pagamentos
              </Link>
            </li>

            {/* Página “Conta” sempre disponível */}
            <li className="nav-item">
              <Link className="nav-link" to="/conta">
                Minha Conta
              </Link>
            </li>

            {/* Só exibir “Gestão de Contas” se for admin */}
            {perfil?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/contas">
                  Gestão de Contas
                </Link>
              </li>
            )}
          </ul>

          {/* Área do usuário no canto direito */}
          <div className="d-flex align-items-center">
            {perfil?.foto_url ? (
              <img
                src={perfil.foto_url}
                alt="Avatar"
                className="rounded-circle me-2"
                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
              />
            ) : (
              <span className="me-2">
                <i className="bi bi-person-circle fs-4"></i>
              </span>
            )}
            <div className="me-3 text-end">
              <div className="fw-semibold">{perfil?.nome || ''}</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                {perfil?.email || ''}
              </div>
            </div>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
