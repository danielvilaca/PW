import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

const PedidoModal = ({ pedido, onClose, onGuardar }) => {
  const [formData, setFormData] = useState(pedido);

  useEffect(() => {
    setFormData(pedido);
  }, [pedido]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onGuardar) onGuardar(formData);
  };

  return (
    <div className="modal d-block show fade" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Detalhes do Pedido</h5>
            <button type="button" className="btn-close" aria-label="Fechar" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="form-control"
                  readOnly={!onGuardar}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  readOnly={!onGuardar}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Validade dos Orçamentos</label>
                <input
                  type="date"
                  name="validade_orcamentos"
                  value={formData.validade_orcamentos}
                  onChange={handleChange}
                  className="form-control"
                  readOnly={!onGuardar}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="form-select"
                  disabled={!onGuardar}
                >
                  <option value="Aberto">Aberto</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Fechar
              </button>

              {onGuardar && (
                <button type="submit" className="btn btn-primary">
                  Guardar alterações
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PedidoModal;
