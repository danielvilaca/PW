import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  fetchPedidos,
  criarPedido,
  updatePedido,
  deletePedido,
} from '../api/pedidos';
import PedidoCard from '../components/PedidoCard';
import PedidoFormModal from '../components/PedidoFormModal';

export default function PedidosPage() {
  const { perfil } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // 1. Carrega TODOS os pedidos e, se for inquilino,
  //    filtra apenas os não-vencidos; se for admin/senhorio,
  //    mostra tudo (inclusive vencidos).
  const loadPedidos = async () => {
    setLoading(true);
    try {
      const data = await fetchPedidos(); // já traz todos ou apenas do próprio, conforme a role
      if (perfil.role === 'admin' || perfil.role === 'senhorio') {
        // Admin e Senhorio veem todos, sem filtro de validade
        setPedidos(data);
      } else {
        // Inquilino vê apenas os não-vencidos
        const hoje = new Date();
        const validos = data.filter(
          (p) => new Date(p.validade_orcamentos) >= hoje
        );
        setPedidos(validos);
      }
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // sempre que a página montar (ou perfil mudar), recarrega
    if (perfil) {
      loadPedidos();
    }
  }, [perfil]);

  // 2. Callback para criar um novo pedido (vindo do Modal)
  const handleCreate = async (novoPedido) => {
    try {
      await criarPedido({ ...novoPedido, estado: 'Aberto' });
      await loadPedidos();
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      alert('Falha ao criar pedido. Veja o console.');
    }
  };

  // 3. Callback para editar (usa prompt por enquanto)
  const handleEdit = async (pedido) => {
    const novoTitulo = prompt('Título do pedido', pedido.titulo);
    if (!novoTitulo) return;
    try {
      await updatePedido(pedido.id, { titulo: novoTitulo });
      await loadPedidos();
    } catch (err) {
      console.error('Erro ao editar pedido:', err);
      alert('Falha ao editar. Veja o console.');
    }
  };

  // 4. Callback para deletar
  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este pedido?')) return;
    try {
      await deletePedido(id);
      await loadPedidos();
    } catch (err) {
      console.error('Erro ao eliminar pedido:', err);
      alert('Falha ao eliminar. Veja o console.');
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Pedidos de Reparação</h2>

        {/* Botão “Novo Pedido” só para admin e senhorio */}
        {(perfil.role === 'admin' || perfil.role === 'senhorio') && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Novo Pedido
          </button>
        )}
      </div>

      {loading ? (
        <p>Carregando pedidos…</p>
      ) : pedidos.length === 0 ? (
        <p className="text-muted">
          {/* Mensagem genérica mesmo que tenha algum vencido (se for inquilino) */}
          Nenhum pedido válido encontrado.
        </p>
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

      {/* Modal de criação de novo pedido */}
      <PedidoFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
