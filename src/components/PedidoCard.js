import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import OrcamentoForm from './OrcamentoForm';
import OrcamentoCard from './OrcamentoCard';
import { fetchOrcamentos } from '../api/orcamentos';

const PedidoCard = ({ pedido, onEdit, onDelete }) => {
  const { perfil } = useAuth();
  const isInquilino = perfil?.role === 'inquilino';

  const [expand, setExpand] = useState(false);
  const [orcs, setOrcs] = useState([]);

  useEffect(() => {
    if (expand) fetchOrcamentos(pedido.id).then(setOrcs);
  }, [expand, pedido.id]);

  return (
    <div className="bg-white shadow p-4 rounded mb-3">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold">{pedido.titulo}</h4>
          <p className="text-xs text-gray-500">{pedido.descricao}</p>
        </div>

        <button
          onClick={() => setExpand(!expand)}
          className="text-blue-600 hover:underline text-sm"
        >
          {expand ? 'Fechar' : 'Detalhes'}
        </button>
      </div>

      {expand && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-gray-500">
            Validade: {pedido.validade_orcamentos}
          </p>

          <h5 className="font-medium">Orçamentos</h5>
          {orcs.map((o) => (
            <OrcamentoCard key={o.id} orc={o} />
          ))}

          {isInquilino &&
            new Date() < new Date(pedido.validade_orcamentos) && (
              <OrcamentoForm
                pedidoId={pedido.id}
                onFinish={() => fetchOrcamentos(pedido.id).then(setOrcs)}
              />
            )}
        </div>
      )}

      {/* botões admin/senhorio – opcional */}
      {(perfil?.role === 'admin' || perfil?.role === 'senhorio') && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit(pedido)}
            className="text-yellow-600 hover:underline text-sm"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(pedido.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default PedidoCard;
