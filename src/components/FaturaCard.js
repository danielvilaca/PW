import { isPast } from 'date-fns';

const FaturaCard = ({ fatura, onPay }) => {
  const vencimento = new Date(fatura.ano, fatura.mes - 1, 1); // dia 1 do mês
  const emAtraso = !fatura.pago && isPast(vencimento);

  return (
    <div className={`card mb-3 shadow-sm ${emAtraso ? 'border-danger' : ''}`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <strong>
            {String(fatura.mes).padStart(2, '0')}/{fatura.ano}
          </strong>{' '}
          – <span className="fw-bold text-success">€{fatura.valor}</span>
          {emAtraso && (
            <span className="ms-3 badge bg-danger">Em falta</span>
          )}
        </div>
        {fatura.pago ? (
          <a
            href={fatura.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary btn-sm"
          >
            Recibo PDF
          </a>
        ) : (
          <button
            onClick={() => onPay(fatura.id)}
            className="btn btn-success btn-sm"
          >
            Pagar
          </button>
        )}
      </div>
    </div>
  );
};

export default FaturaCard;
