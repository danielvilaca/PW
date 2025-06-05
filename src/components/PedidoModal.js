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
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
      style={{ zIndex: 1050 }}
    >
      <div className="bg-white rounded-4 shadow-lg p-4 w-100" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="fs-4 fw-semibold mb-3">Pedido – {pedido.titulo}</h2>

        <form onSubmit={handleSubmit} className="mb-3">
          {onGuardar ? (
            <>
              <div className="mb-3">
                <input
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Título"
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Descrição"
                />
              </div>
              <div className="mb-3">
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option>Aberto</option>
                  <option>Em Análise</option>
                  <option>Concluído</option>
                </select>
              </div>
              <button className="btn btn-primary">Guardar</button>
            </>
          ) : (
            <>
              <p>{pedido.descricao}</p>
              <p className="small text-muted mb-0">
                Validade: {pedido.validade_orcamentos}
              </p>
            </>
          )}
        </form>

        <hr className="my-3" />

        <h3 className="fw-medium fs-5 mb-2">Orçamentos</h3>
        <div className="mb-2">
          {orcs.map(o => <OrcamentoCard key={o.id} orc={o} />)}
        </div>

        {new Date() < new Date(pedido.validade_orcamentos) && (
          <OrcamentoForm
            pedidoId={pedido.id}
            onFinish={() => fetchOrcamentos(pedido.id).then(setOrcs)}
          />
        )}

        <button onClick={onClose} className="btn btn-link mt-3 text-secondary p-0">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default PedidoModal;
