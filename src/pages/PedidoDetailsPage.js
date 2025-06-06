// src/pages/PedidoDetailsPage.js

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidoById, updatePedido } from '../api/pedidos';
import {
  fetchOrcamentos,
  createOrcamento,
  updateOrcamento,
  deleteOrcamento,
} from '../api/orcamentos';
import OrcamentoForm from '../components/OrcamentoForm';
import OrcamentoCard from '../components/OrcamentoCard';
import { useAuth } from '../auth/AuthContext';

export default function PedidoDetailsPage() {
  const { id: pedidoId } = useParams();
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [pedido, setPedido] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPedidoEOrcamentos = async () => {
    try {
      setLoading(true);
      const ped = await getPedidoById(pedidoId);
      setPedido(ped);

      const isAdmin = perfil?.role === 'admin';
      const isSenhorio = perfil?.role === 'senhorio';
      const orcs = await fetchOrcamentos({
        pedidoId,
        admin: isAdmin,
        isSenhorio,
      });
      setOrcamentos(orcs);
    } catch (err) {
      console.error('Erro ao carregar dados:', err.message);
      alert('Não foi possível carregar o pedido. Voltando à lista.');
      navigate('/pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (perfil) loadPedidoEOrcamentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidoId, perfil]);

  if (loading || !pedido) {
    return <div className="text-center my-5">Carregando…</div>;
  }

  const handleCreateOrcamento = async (data) => {
    try {
      await createOrcamento({ ...data, pedido_id: pedidoId });
      loadPedidoEOrcamentos();
    } catch (err) {
      console.error('Erro ao criar orçamento:', err.message);
      alert('Falha ao criar o orçamento. Veja o console.');
    }
  };

  const handleUpdateOrcamento = async (orcId, updates) => {
    try {
      await updateOrcamento(orcId, updates);
      loadPedidoEOrcamentos();
    } catch (err) {
      console.error('Erro ao atualizar orçamento:', err.message);
      alert('Falha ao atualizar. Veja o console.');
    }
  };

  const handleDeleteOrcamento = async (orcId) => {
    if (!window.confirm('Deseja mesmo excluir este orçamento?')) return;
    try {
      await deleteOrcamento(orcId);
      loadPedidoEOrcamentos();
    } catch (err) {
      console.error('Erro ao deletar orçamento:', err.message);
      alert('Falha ao deletar. Veja o console.');
    }
  };

  const handleAprovarOrcamento = async (orcId) => {
    if (!window.confirm('Aprovar este orçamento?')) return;
    try {
      await updatePedido(pedidoId, {
        chosen_orcamento_id: orcId,
        estado: 'Concluído',
      });
      loadPedidoEOrcamentos();
    } catch (err) {
      console.error('Erro ao aprovar orçamento:', err.message);
      alert('Falha ao aprovar. Veja o console.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ‹ Voltar aos Pedidos
      </button>

      <h2 className="text-2xl font-bold mb-2">Detalhes do Pedido</h2>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>
          <strong>Título:</strong> {pedido.titulo}
        </p>
        <p>
          <strong>Descrição:</strong> {pedido.descricao}
        </p>
        <p>
          <strong>Estado:</strong> {pedido.estado}
        </p>
        <p>
          <strong>Validade para Orçamentos:</strong>{' '}
          {new Date(pedido.validade_orcamentos).toLocaleDateString()}
        </p>
      </div>

      {pedido.estado === 'Aberto' && perfil.role === 'inquilino' && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Submeter Orçamento</h3>
          <OrcamentoForm onSubmit={handleCreateOrcamento} />
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">Orçamentos Enviados</h3>
      {orcamentos.length === 0 ? (
        <p className="text-gray-600">Nenhum orçamento submetido.</p>
      ) : (
        orcamentos.map((orc) => (
          <OrcamentoCard
            key={orc.id}
            orc={orc}
            perfil={perfil}
            onEdit={(updates) => handleUpdateOrcamento(orc.id, updates)}
            onDelete={() => handleDeleteOrcamento(orc.id)}
            onApprove={() => handleAprovarOrcamento(orc.id)}
          />
        ))
      )}
    </div>
  );
}
