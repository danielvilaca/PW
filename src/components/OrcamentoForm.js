import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { createOrcamento } from '../api/orcamentos';

const bucket = 'orcamentos-anexos';

export default function OrcamentoForm({ pedidoId, onFinish }) {
  const [valor, setValor] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let anexo_url = null;
    if (file) {
      const path = `${pedidoId}-${Date.now()}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (!error) {
        anexo_url = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      }
    }
    await createOrcamento({ pedido_id: pedidoId, valor, anexo_url });
    setUploading(false);
    setValor('');
    setFile(null);
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 bg-light border-0 shadow-sm mb-3">
      <div className="mb-3">
        <label className="form-label">Valor (€)</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="form-control"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Anexo (opcional)</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="form-control"
        />
      </div>
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-success"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" /> A enviar...
            </>
          ) : 'Submeter orçamento'}
        </button>
      </div>
    </form>
  );
}
