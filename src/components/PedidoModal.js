import { useEffect, useState } from 'react';
import { fetchOrcamentos } from '../api/orcamentos';
import OrcamentoCard from './OrcamentoCard';
import OrcamentoForm from './OrcamentoForm';

const PedidoModal = ({ pedido, onClose, onGuardar }) => {
  const [formData, setFormData] = useState(pedido);
  const [orcs, setOrcs] = useState([]);

  useEffect(() => {
    setFormData(pedido);
    fetchOrcamentos(pedido.id).then(setOrcs);
  }, [pedido]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onGuardar(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Pedido – {pedido.titulo}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {onGuardar && (
            <>
              <input name="titulo" value={formData.titulo} onChange={handleChange} className="w-full border p-2 rounded" />
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} className="w-full border p-2 rounded" />
              <select name="estado" value={formData.estado} onChange={handleChange} className="w-full border p-2 rounded">
                <option>Aberto</option><option>Em Análise</option><option>Concluído</option>
              </select>
              <button className="bg-blue-600 text-white px-3 py-1 rounded">Guardar</button>
            </>
          )}

          {!onGuardar && (
            <>
              <p>{pedido.descricao}</p>
              <p className="text-sm text-gray-500">Validade: {pedido.validade_orcamentos}</p>
            </>
          )}
        </form>

        <hr className="my-4" />

        <h3 className="font-medium mb-2">Orçamentos</h3>
        {orcs.map(o => <OrcamentoCard key={o.id} orc={o} />)}

        {new Date() < new Date(pedido.validade_orcamentos) && (
          <OrcamentoForm
            pedidoId={pedido.id}
            onFinish={() => fetchOrcamentos(pedido.id).then(setOrcs)}
          />
        )}

        <button onClick={onClose} className="mt-4 text-gray-600 hover:underline text-sm">Fechar</button>
      </div>
    </div>
  );
};

export default PedidoModal;
