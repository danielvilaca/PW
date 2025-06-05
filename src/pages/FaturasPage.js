import { useEffect, useState } from 'react';
import { fetchFaturas, pagarFatura } from '../api/faturas';
import FaturaCard from '../components/FaturaCard';
import { useAuth } from '../auth/AuthContext';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

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
        <Text style={styles.title}>Extrato</Text>
        {faturas.map((fatura) => (
          <View key={fatura.id} style={styles.section}>
            <Text>Numero de Fatura : {fatura.id}</Text>
            <Text>Valor : {fatura.valor}</Text>
            <Text>Situação {fatura.paga ? 'Paga' : 'Pendente'}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export default function FaturasPage() {
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadFaturas() {
      setLoading(true);
      const data = await fetchFaturas(user.id);
      setFaturas(data);
      setLoading(false);
    }
    if (user) loadFaturas();
  }, [user]);

  const handlePagar = async (id) => {
    await pagarFatura(id);
    setFaturas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, paga: true } : f))
    );
  };

  if (loading) return <div className="text-center my-5">Carregando...</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Faturas</h1>
        <PDFDownloadLink
          document={<FaturasPDF faturas={faturas} />}
          fileName="Extrato.pdf"
          className="btn btn-outline-primary"
        >
          {({ loading }) => (loading ? 'Gerando PDF...' : 'Extrato Completo')}
        </PDFDownloadLink>
      </div>
      <div className="row">
        {faturas.map((fatura) => (
          <div key={fatura.id} className="col-12 mb-3">
            <FaturaCard
              fatura={fatura}
              onPay={handlePagar}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
