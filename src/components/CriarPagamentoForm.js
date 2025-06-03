import { useState } from 'react';
import { criarPagamento } from '../api/pagamentos';
import { supabase } from '../services/supabaseClient';

export default function CriarPagamentoForm({ onCreated }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('renda');
  const [metodo, setMetodo] = useState('');
  const [estado, setEstado] = useState('pendente');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;

    try {
      await criarPagamento({
        user_id: user.id,
        descricao,
        tipo,
        valor: parseFloat(valor),
        data_pg: new Date().toISOString().slice(0, 10),
        estado,
        metodo,
      });
      alert('Pagamento criado com sucesso!');
      setDescricao('');
      setValor('');
      setTipo('renda');
      setMetodo('');
      setEstado('pendente');
      if (onCreated) onCreated();
    } catch (err) {
      alert('Erro ao criar pagamento: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <input
          className="form-control"
          placeholder="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="renda">Renda</option>
          <option value="agua">Água</option>
          <option value="luz">Luz</option>
          <option value="internet">Internet</option>
          <option value="outro">Outro</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Valor (€)</label>
        <input
          className="form-control"
          placeholder="Valor (€)"
          type="number"
          step="0.01"
          value={valor}
          onChange={e => setValor(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Método</label>
        <input
          className="form-control"
          placeholder="Método (ex: MB, Transferência)"
          value={metodo}
          onChange={e => setMetodo(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Estado</label>
        <select className="form-select" value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
        </select>
      </div>
      <button type="submit" className="btn btn-success">
        Criar Pagamento
      </button>
    </form>
  );
}
