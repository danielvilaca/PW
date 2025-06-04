import { useEffect, useState } from 'react';
import { fetchPedidos, eliminarPedido, updatePedido } from '../api/pedidos';
import PedidoCard from '../components/PedidoCard';
import PedidoModal from '../components/PedidoModal';
import { useAuth } from '../auth/AuthContext';
import { isAdmin, isSenhorio } from '../utils/roles';

const GestaoPedidosPage = () => {
  const { perfil } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const carregarPedidos = async () => {
    try {
      const data = await fetchPedidos();
      setPedidos(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('Tens a certeza que queres eliminar este pedido?')) return;
    try {
      await eliminarPedido(id);
      carregarPedidos();
    } catch (err) {
      alert('Erro ao eliminar pedido');
    }
  };

  const handleVerDetalhes = (pedido) => {
    setPedidoSelecionado(pedido);
    setModoEdicao(false);
  };

  const handleEditar = (pedido) => {
    setPedidoSelecionado(pedido);
    setModoEdicao(true);
  };

  const handleGuardar = async (dadosAtualizados) => {
    try {
      await updatePedido(dadosAtualizados);
      setPedidoSelecionado(null);
      carregarPedidos();
    } catch (err) {
      alert('Erro ao guardar alterações');
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  // --- Validação de role ---
  if (!perfil) return <div className="container mt-5">A carregar...</div>;
  if (!(isAdmin(perfil) || isSenhorio(perfil))) {
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
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Gestão de Pedidos</h2>
      <div className="grid gap-4">
        {pedidos.map((p) => (
          <PedidoCard
            key={p.id}
            pedido={p}
            onVerDetalhes={handleVerDetalhes}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        ))}
      </div>
      {pedidoSelecionado && (
        <PedidoModal
          pedido={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
          onGuardar={modoEdicao ? handleGuardar : null}
        />
      )}
    </div>
  );
};

export default GestaoPedidosPage;
