import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import Spinner from './components/Spinner';

import Login from './pages/login';
import CondominiosPage from './pages/CondominiosPage';
import NovoPedidoPage from './pages/NovoPedidoPage';
import GestaoPedidosPage from './pages/GestaoPedidosPage';
import PagamentoRendaPage from './pages/PagamentoRendaPage';
import FaturasPage from './pages/FaturasPage';
import ContaPage from './pages/ContaPage';
import Navbar from './components/Navbar';
import PagamentosPage   from './pages/PagamentosPage';
import GestaoContasPage from './pages/GestaoContasPage';
import AdminRoute       from './auth/AdminRoute';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  return (
    <>
      {user && <Navbar />}
      <div className="pt-5 px-4">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/condominios" element={<PrivateRoute><CondominiosPage /></PrivateRoute>} />
          <Route path="/novo-pedido" element={<PrivateRoute><NovoPedidoPage /></PrivateRoute>} />
          <Route path="/gestao-pedidos" element={<PrivateRoute><GestaoPedidosPage /></PrivateRoute>} />
          <Route path="/pagamentos" element={<PrivateRoute><PagamentoRendaPage /></PrivateRoute>} />
          <Route path="/faturas" element={<PrivateRoute><FaturasPage /></PrivateRoute>} />
          <Route path="/conta" element={<PrivateRoute><ContaPage /></PrivateRoute>} />
          <Route path="/pagamentos" element={<PrivateRoute><PagamentosPage /></PrivateRoute>} />
          <Route path="/gestao-contas" element={<AdminRoute><GestaoContasPage /></AdminRoute>} />


          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
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
