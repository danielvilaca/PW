// src/pages/PedidosPage.js

import { useEffect, useState } from 'react';
import { fetchPedidos, criarPedido, updatePedido, deletePedido } from '../api/pedidos';
import PedidoCard from '../components/PedidoCard';
import PedidoForm from '../components/PedidoForm'; // Se for necessário um formulário separado
import { useAuth } from '../auth/AuthContext';

export default function PedidosPage() {
  const { perfil } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const data = await fetchPedidos();
      setPedidos(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const adicionarPedido = async (novoPedido) => {
    try {
      // novoPedido = { titulo, descricao, validade_orcamentos, condominio_id }
      await criarPedido(novoPedido);
      await carregarPedidos();
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
      alert('Erro ao criar pedido. Veja o console.');
    }
  };

  const handleEdit = async (pedido) => {
    // pedido: objeto completo. Abre modal ou formulário para editar campos.
    // Exemplo simples:
    const titulo = window.prompt('Novo título', pedido.titulo);
    if (titulo == null) return;
    try {
      await updatePedido(pedido.id, { titulo });
      await carregarPedidos();
    } catch (err) {
      console.error('Erro ao editar pedido:', err);
      alert('Falha ao editar. Veja console.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem a certeza que quer eliminar este pedido?')) return;
    try {
      await deletePedido(id);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Erro ao apagar pedido:', err);
      alert('Falha ao excluir pedido. Veja console.');
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  if (loading) return <div className="text-center my-5">Carregando pedidos…</div>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pedidos de Reparação</h2>
        {/* Se quiser um formulário embutido */}
        <button
          className="btn btn-primary"
          onClick={() => {
            // Exemplo simplificado de prompt para criar
            const titulo = window.prompt('Título do pedido');
            if (!titulo) return;
            const descricao = window.prompt('Descrição');
            if (descricao == null) return;
            const validade = window.prompt('Validade (YYYY-MM-DD)');
            if (!validade) return;
            const condId = window.prompt('Condomínio ID');
            if (!condId) return;
            adicionarPedido({ titulo, descricao, validade_orcamentos: validade, condominio_id: condId });
          }}
        >
          Novo Pedido
        </button>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-muted">Nenhum pedido encontrado.</p>
      ) : (
        pedidos.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
