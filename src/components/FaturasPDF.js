import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#f3f3f3',
  },
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
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
        <Text style={styles.title}>Fatura</Text>
        {faturas.map((f) => (
          <View key={f.id} style={styles.section}>
            <Text>ID: {f.id}</Text>
            <Text>Mês/Ano: {f.mes.toString().padStart(2, '0')}/{f.ano}</Text>
            <Text>Valor: €{f.valor.toFixed(2)}</Text>
            <Text>Status: {f.pago ? 'Pago' : 'Pendente'}</Text>
            <Text>Data de emissão: {new Date(f.created_at).toLocaleDateString()}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
