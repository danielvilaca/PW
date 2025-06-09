import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  fetchPagamentos,
  createPagamento,
  updatePagamento,
  deletePagamento,
} from '../api/pagamentos';
import { fetchTodosPerfis } from '../api/perfis';
import PagamentoForm from '../components/PagamentoForm';
import PagamentoCard from '../components/PagamentoCard';

export default function PagamentosPage() {
  const { perfil } = useAuth();
  const [pagamentos, setPagamentos] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);
  const [loading, setLoading] = useState(true);

  const isManager = perfil?.role === 'admin' || perfil?.role === 'senhorio';

  // 1. Carregar lista de inquilinos (só para admin/senhorio)
  const loadInquilinos = async () => {
    if (!isManager) return;
    const todos = await fetchTodosPerfis();
    setInquilinos(todos.filter(p => p.role === 'inquilino'));
  };

  // 2. Carregar pagamentos
  const loadPagamentos = async () => {
    setLoading(true);
    try {
      const data = await fetchPagamentos({ adminParam: isManager });
      setPagamentos(data);
    } catch (err) {
      console.error('Erro ao procurar pagamentos:', err);
      alert('Falha ao carregar pagamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perfil) return;
    loadInquilinos();
    loadPagamentos();
  }, [perfil]);

  // 3. Handlers
  const handleCreate = async payData => {
    try {
      await createPagamento(payData);
      await loadPagamentos();
      alert('Pagamento criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar pagamento:', err);
      alert('Falha ao criar pagamento.');
    }
  };

  const handleEdit = async (id, updates) => {
    try {
      const updated = await updatePagamento(id, updates);
      setPagamentos(prev =>
        prev.map(p => (p.id === id ? updated : p))
      );
    } catch (err) {
      console.error('Erro ao editar pagamento:', err);
      alert('Falha ao atualizar pagamento.');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Deseja mesmo excluir esse pagamento?')) return;
    try {
      await deletePagamento(id);
      setPagamentos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erro ao excluir pagamento:', err);
      alert('Falha ao excluir pagamento.');
    }
  };

  if (loading) return <p>Carregando pagamentos…</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Pagamentos</h2>

      <div className="mb-4">
        <PagamentoForm
          onSubmit={handleCreate}
          perfil={perfil}
          inquilinos={inquilinos}
        />
      </div>

      {pagamentos.length === 0 ? (
        <p className="text-muted">Nenhum pagamento encontrado.</p>
      ) : (
        pagamentos.map(p => (
          <PagamentoCard
            key={p.id}
            pagamento={p}
            perfil={perfil}
            inquilinos={inquilinos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
