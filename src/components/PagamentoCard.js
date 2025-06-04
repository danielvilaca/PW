const PagamentoCard = ({ pg, onDelete }) => (
  <div className="card shadow-sm mb-3">
    <div className="card-body d-flex justify-content-between align-items-center">
      <div>
        <h5 className="card-title mb-1">{pg.descricao || <span className="text-muted">(sem descrição)</span>}</h5>
        <p className="mb-1 text-muted small">
          {pg.data_pg} —{' '}
          {pg.estado === 'pago' ? (
            <span className="badge bg-success">Pago</span>
          ) : (
            <span className="badge bg-warning text-dark">Pendente</span>
          )}
        </p>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="fw-bold fs-5">{pg.valor} €</span>
        {onDelete && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(pg.id)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  </div>
);

export default PagamentoCard;
