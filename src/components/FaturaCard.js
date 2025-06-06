// src/components/FaturaCard.js

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaturasPDF } from './FaturasPDF';

/**
 * Exibe um cartão de fatura, mostrando mês/ano/valor.
 * Se já pago, exibe botão PDF; se pendente, botão “Pagar” e “Excluir”.
 *
 * Props:
 *  - fatura: {
 *      id, user_id, condominio_id, ano, mes, valor, pago, pdf_url, created_at
 *    }
 *  - onPay(id)
 *  - onDelete(id)
 */
export default function FaturaCard({ fatura, onPay, onDelete }) {
  const { id, ano, mes, valor, pago, pdf_url } = fatura;

  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-1">
            {mes}/{ano} – €{valor.toFixed(2)}
          </h5>
          {!pago && <span className="badge bg-warning text-dark">Pendente</span>}
          {pago && <span className="badge bg-success">Pago</span>}
        </div>
        <div className="d-flex gap-2">
          {pago ? (
            <PDFDownloadLink
              document={<FaturasPDF faturas={[fatura]} />}
              fileName={`Fatura_${id}.pdf`}
              className="btn btn-sm btn-outline-primary"
            >
              {({ loading }) => (loading ? 'Gerando PDF…' : 'PDF')}
            </PDFDownloadLink>
          ) : (
            <button className="btn btn-sm btn-success" onClick={() => onPay(id)}>
              Marcar Pago
            </button>
          )}
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(id)}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
