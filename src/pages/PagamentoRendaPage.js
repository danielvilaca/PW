import { useEffect, useState } from 'react';
import { fetchPagamentos } from '../api/pagamentos';
import PagamentoCard from '../components/PagamentoCard'; // substitui FaturaCard por este

export default function PagamentoRendaPage() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await fetchPagamentos();
      setPagamentos(data);
    } catch (err) {
      console.error('Erro ao carregar pagamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

 return (
  <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Pagamentos de Renda</h1>
    {loading && <p className="text-sm text-gray-500 mb-2">A processar…</p>}
    
    {pagamentos.map(p => (
      <PagamentoCard key={p.id} pg={p} />
    ))}
  </div>
);


}
