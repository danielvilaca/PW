// src/components/PagamentoCard.js

import { useState } from 'react';
import PagamentoForm from './PagamentoForm';

/**
 * Exibe um pagamento em formato de card, com botões para editar e excluir.
 *
 * Props:
 *  - pagamento: {
 *      id,
 *      user_id,
 *      condominio_id,
 *      descricao,
 *      valor,
 *      data_pg,
 *      metodo,
 *      tipo,
 *      estado,
 *      comprovante_url,
 *      created_at
 *    }
 *  - onEdit(id, updates) → função chamada ao salvar edição
 *  - onDelete(id)      → função chamada ao excluir
 *  - perfil            → objeto { role, user_id, … }
 */
export default function PagamentoCard({ pagamento, onEdit, onDelete, perfil }) {
  const [editMode, setEditMode] = useState(false);

  const isInquilino = perfil.role === 'inquilino';
  const isSenhorio = perfil.role === 'senhorio';
  const isAdmin    = perfil.role === 'admin';

  // Permite editar se: admin OR (senhorio e pertence ao seu condomínio) OR (inquilino e é próprio user_id)
  const podeEditar =
    isAdmin ||
    (isSenhorio && pagamento.condominio_id /* RLS já garante que pertence */) ||
    (isInquilino && perfil.user_id === pagamento.user_id);

  // Permite excluir se: admin OR (senhorio e pertence) OR (inquilino e próprio)
  const podeExcluir = podeEditar;

  const handleSave = (updates) => {
    onEdit(pagamento.id, updates);
    setEditMode(false);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {!editMode ? (
          <>
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">Pagamento #{pagamento.id}</h5>
                <p className="card-text">
                  <strong>Descrição:</strong> {pagamento.descricao}
                </p>
                <p className="card-text">
                  <strong>Valor:</strong> €{pagamento.valor.toFixed(2)}
                </p>
                <p className="card-text">
                  <strong>Data de Pagamento:</strong>{' '}
                  {new Date(pagamento.data_pg).toLocaleDateString()}
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
                    <a
                      href={pagamento.comprovante_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver Comprovante
                    </a>
                  </p>
                )}
                <p className="card-text text-muted">
                  <small>Criado em: {new Date(pagamento.created_at).toLocaleString()}</small>
                </p>
              </div>

              {(podeEditar || podeExcluir) && (
                <div className="d-flex flex-column align-items-end gap-2">
                  {podeEditar && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setEditMode(true)}
                    >
                      Editar
                    </button>
                  )}
                  {podeExcluir && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(pagamento.id)}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          // Modo edição: exibe PagamentoForm com dados iniciais
          <PagamentoForm
            initialData={{
              id: pagamento.id,
              condominio_id: pagamento.condominio_id,
              descricao: pagamento.descricao,
              valor: pagamento.valor,
              data_pg: pagamento.data_pg,
              metodo: pagamento.metodo,
              tipo: pagamento.tipo,
            }}
            onSubmit={handleSave}
          />
        )}
      </div>
    </div>
  );
}
