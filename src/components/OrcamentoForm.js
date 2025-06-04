import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { createOrcamento } from '../api/orcamentos';
import { useAuth } from '../auth/AuthContext';

const BUCKET = 'orcamentos-anexos';

export default function OrcamentoForm({ pedidoId, onFinish }) {
  const { user } = useAuth();

  const [fornecedor, setFornecedor] = useState('');
  const [contacto, setContacto]     = useState('');
  const [valor, setValor]           = useState('');
  const [file, setFile]             = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let anexo_url = null;
    if (file) {
      const path = `${pedidoId}-${Date.now()}-${file.name}`;
      const { error } = await supabase
        .storage
        .from(BUCKET)
        .upload(path, file, { upsert: true });

      if (error) throw error;

      anexo_url = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(path).data.publicUrl;
    }

    await createOrcamento({
      pedido_id : pedidoId,
      user_id   : user.id,
      fornecedor,
      contacto,
      valor: Number(valor),
      anexo_url,
    });

    onFinish();
    setFornecedor('');
    setContacto('');
    setValor('');
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border p-3 rounded">
      <input
        className="w-full border p-2 rounded"
        placeholder="Fornecedor"
        value={fornecedor}
        onChange={(e) => setFornecedor(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Contacto"
        value={contacto}
        onChange={(e) => setContacto(e.target.value)}
        required
      />
      <input
        type="number"
        step="0.01"
        className="w-full border p-2 rounded"
        placeholder="Valor (€)"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="bg-green-600 text-white px-3 py-1 rounded">
        Submeter orçamento
      </button>
    </form>
  );
}
