import { useEffect, useState } from 'react';
import { fetchPedidos } from '../api/pedidos';
import PedidoCard from '../components/PedidoCard';

export default function GestaoPedidosPage() {
  const [pedidos, setPedidos] = useState([]);

  /* carrega todos os pedidos ao montar */
  useEffect(() => {
    fetchPedidos().then(setPedidos);
  }, []);

  /* handlers vazios (Opção A) */
  const editarPedido  = () => {};
  const removerPedido = () => {};

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Gestão de Pedidos</h1>

      {pedidos.map((p) => (
        <PedidoCard
          key={p.id}
          pedido={p}
          onEdit={editarPedido}
          onDelete={removerPedido}
        />
      ))}
    </div>
  );
}
