const PerfilCardAdmin = ({ perfil, onEdit, onDelete }) => (
  <div className="card shadow-sm mb-3">
    <div className="card-body d-flex justify-content-between align-items-center">
      <div>
        <h5 className="card-title mb-1">{perfil.nome || <span className="text-muted">(sem nome)</span>}</h5>
        <p className="mb-1 text-muted">{perfil.email}</p>
        <span className="badge bg-secondary">Role: {perfil.role}</span>
      </div>
      <div className="d-flex flex-column flex-md-row gap-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => onEdit(perfil)}
        >
          Editar
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(perfil.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

export default PerfilCardAdmin;
