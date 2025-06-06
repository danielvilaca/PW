// src/components/PedidoCard.js

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import OrcamentoForm from './OrcamentoForm';
import OrcamentoCard from './OrcamentoCard';
import { fetchOrcamentos } from '../api/orcamentos';

export default function PedidoCard({ pedido, onEdit, onDelete }) {
  const { perfil } = useAuth();
  const isInquilino = perfil?.role === 'inquilino';

  const [expand, setExpand] = useState(false);
  const [orcs, setOrcs]     = useState([]);
  const [loadingOrcs, setLoadingOrcs] = useState(false);

  useEffect(() => {
    if (expand) {
      (async () => {
        setLoadingOrcs(true);
        try {
          const lista = await fetchOrcamentos(pedido.id);
          setOrcs(lista);
        } catch (err) {
          console.error('Erro ao carregar orçamentos:', err);
        } finally {
          setLoadingOrcs(false);
        }
      })();
    }
  }, [expand, pedido.id]);

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title">{pedido.titulo}</h5>
            <p className="text-muted">{pedido.descricao}</p>
            <p className="small text-secondary">Estado: {pedido.estado}</p>
            <p className="small text-secondary">Validade até: {pedido.validade_orcamentos}</p>
          </div>
          <button
            type="button"
            className="btn btn-link text-primary"
            onClick={() => setExpand(!expand)}
          >
            {expand ? 'Fechar Orçamentos' : 'Ver Orçamentos'}
          </button>
        </div>

        {expand && (
          <div className="mt-3">
            {loadingOrcs ? (
              <p>Carregando orçamentos…</p>
            ) : (
              <>
                <h6>Orçamentos</h6>
                {orcs.length === 0 ? (
                  <p className="text-muted small">Nenhum orçamento ainda.</p>
                ) : (
                  orcs.map((o) => <OrcamentoCard key={o.id} orc={o} />)
                )}
                {isInquilino && new Date() < new Date(pedido.validade_orcamentos) && (
                  <div className="mt-3">
                    <OrcamentoForm
                      pedidoId={pedido.id}
                      onFinish={async () => {
                        setLoadingOrcs(true);
                        try {
                          const lista = await fetchOrcamentos(pedido.id);
                          setOrcs(lista);
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setLoadingOrcs(false);
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {(perfil?.role === 'admin' || perfil?.role === 'senhorio') && (
          <div className="mt-3 d-flex gap-2">
            <button
              className="btn btn-outline-warning btn-sm"
              onClick={() => onEdit(pedido)}
            >
              Editar
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(pedido.id)}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
