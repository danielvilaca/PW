// src/components/OrcamentoForm.js

import { useState } from 'react';
import { createOrcamento } from '../api/orcamentos';

/**
 * Formulário para enviar um novo orçamento a um pedido.
 *
 * Props:
 *  - pedidoId: string       // ID do pedido ao qual vamos associar
 *  - onFinish(): Promise    // callback após envio bem-sucedido (para recarregar lista)
 */
export default function OrcamentoForm({ pedidoId, onFinish }) {
  const [fornecedor, setFornecedor] = useState('');
  const [contacto, setContacto]     = useState('');
  const [valor, setValor]           = useState('');
  const [anexoUrl, setAnexoUrl]     = useState('');
  const [saving, setSaving]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fornecedor || !contacto || !valor) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      await createOrcamento({
        pedido_id: pedidoId,
        fornecedor,
        contacto,
        valor: Number(valor),
        anexo_url: anexoUrl,
      });
      setFornecedor('');
      setContacto('');
      setValor('');
      setAnexoUrl('');
      if (onFinish) await onFinish();
    } catch (err) {
      console.error('Erro ao criar orçamento:', err);
      alert('Falha ao enviar orçamento. Veja console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Fornecedor*"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Contacto*"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="row g-2 mt-2">
        <div className="col-md-6">
          <input
            type="number"
            step="0.01"
            className="form-control"
            placeholder="Valor (€)*"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="URL do anexo (opcional)"
            value={anexoUrl}
            onChange={(e) => setAnexoUrl(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-secondary btn-sm mt-2"
        disabled={saving}
      >
        {saving ? 'Enviando…' : 'Enviar Orçamento'}
      </button>
    </form>
  );
}
