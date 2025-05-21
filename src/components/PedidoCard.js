const PedidoCard = ({ pedido, onVerDetalhes, onEditar, onEliminar }) => (
  <div className="bg-white rounded-xl shadow-md p-4 border relative">
    <h3 className="text-lg font-semibold text-gray-800">{pedido.titulo}</h3>
    <p className="text-sm text-gray-600 mt-1">{pedido.descricao}</p>
    <div className="flex justify-between items-center text-sm mt-3">
      <span className="text-blue-600 font-medium">Estado: {pedido.estado}</span>
      <span className="text-gray-500">Validade: {pedido.validade_orcamentos}</span>
    </div>

    <div className="flex gap-2 mt-4">
      <button onClick={() => onVerDetalhes(pedido)} className="text-blue-600 hover:underline text-sm">
        Ver detalhes
      </button>
      <button onClick={() => onEditar(pedido)} className="text-yellow-600 hover:underline text-sm">
        Editar
      </button>
      <button onClick={() => onEliminar(pedido.id)} className="text-red-600 hover:underline text-sm">
        Eliminar
      </button>
    </div>
  </div>
);

export default PedidoCard;
