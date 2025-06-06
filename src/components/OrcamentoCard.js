// src/components/OrcamentoCard.js

import { useState } from 'react';

/**
 * Exibe um orçamento em card, com ações de “Editar”, “Excluir” ou “Aprovar”
 * dependendo do perfil.
 *
 * Props:
 *   - orcamento: { id, fornecedor, contacto, valor, anexo_url, user_id, created_at, aprovado (opcional) }
 *   - onEdit(updates)  → função chamada para atualizar (fornecedor ou admin/senhorio)
 *   - onDelete()       → função chamada para excluir
 *   - onApprove()      → função chamada para aprovar (somente para senhorio/admin)
 *   - perfil: objeto do `AuthContext` (com perfil.role e perfil.user_id)
 */
export default function OrcamentoCard({ orcamento, onEdit, onDelete, onApprove, perfil }) {
  const [editMode, setEditMode] = useState(false);
  const [valorEdit, setValorEdit] = useState(orcamento.valor);
  const [fornecedorEdit, setFornecedorEdit] = useState(orcamento.fornecedor);
  const [contactoEdit, setContactoEdit] = useState(orcamento.contacto);

  const isFornecedor = perfil.user_id === orcamento.user_id;
  const isAdmin = perfil.role === 'admin';
  const isSenhorio = perfil.role === 'senhorio';

  const podeAprovar = (isSenhorio || isAdmin) && orcamento.estado !== 'Aprovado'; // ajuste conforme seu modelo
  const podeEditar = isFornecedor && orcamento.estado === 'Aberto';
  const podeExcluir = (isFornecedor && orcamento.estado === 'Aberto') || isAdmin;

  const handleSave = () => {
    if (!fornecedorEdit || !contactoEdit || !valorEdit) {
      alert('Preencha todos os campos.');
      return;
    }
    onEdit({ fornecedor: fornecedorEdit, contacto: contactoEdit, valor: Number(valorEdit) });
    setEditMode(false);
  };

  return (
    <div className="mb-4 p-4 bg-white rounded shadow border flex flex-col">
      {!editMode ? (
        <>
          <div className="flex justify-between">
            <div>
              <p><strong>Fornecedor:</strong> {orcamento.fornecedor}</p>
              <p><strong>Contacto:</strong> {orcamento.contacto}</p>
              <p><strong>Valor:</strong> €{orcamento.valor.toFixed(2)}</p>
              {orcamento.anexo_url && (
                <p>
                  <a
                    href={orcamento.anexo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver Anexo
                  </a>
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(orcamento.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {podeEditar && (
              <button
                onClick={() => setEditMode(true)}
                className="text-yellow-600 hover:underline"
              >
                Editar
              </button>
            )}
            {podeExcluir && (
              <button
                onClick={onDelete}
                className="text-red-600 hover:underline"
              >
                Excluir
              </button>
            )}
            {podeAprovar && (
              <button
                onClick={onApprove}
                className="text-green-600 hover:underline"
              >
                Aprovar
              </button>
            )}
          </div>
        </>
      ) : (
        // Modo edição
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Fornecedor</label>
            <input
              type="text"
              value={fornecedorEdit}
              onChange={(e) => setFornecedorEdit(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contacto</label>
            <input
              type="text"
              value={contactoEdit}
              onChange={(e) => setContactoEdit(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Valor (€)</label>
            <input
              type="number"
              step="0.01"
              value={valorEdit}
              onChange={(e) => setValorEdit(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
