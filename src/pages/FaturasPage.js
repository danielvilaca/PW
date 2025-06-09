import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { fetchFaturas, updateFatura } from '../api/faturas';
import FaturaCard from '../components/FaturaCard';
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#E4E4E4', padding: 20 },
  section: { margin: 10, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
  title: { fontSize: 18, marginBottom: 10 },
});

export function FaturasPDF({ faturas }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Extrato de Faturas</Text>
        {faturas.map((f) => (
          <View key={f.id} style={styles.section}>
            <Text>Fatura #{f.id}</Text>
            <Text>Mês/Ano: {f.mes}/{f.ano}</Text>
            <Text>Valor: €{f.valor.toFixed(2)}</Text>
            <Text>Situação: {f.pago ? 'Paga' : 'Pendente'}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export default function FaturasPage() {
  const { perfil } = useAuth();
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const adminParam = perfil.role === 'admin' || perfil.role === 'senhorio';
      const data = await fetchFaturas({ adminParam });
      setFaturas(data);
      setLoading(false);
    }
    if (perfil) load();
  }, [perfil]);

  const handlePagar = async (id) => {
    const updated = await updateFatura(id, { pago: true });
    setFaturas((old) => old.map((f) => (f.id === id ? updated : f)));
  };

  if (loading) return <div className="text-center my-5">Carregando faturas…</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Faturas</h1>
        <PDFDownloadLink
          document={<FaturasPDF faturas={faturas} />}
          fileName="Extrato_Completo.pdf"
          className="btn btn-outline-primary"
        >
          {({ loading }) => (loading ? 'Gerando PDF...' : 'Extrato Completo')}
        </PDFDownloadLink>
      </div>

      {faturas.length === 0 ? (
        <p className="text-muted">Nenhuma fatura encontrada.</p>
      ) : (
        faturas.map((f) => (
          <FaturaCard
            key={f.id}
            fatura={f}
            onPay={handlePagar}
            // PDF de fatura individual
            faturasDocument={<FaturasPDF faturas={[f]} />}
          />
        ))
      )}
    </div>
  );
}
