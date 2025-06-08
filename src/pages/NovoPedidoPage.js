import { useEffect, useState } from 'react';
import { fetchPedidos, criarPedido } from '../api/pedidos';
import PedidoCard from '../components/PedidoCard';
import PedidoForm from '../components/PedidoForm';

const NovoPedidoPage = () => {
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
    try {
      await criarPedido({ ...novoPedido, estado: 'Aberto' });
      carregarPedidos();
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error.message);
      alert('Erro ao criar pedido. Verifica a consola.');
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Novo Pedido de Reparação</h2>
      <PedidoForm onSubmit={adicionarPedido} />

      <h3 className="text-xl font-semibold mt-8 mb-2">Os teus pedidos</h3>
      {pedidos.length === 0 ? (
        <p className="text-gray-500">Ainda não criaste nenhum pedido.</p>
      ) : (
        pedidos.map((p) => <PedidoCard key={p.id} pedido={p} />)
      )}
    </div>
  );
};

export default NovoPedidoPage;
