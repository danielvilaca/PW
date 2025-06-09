import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { updateOrcamento, deleteOrcamento } from '../api/orcamentos';

/**
 * Apresenta um orçamento em modo “cartão”. Se o utilizador tiver permissão
 * (admin, senhorio, ou o próprio autor), mostra botões para editar/excluir.
 *
 * Props:
 *   - orc: {
 *       id: string,
 *       pedido_id: string,
 *       user_id: string,
 *       fornecedor: string,
 *       contacto: string,
 *       valor: number,
 *       anexo_url: string | null,
 *       nome: string,        // do perfil, via join em fetchOrcamentos
 *       foto_url: string,    // do perfil, via join em fetchOrcamentos
 *       created_at: string
 *     }
 */
export default function OrcamentoCard({ orc }) {
  const { perfil } = useAuth();
  const isAdmin = perfil?.role === 'admin';
  const isSenhorio = perfil?.role === 'senhorio';
  const isAutor = perfil?.user_id === orc.user_id;

  // Somente admin/senhorio/autor podem editar; somente admin/autor podem excluir
  const podeEditar = isAdmin || isAutor || isSenhorio;
  const podeExcluir = isAdmin || isAutor;

  const [editMode, setEditMode] = useState(false);
  const [fornecedor, setFornecedor] = useState(orc.fornecedor);
  const [contacto, setContacto] = useState(orc.contacto);
  const [valor, setValor] = useState(orc.valor);
  const [anexoUrl, setAnexoUrl] = useState(orc.anexo_url || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateOrcamento(orc.id, {
        fornecedor: fornecedor.trim(),
        contacto: contacto.trim(),
        valor: Number(valor),
        anexo_url: anexoUrl.trim() || null,
      });
      setEditMode(false);
    } catch (err) {
      console.error('Erro ao editar orçamento:', err);
      alert('Falha ao atualizar orçamento. Veja o console para detalhes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Eliminar este orçamento?')) return;
    try {
      await deleteOrcamento(orc.id);
      window.location.reload();
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err);
      alert('Falha ao excluir orçamento. Veja o console para detalhes.');
    }
  };

  if (!editMode) {
    return (
      <div className="card mb-2 p-2">
        <div className="d-flex">
          {/* Avatar do autor do orçamento */}
          <img
            src={orc.foto_url || 'https://placehold.co/40'}
            alt={orc.nome}
            className="rounded-circle me-2"
            width="40"
            height="40"
          />
          <div className="flex-grow-1">
            <p className="mb-1">
              <strong>Fornecedor:</strong> {orc.fornecedor}
            </p>
            <p className="mb-1">
              <strong>Contato:</strong> {orc.contacto}
            </p>
            <p className="mb-1">
              <strong>Valor:</strong> €{orc.valor.toFixed(2)}
            </p>
            {orc.anexo_url && (
              <p className="mb-1">
                <strong>Anexo:</strong>{' '}
                <a href={orc.anexo_url} target="_blank" rel="noreferrer">
                  Ver Documento
                </a>
              </p>
            )}
            <p className="text-muted small mb-0">
              Por: {orc.nome} em{' '}
              {new Date(orc.created_at).toLocaleString()}
            </p>
          </div>

          {/* Botões de ação apenas se tiver permissão */}
          {(podeEditar || podeExcluir) && (
            <div className="d-flex flex-column align-items-end gap-1">
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
                  onClick={handleDelete}
                >
                  Excluir
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="card p-2 mb-2">
      <div className="row g-2">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            placeholder="Fornecedor"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            placeholder="Contato"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Valor (€)"
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            value={anexoUrl}
            onChange={(e) => setAnexoUrl(e.target.value)}
            placeholder="URL Anexo (opcional)"
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-2">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setEditMode(false)}
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={saving}
        >
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
