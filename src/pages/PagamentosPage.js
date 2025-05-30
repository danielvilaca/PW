import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { fetchPagamentos, criarPagamento, eliminarPagamento } from '../api/pagamentos';
import PagamentoCard from '../components/PagamentoCard';

export default function PagamentosPage() {
  const { user, perfil } = useAuth();
  const isAdmin = perfil?.role === 'admin';
  const [lista, setLista] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  const carregar = async () => {
    const data = await fetchPagamentos(isAdmin, user.id);
    setLista(data);
  };

  useEffect(() => { if (user) carregar(); }, [user]);

  const adicionar = async (e) => {
    e.preventDefault();
    await criarPagamento({
      user_id: user.id,
      descricao,
      valor: Number(valor),
      estado: 'pendente',
    });
    setDescricao('');
    setValor('');
    carregar();
  };

  const remover = async (id) => {
    if (!window.confirm('Eliminar pagamento?')) return;
    await eliminarPagamento(id);
    carregar();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-bold">Pagamentos</h2>

      <form onSubmit={adicionar} className="flex gap-2">
        <input
          placeholder="Descrição"
          className="border p-2 flex-grow rounded"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor €"
          className="border p-2 w-32 rounded"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">Adicionar</button>
      </form>

      {lista.map((p) => (
        <PagamentoCard key={p.id} pg={p} onDelete={remover} />
      ))}
    </div>
  );
}
