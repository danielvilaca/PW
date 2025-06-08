import React, { useState } from 'react';

/**
 * Modal para criar um novo pedido:
 *
 * Props:
 *  - visible: boolean - mostrar ou não
 *  - onClose: () => void
 *  - onCreate: ({ titulo, descricao, validade_orcamentos }) => void
 */
export default function PedidoFormModal({ visible, onClose, onCreate }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [validade, setValidade] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!titulo.trim() || !descricao.trim() || !validade) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }

    setSaving(true);
    try {
      await onCreate({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        validade_orcamentos: validade,
      });
      // limpa
      setTitulo('');
      setDescricao('');
      setValidade('');
      setSaving(false);
    } catch (err) {
      console.error('PedidoFormModal → erro ao criar:', err);
      setErrorMsg('Falha ao criar pedido. Veja console.');
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
            <h5 className="modal-title">Novo Pedido</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
            {errorMsg && (
              <div className="alert alert-danger py-1">{errorMsg}</div>
            )}
            <div className="mb-3">
              <label className="form-label">Título *</label>
              <input
                type="text"
                className="form-control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descrição *</label>
              <textarea
                className="form-control"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Validade de Orçamentos *</label>
              <input
                type="date"
                className="form-control"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                required
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
                {saving ? 'A criar…' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
