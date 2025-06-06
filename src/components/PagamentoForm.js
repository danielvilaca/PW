// src/components/PagamentoForm.js

import { useState } from 'react';

/**
 * Formulário para criar/editar um pagamento.
 * Chama onSubmit({ condominio_id, descricao, valor, data_pg, metodo, tipo }) ao enviar.
 *
 * Props:
 *  - onSubmit(data)     → função chamada ao submeter o formulário
 *  - initialData (opcional) → objeto com valores iniciais (para edição)
 */
export default function PagamentoForm({ onSubmit, initialData = {} }) {
  const [condominioId, setCondominioId] = useState(initialData.condominio_id || '');
  const [descricao, setDescricao]       = useState(initialData.descricao || '');
  const [valor, setValor]               = useState(initialData.valor || '');
  const [dataPg, setDataPg]             = useState(
    initialData.data_pg
      ? initialData.data_pg.slice(0, 10)
      : ''
  );
  const [metodo, setMetodo]             = useState(initialData.metodo || '');
  const [tipo, setTipo]                 = useState(initialData.tipo || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!condominioId || !descricao || !valor || !dataPg) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onSubmit({
      condominio_id: condominioId,
      descricao,
      valor: Number(valor),
      data_pg: dataPg,
      metodo,
      tipo,
    });
    // limpa somente se for formulário de criação (sem initialData)
    if (!initialData.id) {
      setCondominioId('');
      setDescricao('');
      setValor('');
      setDataPg('');
      setMetodo('');
      setTipo('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row g-2">
        <div className="col-md-4">
          <label className="form-label">Condomínio ID*</label>
          <input
            type="text"
            className="form-control"
            value={condominioId}
            onChange={(e) => setCondominioId(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Descrição*</label>
          <input
            type="text"
            className="form-control"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Valor (€)*</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="row g-2 mt-3">
        <div className="col-md-4">
          <label className="form-label">Data de Pagamento*</label>
          <input
            type="date"
            className="form-control"
            value={dataPg}
            onChange={(e) => setDataPg(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Método</label>
          <input
            type="text"
            className="form-control"
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
            placeholder="ex.: Transferência"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Tipo</label>
          <input
            type="text"
            className="form-control"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="ex.: Renda, Água"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-3">
        {initialData.id ? 'Salvar Alterações' : 'Criar Pagamento'}
      </button>
    </form>
  );
}
