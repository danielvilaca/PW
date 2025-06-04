import { isPast } from 'date-fns';

const FaturaCard = ({ fatura, onPay }) => {
  // Calcula a data de vencimento (dia 1 do mês)
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
        <a
          href={fatura.pdf_url}
          target="_blank"
          rel="noreferrer"
          className="link-primary text-decoration-underline"
        >
          Recibo PDF
        </a>
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
