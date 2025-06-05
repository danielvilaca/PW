import { isPast } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaturasPDF } from '../pages/FaturasPage';

const FaturaCard = ({ fatura, onPay }) => {
  const vencimento = new Date(fatura.ano, fatura.mes - 1, 1);
  const emAtraso = !fatura.pago && isPast(vencimento);

  return (
    <div
      className={
        `bg-white rounded-4 shadow-sm p-4 mb-4 d-flex justify-content-between align-items-center border ` +
        (emAtraso ? 'border-danger' : 'border-secondary')
      }
    >
      <div>
        <strong>{fatura.mes}/{fatura.ano}</strong> – €{fatura.valor}
        {emAtraso && (
          <span className="text-danger small ms-2">(em falta)</span>
        )}
      </div>

      {fatura.pago ? (
        <PDFDownloadLink
          document={<FaturasPDF faturas={[fatura]} />}
          fileName={`Fatura_${fatura.id}.pdf`}
          className="btn btn-primary px-3 py-1"
        >
          {({ loading }) => (loading ? 'Gerando PDF...' : 'Exportar PDF')}
        </PDFDownloadLink>
      ) : (
        <button
          onClick={() => onPay(fatura.id)}
          className="btn btn-success px-3 py-1"
        >
          Pagar
        </button>
      )}
    </div>
  );
};

export default FaturaCard;
