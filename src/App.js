import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';

import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import CondominiosPage from './pages/CondominiosPage';
import PedidosPage from './pages/PedidosPage';
import FaturasPage from './pages/FaturasPage';
import PagamentosPage from './pages/PagamentosPage';
import ContaPage from './pages/ContaPage';
import GestaoContasPage from './pages/GestaoContasPage';
import Login from './pages/login';

function AppContent() {
  const { user, perfil, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (user && perfil === null) {
    return null;
  }

  return (
    <>
      <Navbar />

      <Routes>
        {/* Home ("/") - qualquer utilizador autenticado */}
        <Route path="/" element={<HomePage />} />

        {/* Condominios - apenas admin ou senhorio */}
        <Route
          path="/condominios"
          element={
            perfil.role === 'admin' || perfil.role === 'senhorio' ? (
              <CondominiosPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Pedidos - qualquer utilizador autenticado (inquilino, senhorio ou admin) */}
        <Route path="/pedidos" element={<PedidosPage />} />

        {/* Faturas - qualquer utilizador autenticado */}
        <Route path="/faturas" element={<FaturasPage />} />

        {/* Pagamentos - qualquer utilizador autenticado */}
        <Route path="/pagamentos" element={<PagamentosPage />} />

        {/* Minha Conta - qualquer utilizador autenticado */}
        <Route path="/conta" element={<ContaPage />} />

        {/* Gestão de Contas - apenas admin */}
        <Route
          path="/gestao-contas"
          element={
            perfil.role === 'admin' ? (
              <GestaoContasPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* /login estando já autenticado => redireciona para / */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Qualquer outra rota inválida => redireciona para "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
