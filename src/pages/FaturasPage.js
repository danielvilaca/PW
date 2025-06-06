// src/pages/FaturasPage.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  fetchFaturas,
  updateFatura,       // <-- usamos updateFatura no lugar de setFaturaPaga
} from '../api/faturas';
import FaturaCard from '../components/FaturaCard';
import { useAuth } from '../auth/AuthContext';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export function FaturasPDF({ faturas }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Extrato de Faturas</Text>
        {faturas.map((fatura) => (
          <View key={fatura.id} style={styles.section}>
            <Text>Fatura #{fatura.id}</Text>
            <Text>
              Mês/Ano: {fatura.mes}/{fatura.ano}
            </Text>
            <Text>Valor: €{fatura.valor.toFixed(2)}</Text>
            <Text>Situação: {fatura.pago ? 'Paga' : 'Pendente'}</Text>
            <Text>
              Emitida em:{' '}
              {new Date(fatura.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export default function FaturasPage() {
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { perfil } = useAuth();

  // 1. Carregar faturas assim que o perfil estiver disponível
  useEffect(() => {
    async function loadFaturas() {
      setLoading(true);
      try {
        // Se admin, busca todas; caso contrário, fetchFaturas já faz filtro
        const data = await fetchFaturas({ admin: perfil.role === 'admin' });
        setFaturas(data);
      } catch (err) {
        console.error('Erro ao buscar faturas:', err);
      } finally {
        setLoading(false);
      }
    }
    if (perfil) {
      loadFaturas();
    }
  }, [perfil]);

  // 2. Memoizar o documento PDF para não quebrar o toggle “Gerando PDF...”
  const faturasDocument = useMemo(() => <FaturasPDF faturas={faturas} />, [
    faturas,
  ]);

  // 3. Marcar uma fatura como paga: usamos updateFatura(id, { pago: true })
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
        <PDFDownloadLink
          document={faturasDocument}
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
            <FaturaCard
              fatura={fatura}
              onPay={handlePagar}
              faturasDocument={faturasDocument}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
