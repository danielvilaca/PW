// src/components/PedidoFormModal.js

import React, { useState } from 'react';

export default function PedidoFormModal({ visible, onClose, onCreate }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [validade, setValidade] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate({
      titulo,
      descricao,
      validade_orcamentos: validade, // enviar no formato “YYYY-MM-DD”
    });
    // Limpa o form
    setTitulo('');
    setDescricao('');
    setValidade('');
  };

  if (!visible) return null;

  return (
    <div
      className="modal show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog">
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Novo Pedido</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-control"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Validade de Orçamentos</label>
              <input
                type="date"
                className="form-control"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
