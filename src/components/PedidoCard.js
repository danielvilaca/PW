const PedidoCard = ({ pedido }) => (
  <div className="bg-white rounded-xl shadow p-4 mb-4">
    <h3 className="font-semibold">{pedido.titulo}</h3>
    <p className="text-sm text-gray-600">{pedido.descricao}</p>
    <p className="text-xs mt-2 text-blue-500">Estado: {pedido.estado}</p>
    <p className="text-xs text-gray-400">Validade: {pedido.validade_orcamentos}</p>
  </div>
);

export default PedidoCard;
