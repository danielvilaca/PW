// src/App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';

import Login from './pages/login';
import CondominiosPage from './pages/CondominiosPage';
import PedidosPage from './pages/PedidosPage';
import PedidoDetailsPage from './pages/PedidoDetailsPage';
import FaturasPage from './pages/FaturasPage';
import GestaoContasPage from './pages/GestaoContasPage';
import PagamentosPage from './pages/PagamentosPage';
import ContaPage from './pages/ContaPage'; // ← não esqueça de importar!
import Navbar from './components/Navbar';

function AppContent() {
  const { user } = useAuth();
  if (user === undefined) return null;

  return (
    <>
      {user && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/condominios"
          element={
            <PrivateRoute>
              <CondominiosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <PedidosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/pedidos/:id"
          element={
            <PrivateRoute>
              <PedidoDetailsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/faturas"
          element={
            <PrivateRoute>
              <FaturasPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/conta"
          element={
            <PrivateRoute>
              <ContaPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/contas"
          element={
            <PrivateRoute>
              <GestaoContasPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/pagamentos"
          element={
            <PrivateRoute>
              <PagamentosPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Login />} />
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
