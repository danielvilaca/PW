import React from 'react';

/**
 * Exibe um pagamento em formato de card, com botões para marcar pago e excluir.
 *
 * Props:
 *   pagamento: {
 *     id,
 *     user_id,
 *     descricao,
 *     valor,
 *     data_pg,
 *     metodo,
 *     tipo,
 *     estado,
 *     comprovante_url,
 *     created_at
 *   }
 *   perfil - { role, user_id, … }
 *   inquilinos - [ { id, user_id, nome, email, … }, … ]
 *   onEdit(id, updates)
 *   onDelete(id)
 */
export default function PagamentoCard({
  pagamento,
  perfil,
  inquilinos,
  onEdit,
  onDelete,
}) {
  const isManager = perfil.role === 'admin' || perfil.role === 'senhorio';
  const isOwner = perfil.role === 'inquilino' && pagamento.user_id === perfil.user_id;

  const cliente = inquilinos?.find(i => i.user_id === pagamento.user_id);

  const handleMarkPaid = () => {
    onEdit(pagamento.id, { estado: 'pago' });
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        {isManager && cliente && (
          <h6 className="card-subtitle mb-2 text-muted">
            Inquilino: {cliente.nome} ({cliente.email})
          </h6>
        )}

        <h5 className="card-title">{pagamento.descricao}</h5>

        <p className="card-text">
          <strong>Valor:</strong> €{pagamento.valor.toFixed(2)}
        </p>
        <p className="card-text">
          <strong>Data:</strong> {new Date(pagamento.data_pg).toLocaleDateString()}
        </p>
        {pagamento.metodo && (
          <p className="card-text">
            <strong>Método:</strong> {pagamento.metodo}
          </p>
        )}
        {pagamento.tipo && (
          <p className="card-text">
            <strong>Tipo:</strong> {pagamento.tipo}
          </p>
        )}
        {pagamento.comprovante_url && (
          <p className="card-text">
            <strong>Comprovante:</strong>{' '}
            <a href={pagamento.comprovante_url} target="_blank" rel="noreferrer">
              Ver
            </a>
          </p>
        )}

        <p className="card-text text-muted">
          <small>
            Criado em: {new Date(pagamento.created_at).toLocaleString()}
          </small>
        </p>

        {(isManager || isOwner) && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={handleMarkPaid}
              disabled={pagamento.estado === 'pago'}
            >
              {pagamento.estado === 'pago' ? 'Pago' : 'Marcar pago'}
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(pagamento.id)}
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
