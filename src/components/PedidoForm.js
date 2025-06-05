import { useState } from 'react';
import { FiEdit2, FiFileText, FiCalendar, FiPlusCircle } from 'react-icons/fi';

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
    <form
      onSubmit={handleSubmit}
      className="card shadow-sm p-4 mb-4 border-0 rounded-4 bg-light"
    >
      <h5 className="mb-4 text-primary d-flex align-items-center gap-2">
        <FiPlusCircle /> Criar Novo Pedido
      </h5>

      {/* Título */}
      <div className="mb-3">
        <label
          htmlFor="titulo"
          className="form-label fw-semibold d-flex align-items-center gap-2"
        >
          <FiEdit2 /> Título
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="form-control"
          placeholder="Introduz o título do pedido"
          required
        />
      </div>

      {/* Descrição */}
      <div className="mb-3">
        <label
          htmlFor="descricao"
          className="form-label fw-semibold d-flex align-items-center gap-2"
        >
          <FiFileText /> Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          className="form-control"
          rows="3"
          placeholder="Escreve uma descrição opcional..."
        />
      </div>

      {/* Validade */}
      <div className="mb-4">
        <label
          htmlFor="validade_orcamentos"
          className="form-label fw-semibold d-flex align-items-center gap-2"
        >
          <FiCalendar /> Validade dos Orçamentos
        </label>
        <input
          type="date"
          id="validade_orcamentos"
          name="validade_orcamentos"
          value={formData.validade_orcamentos}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      {/* Botão */}
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg d-flex justify-content-center align-items-center gap-2"
        >
          <FiPlusCircle /> Criar Pedido
        </button>
      </div>
    </form>
  );
};

export default PedidoForm;

