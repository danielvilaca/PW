// src/pages/PedidoDetailsPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidoById } from '../api/pedidos';         // (você pode precisar criar esta função em api/pedidos.js)
import { fetchOrcamentos, createOrcamento } from '../api/orcamentos';
import OrcamentoCard from '../components/OrcamentoCard';
import OrcamentoForm from '../components/OrcamentoForm';
import { useAuth } from '../auth/AuthContext';

export default function PedidoDetailsPage() {
  const { id } = useParams(); // id do pedido
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [pedido, setPedido] = useState(null);
  const [orcs, setOrcs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrcs, setLoadingOrcs] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dados = await getPedidoById(id); // você precisa implementar esta API
        setPedido(dados);
      } catch (err) {
        console.error('Erro ao procurar pedido:', err);
        alert('Falha ao carregar pedido.');
        return navigate('/pedidos');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  useEffect(() => {
    if (!pedido) return;
    (async () => {
      setLoadingOrcs(true);
      try {
        const lista = await fetchOrcamentos(pedido.id);
        setOrcs(lista);
      } catch (err) {
        console.error('Erro ao procurar orçamentos:', err);
      } finally {
        setLoadingOrcs(false);
      }
    })();
  }, [pedido]);

  if (loading) return <p>Carregando pedido…</p>;
  if (!pedido) return null;

  return (
    <div className="container my-4">
      <h2>Detalhes do Pedido</h2>
      <div className="card p-3 mb-4">
        <h4>{pedido.titulo}</h4>
        <p>{pedido.descricao}</p>
        <p><strong>Estado:</strong> {pedido.estado}</p>
        <p><strong>Validade orçamentos:</strong> {pedido.validade_orcamentos}</p>
        <p><strong>Criado em:</strong> {new Date(pedido.created_at).toLocaleString()}</p>
      </div>

      <div className="mb-3">
        <h5>Orçamentos</h5>
        {loadingOrcs ? (
          <p>Carregando orçamentos…</p>
        ) : (
          <>
            {orcs.length === 0 ? (
              <p className="text-muted">Nenhum orçamento enviado.</p>
            ) : (
              orcs.map((o) => <OrcamentoCard key={o.id} orc={o} />)
            )}
          </>
        )}
      </div>

      {perfil.role === 'inquilino' && new Date() < new Date(pedido.validade_orcamentos) && (
        <OrcamentoForm
          pedidoId={pedido.id}
          onFinish={async () => {
            setLoadingOrcs(true);
            try {
              const lista = await fetchOrcamentos(pedido.id);
              setOrcs(lista);
            } catch {}
            setLoadingOrcs(false);
          }}
        />
      )}
    </div>
  );
}
