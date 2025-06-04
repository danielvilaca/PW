import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  fetchPagamentos,
  criarPagamento,
  eliminarPagamento,
} from '../api/pagamentos';
import { fetchTodosPerfis } from '../api/perfis';
import PagamentoCard from '../components/PagamentoCard';

export default function PagamentosPage() {
  const { user, perfil } = useAuth();
  const isAdmin = perfil?.role === 'admin';

  const [lista, setLista] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [utilizadores, setUtilizadores] = useState([]);
  const [uidAlvo, setUidAlvo] = useState('');

  /* pagamentos */
  useEffect(() => {
    if (!user) return;
    const carregar = async () => {
      const data = await fetchPagamentos(isAdmin, user.id);
      setLista(data);
    };
    carregar();
  }, [user, isAdmin]);

  /* dropdown perfis */
  useEffect(() => {
    if (isAdmin) fetchTodosPerfis().then(setUtilizadores);
  }, [isAdmin]);

  const adicionar = async (e) => {
    e.preventDefault();
    if (isAdmin && !uidAlvo) {
      alert('Escolhe o utilizador a quem pertence este pagamento.');
      return;
    }
    await criarPagamento({
      user_id: isAdmin ? uidAlvo : user.id,
      descricao,
      valor: Number(valor),
      estado: 'pendente',
    });
    setDescricao('');
    setValor('');
    setUidAlvo('');
    const data = await fetchPagamentos(isAdmin, user.id);
    setLista(data);
  };

  const remover = async (id) => {
    if (!window.confirm('Eliminar pagamento?')) return;
    await eliminarPagamento(id);
    const data = await fetchPagamentos(isAdmin, user.id);
    setLista(data);
  };

  const pagar = () => alert('A abrir métodos de pagamento… Pago!');

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Pagamentos de Renda</h1>

      {isAdmin && (
        <form
          onSubmit={adicionar}
          className="flex flex-wrap gap-2 items-end bg-white p-4 rounded shadow"
        >
          <select
            className="border p-2 rounded"
            value={uidAlvo}
            onChange={(e) => setUidAlvo(e.target.value)}
            required
          >
            <option value="" disabled>
              -- utilizador --
            </option>
            {utilizadores.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.nome || u.email}
              </option>
            ))}
          </select>

          <input
            className="border p-2 rounded flex-1"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            className="border p-2 rounded w-32"
            placeholder="Valor €"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />

          <button className="bg-blue-600 text-white px-4 rounded">
            Adicionar
          </button>
        </form>
      )}

      {lista.map((p) => (
        <PagamentoCard
          key={p.id}
          pg={p}
          isAdmin={isAdmin}
          onDelete={remover}
          onPay={pagar}
        />
      ))}
    </div>
  );
}
