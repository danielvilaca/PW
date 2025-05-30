import { isPast } from 'date-fns';

const FaturaCard = ({ fatura, onPay }) => {
  const vencimento = new Date(fatura.ano, fatura.mes - 1, 1);        // dia 1 do mês
  const emAtraso = !fatura.pago && isPast(vencimento);

  return (
    <div className={`bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center
                    ${emAtraso ? 'border border-red-500' : 'border'}`}>
      <div>
        <strong>{fatura.mes}/{fatura.ano}</strong> – €{fatura.valor}
        {emAtraso && <span className="text-red-600 text-sm ml-2">(em falta)</span>}
      </div>

      {fatura.pago ? (
        <a href={fatura.pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
          Recibo PDF
        </a>
      ) : (
        <button onClick={() => onPay(fatura.id)} className="bg-green-600 text-white px-3 py-1 rounded">
          Pagar
        </button>
      )}
    </div>
  );
};
export default FaturaCard;
