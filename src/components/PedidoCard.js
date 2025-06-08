import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import OrcamentoCard from './OrcamentoCard';
import { fetchOrcamentos } from '../api/orcamentos';
import PedidoFormModal from './PedidoFormModal';
import OrcamentoFormModal from './OrcamentoFormModal';

const PedidoCard = ({ pedido, onEdit, onDelete }) => {
  const { perfil } = useAuth();
  const isInquilino = perfil?.role === 'inquilino';

  const [expand, setExpand] = useState(false);
  const [orcs, setOrcs] = useState([]);
  const [loadingOrcs, setLoadingOrcs] = useState(false);

  const [showOrcModal, setShowOrcModal] = useState(false);

  useEffect(() => {
    if (!expand) return;
    (async () => {
      try {
        setLoadingOrcs(true);
        const data = await fetchOrcamentos(pedido.id);
        setOrcs(data);
      } catch (err) {
        console.error('Erro ao carregar orçamentos:', err);
      } finally {
        setLoadingOrcs(false);
      }
    })();
  }, [expand, pedido.id]);

  // Callback para a lista de orçamentos
  const refetchOrcs = async () => {
    try {
      setLoadingOrcs(true);
      const data = await fetchOrcamentos(pedido.id);
      setOrcs(data);
    } catch (err) {
      console.error('Erro ao recarregar orçamentos:', err);
    } finally {
      setLoadingOrcs(false);
    }
  };

  return (
    <div className="card mb-3 shadow-sm border">
      <div className="card-body pb-2">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">{pedido.titulo}</h5>
            <p className="card-text text-muted small mb-0">{pedido.descricao}</p>
            <p className="text-sm text-gray-600">
              Estado: {pedido.estado} <br />
              Validade até: {pedido.validade_orcamentos}
            </p>
          </div>

          <div className="d-flex flex-column gap-1">
            <button
              type="button"
              onClick={() => setExpand((prev) => !prev)}
              className="btn btn-link text-primary ps-2"
            >
              {expand ? (
                <>
                  Fechar <i className="bi bi-chevron-up"></i>
                </>
              ) : (
                <>
                  Orçamentos <i className="bi bi-chevron-down"></i>
                </>
              )}
            </button>

            {/* Botão “Adicionar Orçamento” (só inquilinos, enquanto estiver válido) */}
            {isInquilino && expand && new Date() < new Date(pedido.validade_orcamentos) && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-1"
                onClick={() => setShowOrcModal(true)}
              >
                Adicionar Orçamento
              </button>
            )}
          </div>
        </div>

        {expand && (
          <div className="mt-3">
            <h6 className="fw-semibold mb-2">Orçamentos</h6>
            {loadingOrcs ? (
              <div className="text-muted small">Carregando orçamentos…</div>
            ) : orcs.length === 0 ? (
              <span className="text-muted small">Nenhum orçamento ainda.</span>
            ) : (
              orcs.map((o) => (
                <OrcamentoCard key={o.id} orc={o} />
              ))
            )}
          </div>
        )}

        <div className="d-flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => onEdit(pedido)}
            className="btn btn-outline-warning btn-sm"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(pedido.id)}
            className="btn btn-outline-danger btn-sm"
          >
            Eliminar
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {/* modal de OrcamentoForm */}}
          >
            Adicionar Orçamento
          </button>
        </div>
      </div>

      {/* Modal de “Novo Orçamento” */}
      <OrcamentoFormModal
        visible={showOrcModal}
        onClose={() => setShowOrcModal(false)}
        pedidoId={pedido.id}
        onFinish={refetchOrcs}
      />
    </div>
  );
};

export default PedidoCard;
