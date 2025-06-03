import { useEffect, useState } from 'react';
import { fetchFaturas, pagarFatura } from '../api/faturas';
import FaturaCard from '../components/FaturaCard';

export default function FaturasPage() {
  const [faturas, setFaturas] = useState([]);

  const carregarFaturas = async () => {
    try {
      const dados = await fetchFaturas();
      setFaturas(dados);
    } catch (error) {
      alert('Erro ao carregar faturas: ' + error.message);
    }
  };

  const handlePagar = async (id) => {
    try {
      await pagarFatura(id);
      alert('Pagamento efetuado com sucesso!');
      carregarFaturas();
    } catch (error) {
      alert('Erro ao pagar fatura: ' + error.message);
    }
  };

  useEffect(() => {
    carregarFaturas();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Faturas</h1>
      <div className="space-y-4">
        {faturas.map((fatura) => (
          <FaturaCard key={fatura.id} fatura={fatura} onPay={handlePagar} />
        ))}
      </div>
    </div>
  );
}
