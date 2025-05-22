import React from 'react';
import { FiCalendar, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

const PedidoCard = ({ pedido, onVerDetalhes, onEditar, onEliminar }) => {
  const estadoCor = {
    Aberto: 'primary',
    EmAnalise: 'warning',
    Concluído: 'success',
    Cancelado: 'secondary',
  };

  const badgeColor = estadoCor[pedido.estado] || 'dark';

  return (
    <div className="card bg-light border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body">
        {/* Título e descrição */}
        <h5 className="card-title mb-1">{pedido.titulo}</h5>
        <p className="text-muted small mb-2">{pedido.descricao}</p>

        {/* Estado + Validade */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className={`badge bg-${badgeColor}`}>{pedido.estado}</span>
          <small className="text-muted d-flex align-items-center gap-1">
            <FiCalendar /> {pedido.validade_orcamentos}
          </small>
        </div>

        <hr className="my-2" />

        {/* Botões de ação */}
        <div className="d-flex gap-2 flex-wrap">
          <button
            onClick={() => onVerDetalhes(pedido)}
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          >
            <FiEye /> Detalhes
          </button>

          <button
            onClick={() => onEditar(pedido)}
            className="btn btn-outline-warning btn-sm text-dark d-flex align-items-center gap-1"
          >
            <FiEdit2 /> Editar
          </button>

          <button
            onClick={() => onEliminar(pedido.id)}
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
          >
            <FiTrash2 /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PedidoCard;
