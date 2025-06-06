// src/pages/FaturasPage.js

import React, { useEffect, useState } from 'react';
import {
  fetchFaturas,
  createFatura,
  updateFatura,
  deleteFatura,
  getFaturaById,
} from '../api/faturas';
import { useAuth } from '../auth/AuthContext';
import FaturaCard from '../components/FaturaCard';
import { FaturasPDF } from '../components/FaturasPDF'; // vamos criar este componente abaixo

export default function FaturasPage() {
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { perfil } = useAuth();

  const carregarFaturas = async () => {
    try {
      setLoading(true);
      const data = await fetchFaturas();
      setFaturas(data);
    } catch (err) {
      console.error('Erro ao buscar faturas:', err);
      alert('Erro ao carregar faturas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFaturas();
  }, []);

  const handlePagar = async (id) => {
    try {
      const f = await updateFatura(id, { pago: true });
      setFaturas((prev) =>
        prev.map((item) => (item.id === id ? { ...item, pago: true } : item))
      );
    } catch (err) {
      console.error('Erro ao pagar fatura:', err);
      alert('Falha ao marcar como paga.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar esta fatura?')) return;
    try {
      await deleteFatura(id);
      setFaturas((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Erro ao eliminar fatura:', err);
      alert('Falha ao excluir.');
    }
  };

  const handleCreate = async () => {
    // Exemplo simples de prompt para criar fatura:
    const ano = Number(window.prompt('Ano da fatura (ex: 2025)'));
    if (!ano) return;
    const mes = Number(window.prompt('Mês da fatura (1-12)'));
    if (!mes) return;
    const valor = Number(window.prompt('Valor (€)'));
    if (!valor) return;
    const condId = window.prompt('Condomínio ID');
    if (!condId) return;

    try {
      await createFatura({ ano, mes, valor, condominio_id: condId });
      carregarFaturas();
    } catch (err) {
      console.error('Erro ao criar fatura:', err);
      alert('Falha ao criar fatura.');
    }
  };

  if (loading) return <p>Carregando faturas…</p>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Faturas</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          Nova Fatura
        </button>
        <FaturasPDF faturas={faturas}>
          {({ loading }) => (
            <button className="btn btn-outline-secondary">
              {loading ? 'Gerando PDF…' : 'Extrato PDF'}
            </button>
          )}
        </FaturasPDF>
      </div>
      <div>
        {faturas.length === 0 ? (
          <p className="text-muted">Nenhuma fatura disponível.</p>
        ) : (
          faturas.map((f) => (
            <FaturaCard key={f.id} fatura={f} onPay={handlePagar} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
