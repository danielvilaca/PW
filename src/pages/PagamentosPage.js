// src/pages/PagamentosPage.js

import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  fetchPagamentos,
  createPagamento,
  updatePagamento,
  deletePagamento,
} from '../api/pagamentos';
import PagamentoForm from '../components/PagamentoForm';
import PagamentoCard from '../components/PagamentoCard';

export default function PagamentosPage() {
  const { perfil } = useAuth();
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading]       = useState(true);

  const carregarPagamentos = async () => {
    try {
      setLoading(true);
      const data = await fetchPagamentos();
      setPagamentos(data);
    } catch (err) {
      console.error('Erro ao buscar pagamentos:', err);
      alert('Falha ao carregar pagamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPagamentos();
  }, []);

  const handleCreate = async (payData) => {
    try {
      await createPagamento(payData);
      carregarPagamentos();
      alert('Pagamento criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar pagamento:', err);
      alert('Falha ao criar pagamento.');
    }
  };

  const handleEdit = async (id, updates) => {
    try {
      await updatePagamento(id, updates);
      setPagamentos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (err) {
      console.error('Erro ao editar pagamento:', err);
      alert('Falha ao atualizar pagamento.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este pagamento?')) return;
    try {
      await deletePagamento(id);
      setPagamentos((prev) => prev.filter((p) => p.id !== id));
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
        <PagamentoForm onSubmit={handleCreate} />
      </div>

      {pagamentos.length === 0 ? (
        <p className="text-muted">Nenhum pagamento encontrado.</p>
      ) : (
        pagamentos.map((p) => (
          <PagamentoCard
            key={p.id}
            pagamento={p}
            onEdit={handleEdit}
            onDelete={handleDelete}
            perfil={perfil}
          />
        ))
      )}
    </div>
  );
}
