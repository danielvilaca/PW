import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { createOrcamento } from '../api/orcamentos';

const bucket = 'orcamentos-anexos';

export default function OrcamentoForm({ pedidoId, onFinish }) {
  const [valor, setValor] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let anexo_url = null;
    if (file) {
      const path = `${pedidoId}-${Date.now()}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (!error) {
        anexo_url = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      }
    }
    await createOrcamento({ pedido_id: pedidoId, valor, anexo_url });
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor (€)" className="w-full border p-2 rounded" required />
      <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button className="bg-green-600 text-white px-3 py-1 rounded">Submeter orçamento</button>
    </form>
  );
}
