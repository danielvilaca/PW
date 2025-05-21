import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import CondominiosPage from './pages/CondominiosPage'; // importa a página protegida
import PrivateRoute from './auth/PrivateRoute';        // importa a proteção
import { AuthProvider } from './auth/AuthContext';
import PedidosPage from './pages/PedidosPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protegida */}
          <Route
            path="/condominios"
            element={
              <PrivateRoute>
                <CondominiosPage />
              </PrivateRoute>
            }
          />

          {/* Pedidos de reparacao */}
          <Route
            path="/pedidos"
            element={
              <PrivateRoute>
                <PedidosPage />
              </PrivateRoute>
            }
          />
          {/* fallback: 404 */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
