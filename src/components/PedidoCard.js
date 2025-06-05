import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import OrcamentoForm from './OrcamentoForm';
import OrcamentoCard from './OrcamentoCard';
import { fetchOrcamentos } from '../api/orcamentos';

const PedidoCard = ({ pedido, onEdit, onDelete }) => {
  const { perfil } = useAuth();
  const isInquilino = perfil?.role === 'inquilino';

  const [expand, setExpand] = useState(false);
  const [orcs, setOrcs] = useState([]);

  useEffect(() => {
    if (expand) fetchOrcamentos(pedido.id).then(setOrcs);
  }, [expand, pedido.id]);

  return (
    <div className="card mb-3 shadow-sm border">
      <div className="card-body pb-2">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">{pedido.titulo}</h5>
            <p className="card-text text-muted small mb-0">{pedido.descricao}</p>
          </div>
          <button
            type="button"
            onClick={() => setExpand(!expand)}
            className="btn btn-link text-primary text-decoration-none ps-2"
            tabIndex={0}
          >
            {expand ? (
              <>
                Fechar <i className="bi bi-chevron-up"></i>
              </>
            ) : (
              <>
                Detalhes <i className="bi bi-chevron-down"></i>
              </>
            )}
          </button>
        </div>

        {expand && (
          <div className="mt-3">
            <p className="text-muted small mb-2">
              <strong>Validade:</strong> {pedido.validade_orcamentos}
            </p>

            <h6 className="fw-semibold mb-2">Orçamentos</h6>
            <div className="mb-2">
              {orcs.length === 0 && (
                <span className="text-muted small">Nenhum orçamento ainda.</span>
              )}
              {orcs.map((o) => (
                <OrcamentoCard key={o.id} orc={o} />
              ))}
            </div>

            {isInquilino &&
              new Date() < new Date(pedido.validade_orcamentos) && (
                <div className="mt-3">
                  <OrcamentoForm
                    pedidoId={pedido.id}
                    onFinish={() => fetchOrcamentos(pedido.id).then(setOrcs)}
                  />
                </div>
              )}
          </div>
        )}

        {(perfil?.role === 'admin' || perfil?.role === 'senhorio') && (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidoCard;

