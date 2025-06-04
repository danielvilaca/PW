import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { fetchPagamentos } from '../api/pagamentos';
import PagamentoCard from '../components/PagamentoCard';

export default function PagamentoRendaPage() {
  const { user, perfil } = useAuth();
  const isAdmin = perfil?.role === 'admin';

  const [pagamentos, setPagamentos] = useState([]);

  useEffect(() => {
    if (!user) return;
    const carregar = async () => {
      const data = await fetchPagamentos(isAdmin, user.id);
      setPagamentos(data);
    };
    carregar();
  }, [user, isAdmin]);

  const remover = () => {};
  const pagar = () => alert('A abrir métodos de pagamento… Pago!');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pagamentos de Renda</h1>

      {pagamentos.map((p) => (
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
