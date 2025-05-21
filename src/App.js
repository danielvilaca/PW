import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';

import Login from './pages/login';
import CondominiosPage from './pages/CondominiosPage';
import NovoPedidoPage from './pages/NovoPedidoPage';
import GestaoPedidosPage from './pages/GestaoPedidosPage';
import FaturasPage from './pages/FaturasPage';
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
          path="/novo-pedido"
          element={
            <PrivateRoute>
              <NovoPedidoPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/gestao-pedidos"
          element={
            <PrivateRoute>
              <GestaoPedidosPage />
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

        {/* fallback 404 ou redireciona para login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
