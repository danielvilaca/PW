import { useEffect, useState } from 'react';
import { fetchFaturas, pagarFatura } from '../api/faturas';
import FaturaCard from '../components/FaturaCard';

export default function PagamentoRendaPage() {
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    setFaturas(await fetchFaturas());
  };

  const handlePay = async (id) => {
    setLoading(true);
    try {
      await pagarFatura(id);
      await carregar();
    } catch (err) {
      alert('Falha no pagamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pagamentos de Renda</h1>
      {loading && <p className="text-sm text-gray-500 mb-2">a processar…</p>}
      {faturas.map(f => (
        <FaturaCard key={f.id} fatura={f} onPay={handlePay} />
      ))}
    </div>
  );
}
