// src/components/FaturasPDF.js

import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#F3F3F3',
  },
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export function FaturasPDF({ faturas, children }) {
  // podemos usar children como render prop ou ignorar
  const document = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Extrato de Faturas</Text>
        {faturas.map((f) => (
          <View key={f.id} style={styles.section}>
            <Text>ID: {f.id}</Text>
            <Text>Mês/Ano: {f.mes}/{f.ano}</Text>
            <Text>Valor: €{f.valor.toFixed(2)}</Text>
            <Text>Status: {f.pago ? 'Pago' : 'Pendente'}</Text>
            <Text>Criado em: {new Date(f.created_at).toLocaleString()}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  // Se o usuário passou uma função como children, chamamos render prop:
  if (typeof children === 'function') {
    return children({ loading: false, document });
  }

  // Caso contrário, renderizamos um PDFDownloadLink padrão:
  return (
    <PDFDownloadLink document={document} fileName="Extrato_Faturas.pdf">
      {({ loading }) => (loading ? 'Gerando PDF...' : 'Download PDF')}
    </PDFDownloadLink>
  );
}
