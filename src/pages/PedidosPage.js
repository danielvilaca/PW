import { useEffect, useState } from 'react';
import { fetchPedidos, criarPedido } from '../api/pedidos';
import PedidoCard from '../components/PedidoCard';
import PedidoForm from '../components/PedidoForm';

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);

  const carregarPedidos = async () => {
    try {
      const data = await fetchPedidos();
      setPedidos(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err.message);
    }
  };

  const adicionarPedido = async (novoPedido) => {
    await criarPedido({ ...novoPedido, estado: 'Aberto' });
    carregarPedidos();
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pedidos de Reparação</h2>
      <PedidoForm onSubmit={adicionarPedido} />
      {pedidos.map((p) => (
        <PedidoCard key={p.id} pedido={p} />
      ))}
    </div>
  );
};

export default PedidosPage;
