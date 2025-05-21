import { useState } from 'react';

const PedidoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    validade_orcamentos: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ titulo: '', descricao: '', validade_orcamentos: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <input
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Título"
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        placeholder="Descrição"
        className="w-full border p-2 rounded"
      />
      <input
        name="validade_orcamentos"
        type="date"
        value={formData.validade_orcamentos}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Criar Pedido
      </button>
    </form>
  );
};

export default PedidoForm;
