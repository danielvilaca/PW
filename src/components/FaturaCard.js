// src/components/FaturaCard.js
import React from 'react';
import { isPast } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
// Remova qualquer import direto de FaturasPDF daqui; vamos usar o document que vier como prop.

const FaturaCard = ({ fatura, onPay, faturasDocument }) => {
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
        <strong>{fatura.mes}/{fatura.ano}</strong> – €{fatura.valor.toFixed(2)}
        {emAtraso && (
          <span className="text-danger small ms-2">(em falta)</span>
        )}
      </div>

      {fatura.pago ? (
        <PDFDownloadLink
          document={faturasDocument}
          fileName={`Fatura_${fatura.id}.pdf`}
          className="btn btn-primary px-3 py-1"
        >
          {({ loading: pdfLoading }) =>
            pdfLoading ? 'Gerando PDF...' : 'Exportar PDF'
          }
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
