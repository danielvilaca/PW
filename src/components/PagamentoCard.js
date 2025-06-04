const PagamentoCard = ({ pg, isAdmin, onDelete, onPay }) => {
  const pago = pg.estado === 'pago';

  return (
    <div className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
      <div>
        <h4 className="font-semibold">{pg.descricao}</h4>
        <p className="text-xs text-gray-500">
          {pg.data_pg} — {pg.estado}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold">{pg.valor} €</span>

        {isAdmin ? (
          <button
            onClick={() => onDelete(pg.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Eliminar
          </button>
        ) : (
          !pago && (
            <button
              onClick={() => onPay(pg)}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
            >
              Pagar
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PagamentoCard;
