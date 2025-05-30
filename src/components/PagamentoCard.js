const PagamentoCard = ({ pg, onDelete }) => (
  <div className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
    <div>
      <h4 className="font-semibold">{pg.descricao}</h4>
      <p className="text-xs text-gray-500">{pg.data_pg} — {pg.estado}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-bold">{pg.valor} €</span>
      <button onClick={() => onDelete(pg.id)} className="text-red-600 hover:underline text-sm">
        Eliminar
      </button>
    </div>
  </div>
);

export default PagamentoCard;
