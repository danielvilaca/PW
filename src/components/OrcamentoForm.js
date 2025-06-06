// src/components/OrcamentoForm.js

import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

/**
 * Formulário para submeter um orçamento.
 * Chama onSubmit({ fornecedor, contacto, valor, anexo_url }) ao enviar.
 */
export default function OrcamentoForm({ onSubmit }) {
  const [fornecedor, setFornecedor] = useState('');
  const [contacto, setContacto]     = useState('');
  const [valor, setValor]           = useState('');
  const [anexoUrl, setAnexoUrl]     = useState(null);
  const [uploading, setUploading]   = useState(false);

  // Faz upload direto no Supabase Storage no bucket "orcamentos"
  const handleUploadAnexo = async (file) => {
    if (!file) return null;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from('orcamentos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Erro no upload do anexo:', uploadError.message);
      alert('Falha ao enviar anexo.');
      setUploading(false);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from('orcamentos')
      .getPublicUrl(filePath);

    setUploading(false);
    return publicData.publicUrl;
  };

  const handleChangeFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await handleUploadAnexo(file);
    if (url) {
      setAnexoUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fornecedor || !contacto || !valor) {
      alert('Por favor preencha todos os campos obrigatórios.');
      return;
    }
    onSubmit({
      fornecedor,
      contacto,
      valor: Number(valor),
      anexo_url: anexoUrl,
    });
    setFornecedor('');
    setContacto('');
    setValor('');
    setAnexoUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mb-4 space-y-4">
      <div>
        <label className="form-label">Fornecedor / Empresa</label>
        <input
          type="text"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div>
        <label className="form-label">Contacto (telefone ou e-mail)</label>
        <input
          type="text"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div>
        <label className="form-label">Valor (€)</label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div>
        <label className="form-label">Anexo (foto do orçamento)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeFile}
          disabled={uploading}
          className="form-control"
        />
        {uploading && <p className="form-text text-muted">Fazendo upload…</p>}
        {anexoUrl && (
          <p className="form-text">
            Anexo carregado: <a href={anexoUrl} target="_blank" rel="noreferrer">Visualizar</a>
          </p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-success"
        disabled={uploading}
      >
        {uploading ? 'Enviando…' : 'Submeter Orçamento'}
      </button>
    </form>
  );
}
