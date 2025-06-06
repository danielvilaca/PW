// src/pages/PagamentosPage.js

import { useEffect, useState } from 'react';
import {
  fetchPagamentos,
  createPagamento,
  updatePagamento,
  deletePagamento,
} from '../api/pagamentos'; // trocar criarPagamento → createPagamento e eliminarPagamento → deletePagamento
import PagamentoCard from '../components/PagamentoCard';
import PagamentoForm from '../components/PagamentoForm';
import { useAuth } from '../auth/AuthContext';

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { perfil } = useAuth();

  useEffect(() => {
    async function loadPagamentos() {
      setLoading(true);
      const isAdmin = perfil.role === 'admin';
      const isSenhorio = perfil.role === 'senhorio';
      const data = await fetchPagamentos({ admin: isAdmin, isSenhorio });
      setPagamentos(data);
      setLoading(false);
    }
    if (perfil) loadPagamentos();
  }, [perfil]);

  const handleCriar = async (data) => {
    try {
      await createPagamento(data);
      const isAdmin = perfil.role === 'admin';
      const isSenhorio = perfil.role === 'senhorio';
      const updated = await fetchPagamentos({ admin: isAdmin, isSenhorio });
      setPagamentos(updated);
    } catch (err) {
      console.error('Erro ao criar pagamento:', err.message);
      alert('Falha ao criar pagamento. Veja o console.');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      await updatePagamento(id, updates);
      setPagamentos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (err) {
      console.error('Erro ao atualizar pagamento:', err.message);
      alert('Falha ao atualizar pagamento. Veja o console.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja mesmo excluir este pagamento?')) return;
    try {
      await deletePagamento(id);
      setPagamentos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Erro ao excluir pagamento:', err.message);
      alert('Falha ao excluir pagamento. Veja o console.');
    }
  };

  if (loading) return <div className="text-center my-5">Carregando…</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pagamentos</h2>
      {/* Form para criar pagamento */}
      <PagamentoForm onSubmit={handleCriar} />

      {pagamentos.map((pag) => (
        <PagamentoCard
          key={pag.id}
          pagamento={pag}
          onEdit={(updates) => handleUpdate(pag.id, updates)}
          onDelete={() => handleDelete(pag.id)}
          perfil={perfil}
        />
      ))}
    </div>
  );
}
