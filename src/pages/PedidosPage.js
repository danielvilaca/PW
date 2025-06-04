import { useEffect, useState } from 'react';
import { fetchPedidos, criarPedido } from '../api/pedidos';
import PedidoCard from '../components/PedidoCard';
import PedidoForm from '../components/PedidoForm';
import { useAuth } from '../auth/AuthContext';
import { isAdmin, isSenhorio, isInquilino } from '../utils/roles';

const PedidosPage = () => {
  const { perfil } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  const carregarPedidos = async () => {
    try {
      const data = await fetchPedidos();
      setPedidos(data);
    } catch (err) {
      setMensagem('Erro ao carregar pedidos');
      console.error('Erro ao carregar pedidos:', err.message);
    }
  };

  const adicionarPedido = async (novoPedido) => {
    try {
      await criarPedido({ ...novoPedido, estado: 'Aberto' });
      setMensagem('Pedido criado com sucesso!');
      carregarPedidos();
    } catch (error) {
      setMensagem('Erro ao criar pedido.');
      console.error('Erro ao adicionar pedido:', error.message);
    }
  };

  useEffect(() => {
    carregarPedidos();
    // eslint-disable-next-line
  }, []);

  // --- Validação de role ---
  if (!perfil) return <div className="container mt-5">A carregar...</div>;
  if (!(isAdmin(perfil) || isSenhorio(perfil) || isInquilino(perfil))) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Não tens permissões para aceder a esta página.
        </div>
      </div>
    );
  }
  // -------------------------

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title mb-4">Pedidos de Reparação</h2>
              {mensagem && (
                <div className={`alert ${mensagem.includes('sucesso') ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {mensagem}
                </div>
              )}
              {isInquilino(perfil) && (
                <PedidoForm onSubmit={adicionarPedido} />
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-3">Lista de Pedidos</h3>
              {pedidos.length === 0 ? (
                <p className="text-muted">Ainda não existem pedidos.</p>
              ) : (
                <div className="vstack gap-3">
                  {pedidos.map((p) => <PedidoCard key={p.id} pedido={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default PedidosPage;
