// src/components/OrcamentoCard.js

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { updateOrcamento, deleteOrcamento } from '../api/orcamentos';

/**
 * Exibe um orçamento em formato de card, com botões para editar/excluir (se permitido).
 *
 * Props:
 *  - orc: {
 *      id: string,
 *      pedido_id: string,
 *      user_id: string,
 *      fornecedor: string,
 *      contacto: string,
 *      valor: number,
 *      anexo_url: string,
 *      created_at: string
 *    }
 */
export default function OrcamentoCard({ orc }) {
  const { perfil } = useAuth();
  const isAdmin    = perfil?.role === 'admin';
  const isSenhorio = perfil?.role === 'senhorio';
  const isAutor    = perfil?.user_id === orc.user_id;

  // Decide se pode editar/excluir:
  const podeEditar = isAdmin || isAutor || isSenhorio;
  const podeExcluir = isAdmin || isAutor;

  const [editMode, setEditMode] = useState(false);
  const [fornecedor, setFornecedor] = useState(orc.fornecedor);
  const [contacto, setContacto]     = useState(orc.contacto);
  const [valor, setValor]           = useState(orc.valor);
  const [anexoUrl, setAnexoUrl]     = useState(orc.anexo_url);
  const [saving, setSaving]         = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateOrcamento(orc.id, { fornecedor, contacto, valor: Number(valor), anexo_url: anexoUrl });
      setEditMode(false);
    } catch (err) {
      console.error('Erro ao editar orçamento:', err);
      alert('Falha ao atualizar orçamento. Veja console.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Eliminar este orçamento?')) return;
    try {
      await deleteOrcamento(orc.id);
      // Opcional: você pode disparar algo para remover este card da lista
      window.location.reload(); // solução básica: recarrega toda a página de pedidos
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err);
      alert('Falha ao excluir. Veja console.');
    }
  };

  if (!editMode) {
    return (
      <div className="card mb-2 p-2">
        <div className="d-flex justify-content-between">
          <div>
            <p><strong>Fornecedor:</strong> {orc.fornecedor}</p>
            <p><strong>Contacto:</strong> {orc.contacto}</p>
            <p><strong>Valor:</strong> €{orc.valor.toFixed(2)}</p>
            {orc.anexo_url && (
              <p>
                <strong>Anexo:</strong>{' '}
                <a href={orc.anexo_url} target="_blank" rel="noreferrer">Ver</a>
              </p>
            )}
            <p className="text-muted small">
              Criado em: {new Date(orc.created_at).toLocaleString()}
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

  // Modo edição
  return (
    <form onSubmit={handleSave} className="card p-2 mb-2">
      <div className="row g-2">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            value={anexoUrl}
            onChange={(e) => setAnexoUrl(e.target.value)}
            placeholder="URL Anexo"
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
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
