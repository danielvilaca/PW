import React, { useState } from 'react';
import { createOrcamento } from '../api/orcamentos';

/**
 * Modal simples para inserir um novo orçamento
 *
 * Props:
 *  - visible: boolean - se deve mostrar ou não o modal
 *  - onClose: () => void- callback para fechar o modal
 *  - pedidoId: string - ID (PK) do pedido ao qual associar o orçamento
 *  - onFinish: () => void - callback a chamar após criar com sucesso (para recarregar lista)
 */
export default function OrcamentoFormModal({ visible, onClose, pedidoId, onFinish }) {
  const [fornecedor, setFornecedor] = useState('');
  const [contacto, setContacto] = useState('');
  const [valor, setValor] = useState('');
  const [anexoUrl, setAnexoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    // Validações
    if (!fornecedor.trim() || !contacto.trim() || !valor) {
      setErrorMsg('Preencha todos os campos obrigatórios.');
      setSaving(false);
      return;
    }

    try {
      await createOrcamento({
        pedido_id: pedidoId,
        fornecedor: fornecedor.trim(),
        contacto: contacto.trim(),
        valor: parseFloat(valor),
        anexo_url: anexoUrl.trim() || null,
      });

      setFornecedor('');
      setContacto('');
      setValor('');
      setAnexoUrl('');
      setSaving(false);
      onFinish?.();    // dispara callback do pai para recarregar listagem
      onClose?.();
    } catch (err) {
      console.error('Erro ao criar orçamento:', err);
      setErrorMsg('Falha ao criar orçamento. Veja console.');
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Novo Orçamento</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
            {errorMsg && (
              <div className="alert alert-danger py-1" role="alert">
                {errorMsg}
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Fornecedor *</label>
              <input
                type="text"
                className="form-control"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contacto *</label>
              <input
                type="text"
                className="form-control"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Valor (€) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Anexo (URL)</label>
              <input
                type="url"
                className="form-control"
                value={anexoUrl}
                onChange={(e) => setAnexoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'A Guardar…' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
