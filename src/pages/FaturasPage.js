// src/pages/FaturasPage.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  fetchFaturas,
  updateFatura,
} from '../api/faturas';
import FaturaCard from '../components/FaturaCard';
import { useAuth } from '../auth/AuthContext';
import {
  PDFDownloadLink,
  // Não é mais necessário importar FaturasPDF aqui, a não ser que queira o extrato completo
} from '@react-pdf/renderer';
import { FaturasPDF } from '../components/FaturasPDF';

export default function FaturasPage() {
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { perfil } = useAuth();

  useEffect(() => {
    async function loadFaturas() {
      setLoading(true);
      try {
        const data = await fetchFaturas({ admin: perfil.role === 'admin' });
        setFaturas(data);
      } catch (err) {
        console.error('Erro ao buscar faturas:', err);
      } finally {
        setLoading(false);
      }
    }
    if (perfil) loadFaturas();
  }, [perfil]);

  // Se você quiser manter o extrato completo no topo da página,
  // pode deixar essa memoização aqui (caso queira disponibilizar Extrato Geral):
  const extratoCompletoDocument = useMemo(
    () => <FaturasPDF faturas={faturas} />,
    [faturas]
  );

  const handlePagar = async (id) => {
    try {
      await updateFatura(id, { pago: true });
      setFaturas((prev) =>
        prev.map((f) => (f.id === id ? { ...f, pago: true } : f))
      );
    } catch (err) {
      console.error('Erro ao marcar fatura como paga:', err);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Carregando faturas…</div>;
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Faturas</h1>

        {/* Se quiser deixar o Extrato Geral no topo, mantenha esta parte: */}
        <PDFDownloadLink
          document={extratoCompletoDocument}
          fileName="Extrato_Completo.pdf"
          className="btn btn-outline-primary"
        >
          {({ loading: pdfLoading }) =>
            pdfLoading ? 'Gerando Extrato...' : 'Exportar Extrato'
          }
        </PDFDownloadLink>
      </div>

      <div className="row">
        {faturas.map((fatura) => (
          <div key={fatura.id} className="col-12 mb-3">
            {/* Aqui NÃO passamos mais faturasDocument, apenas onPay */}
            <FaturaCard fatura={fatura} onPay={handlePagar} />
          </div>
        ))}
      </div>
    </div>
  );
}
