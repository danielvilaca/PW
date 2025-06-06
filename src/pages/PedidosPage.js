// src/pages/PedidosPage.js
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

  const loadPedidos = async () => {
    setLoading(true);
    try {
      const data = await fetchPedidos();
      // Filtra apenas os que NÃO expiraram, exceto para admin/senhorio queremos listar tudo?
      // Mas requisito: “É suposto o Inquilino ver todos os pedidos que estiverem dentro do prazo”.
      // Como admin/senhorio devem ver tudo (válido ou expirado)? Vamos assumir que sim:
      const hoje = new Date();

      let validos;
      if (perfil.role === 'admin' || perfil.role === 'senhorio') {
        validos = data; // sem filtro, veem tudo
      } else {
        validos = data.filter((p) => new Date(p.validade_orcamentos) >= hoje);
      }

      setPedidos(validos);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [perfil]);

  // Criar novo pedido
  const handleCreate = async (novoPedido) => {
    try {
      // novoPedido já contém: { titulo, descricao, validade_orcamentos }
      await criarPedido(novoPedido);
      await loadPedidos();
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      alert('Falha ao criar pedido. Veja o console.');
    }
  };

  // Editar (via prompt, só alteramos título para simplificar)
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

  // Deletar
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

        {/* Botão “Novo Pedido” para admin, senhorio e INQUILINO */}
        {(perfil.role === 'admin' ||
          perfil.role === 'senhorio' ||
          perfil.role === 'inquilino') && (
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
        <p className="text-muted">Nenhum pedido válido encontrado.</p>
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

      {/* Modal de criação */}
      <PedidoFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
