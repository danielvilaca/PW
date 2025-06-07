import React, { useState, useEffect } from 'react';

export default function PagamentoForm({ onSubmit, perfil, inquilinos }) {
  const isManager = perfil.role === 'admin' || perfil.role === 'senhorio';

  // form fields
  const [userId, setUserId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataPg, setDataPg] = useState('');
  const [metodo, setMetodo] = useState('');
  const [tipo, setTipo] = useState('');

  // quando inquilinos mudam (após carregar), escolhe primeiro
  useEffect(() => {
    if (isManager && inquilinos.length) {
      setUserId(inquilinos[0].user_id);
    }
  }, [inquilinos, isManager]);

  const handleSubmit = e => {
    e.preventDefault();
    const payData = {
      descricao,
      valor: Number(valor),
      data_pg: dataPg,
      metodo,
      tipo: tipo || null,
    };
    if (isManager) payData.user_id = userId;
    onSubmit(payData);

    // reset
    setDescricao('');
    setValor('');
    setDataPg('');
    setMetodo('');
    setTipo('');
  };

  return (
    <form onSubmit={handleSubmit} className="row g-2 align-items-end">
      {isManager && (
        <div className="col-md">
          <label className="form-label">Inquilino</label>
          <select
            className="form-select"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            required
          >
            {inquilinos.map(i => (
              <option key={i.id} value={i.user_id}>
                {i.nome} ({i.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="col-md">
        <label className="form-label">Descrição</label>
        <input
          type="text"
          className="form-control"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
        />
      </div>

      <div className="col-md">
        <label className="form-label">Valor</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={valor}
          onChange={e => setValor(e.target.value)}
          required
        />
      </div>

      <div className="col-md">
        <label className="form-label">Data</label>
        <input
          type="date"
          className="form-control"
          value={dataPg}
          onChange={e => setDataPg(e.target.value)}
          required
        />
      </div>

      <div className="col-md">
        <label className="form-label">Método</label>
        <input
          type="text"
          className="form-control"
          value={metodo}
          onChange={e => setMetodo(e.target.value)}
          required
        />
      </div>

      <div className="col-md">
        <label className="form-label">Tipo</label>
        <input
          type="text"
          className="form-control"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
        />
      </div>

      <div className="col-auto">
        <button type="submit" className="btn btn-primary">
          Criar
        </button>
      </div>
    </form>
  );
}
