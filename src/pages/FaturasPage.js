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

    function FaturasPDF({ faturas }) {
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

    /**
     * FaturasPage component.
     *
     * Exibe a lista de faturas do utilizadpr  permite marcar faturas como pagas
     * e exportar todas as faturas em PDF.
     *
     * @component
     *
     * @returns {JSX.Element} O componente de página de faturas.
     *
     * @example
     * // Uso típico em uma rota protegida:
     * <FaturasPage />
     *
     * @function
     *
     * @typedef {Object} Fatura
     * @property {number|string} id - Identificador único da fatura.
     * @property {boolean} paga - Indica se a fatura está paga.
     * // Outras propriedades relevantes da fatura podem estar presentes.
     *
     * @typedef {Object} User
     * @property {number|string} id - Identificador único do usuário autenticado.
     * // Outras propriedades relevantes do usuário podem estar presentes.
     *
     * @hook
     * @name useState
     * @description Gerencia o estado local das faturas e do carregamento.
     * @param {Array<Fatura>} faturas - Lista de faturas do usuário.
     * @param {boolean} loading - Indica se os dados estão sendo carregados.
     *
     * @hook
     * @name useAuth
     * @description Hook de autenticação que retorna o usuário autenticado.
     * @returns {{ user: User }} Objeto contendo o usuário autenticado.
     *
     * @hook
     * @name useEffect
     * @description Carrega as faturas do usuário ao montar o componente ou quando o usuário muda.
     * @param {function} effect - Função assíncrona que busca as faturas e atualiza o estado.
     * @param {Array} deps - Dependências do efeito, neste caso, [user].
     *
     * @function
     * @name handlePagar
     * @description Marca uma fatura como paga, atualizando o estado local após a confirmação.
     * @param {number|string} id - Identificador da fatura a ser marcada como paga.
     * @returns {Promise<void>}
     *
     * @external FaturaCard
     * @description Componente responsável por exibir os detalhes de uma fatura individual.
     * @param {Fatura} fatura - Dados da fatura a serem exibidos.
     * @param {function} onPagar - Callback para marcar a fatura como paga.
     *
     * @external PDFDownloadLink
     * @description Componente que permite exportar as faturas em PDF.
     * @param {ReactNode} document - Documento PDF a ser gerado.
     * @param {string} fileName - Nome do arquivo PDF exportado.
     *
     * @external FaturasPDF
     * @description Componente responsável por gerar o documento PDF das faturas.
     * @param {Array<Fatura>} faturas - Lista de faturas a serem exportadas.
     */
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

      if (loading) return <div>Carregando...</div>;

      return (
        <div>
          <h1>Faturas</h1>
          {faturas.map((fatura) => (
            <div key={fatura.id} style={{ marginBottom: 24 }}>
              <FaturaCard
                fatura={fatura}
                onPagar={() => handlePagar(fatura.id)}
              />
              <PDFDownloadLink
                document={<FaturasPDF faturas={[fatura]} />}
                fileName={`Fatura_${fatura.id}.pdf`}
              >
                {({ loading }) => (loading ? 'Gerando PDF...' : 'Exportar PDF')}
              </PDFDownloadLink>
            </div>
          ))}
          <hr style={{ margin: '32px 0' }} />
          <PDFDownloadLink
            document={<FaturasPDF faturas={faturas} />}
            fileName="Extrato.pdf"
          >
            {({ loading }) => (loading ? 'Gerando PDF...' : 'Exportar Todas em PDF')}
          </PDFDownloadLink>
        </div>
      );
    }
