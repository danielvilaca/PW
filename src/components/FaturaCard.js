import React, { useMemo } from 'react';
import { isPast } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaturasPDF } from './FaturasPDF'; // Atenção: este componente aceita um array de faturas

/**
 * Apresenta um cartão de fatura:
 *  - Se a fatura estiver paga, mostra um botão para baixar o PDF dessa própria fatura.
 *  - Caso contrário, mostra um botão “Pagar”.
 *
 * Props:
 *  - fatura: {
 *      id,
 *      ano,
 *      mes,
 *      valor,
 *      pago,
 *      created_at,
 *      // ... outros campos usados em FaturasPDF
 *    }
 *  - onPay(id): função para marcar a fatura como paga
 */
export default function FaturaCard({ fatura, onPay }) {
  const vencimento = new Date(fatura.ano, fatura.mes - 1, 1);
  const emAtraso = !fatura.pago && isPast(vencimento);

  const singleDocument = useMemo(
    () => <FaturasPDF faturas={[fatura]} />,
    [fatura]
  );

  return (
    <div
      className={
        `bg-white rounded-4 shadow-sm p-4 mb-4 d-flex justify-content-between align-items-center border ` +
        (emAtraso ? 'border-danger' : 'border-secondary')
      }
    >
      <div>
        <strong>
          {String(fatura.mes).padStart(2, '0')}/{fatura.ano}
        </strong>{' '}
        – €{fatura.valor.toFixed(2)}
        {emAtraso && (
          <span className="text-danger small ms-2">(em falta)</span>
        )}
      </div>

      {fatura.pago ? (
        <PDFDownloadLink
          document={singleDocument}
          fileName={`Fatura_${fatura.id}.pdf`}
          className="btn btn-primary px-3 py-1"
        >
          {({ loading: pdfLoading }) =>
            pdfLoading ? 'A Gerar PDF...' : 'Exportar PDF'
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
}
