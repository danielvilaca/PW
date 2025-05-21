import { useState, useEffect } from 'react';

const PedidoModal = ({ pedido, onClose, onGuardar }) => {
  const [formData, setFormData] = useState(pedido);

  useEffect(() => {
    setFormData(pedido);
  }, [pedido]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Detalhes do Pedido</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Título"
            readOnly={!onGuardar}
          />
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Descrição"
            readOnly={!onGuardar}
          />
          <input
            type="date"
            name="validade_orcamentos"
            value={formData.validade_orcamentos}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            readOnly={!onGuardar}
          />
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            disabled={!onGuardar}
          >
            <option value="Aberto">Aberto</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Concluído">Concluído</option>
          </select>

          {onGuardar && (
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Guardar alterações
            </button>
          )}
        </form>
        <button onClick={onClose} className="mt-4 text-sm text-gray-600 hover:underline">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default PedidoModal;
