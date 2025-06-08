import React, { useState } from 'react';
import { createOrcamento } from '../api/orcamentos';
import { supabase } from '../services/supabaseClient';

export default function OrcamentoForm({ pedidoId, onFinish }) {
  const [fornecedor, setFornecedor] = useState('');
  const [contacto, setContacto] = useState('');
  const [valor, setValor] = useState('');
  const [anexoFile, setAnexoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const bucket = 'orcamentos-anexos';

  const handleFileChange = (e) => {
    setAnexoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fornecedor.trim() || !valor) {
      alert('Preencha ao menos fornecedor e valor.');
      return;
    }

    let anexo_url = null;

    if (anexoFile) {
      setUploading(true);
      const path = `${pedidoId}/${Date.now()}_${anexoFile.name}`;
      const { error: upErr } = await supabase
        .storage
        .from(bucket)
        .upload(path, anexoFile, { upsert: true });

      if (upErr) {
        console.error('Erro upload anexo:', upErr);
        alert('Falha ao enviar anexo.');
        setUploading(false);
        return;
      }

      const { data } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(path);
      anexo_url = data.publicUrl;
      setUploading(false);
    }

    try {
      await createOrcamento({
        pedido_id: pedidoId,
        fornecedor: fornecedor.trim(),
        contacto: contacto.trim(),
        valor: parseFloat(valor),
        anexo_url,
      });
      setFornecedor('');
      setContacto('');
      setValor('');
      setAnexoFile(null);
      onFinish(); // recarrega lista de orçamentos
    } catch (err) {
      console.error('Erro ao criar orçamento:', err);
      alert('Falha ao criar orçamento. Veja o console.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-3 rounded">
      <div className="mb-2">
        <label className="form-label">Fornecedor</label>
        <input
          type="text"
          className="form-control"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Contato</label>
        <input
          type="text"
          className="form-control"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Valor (€)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Anexo (opcional)</label>
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="submit"
        className="btn btn-outline-primary"
        disabled={uploading}
      >
        {uploading ? 'Enviando anexo…' : 'Enviar Orçamento'}
      </button>
    </form>
  );
}
