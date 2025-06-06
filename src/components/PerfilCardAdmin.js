const PerfilCardAdmin = ({ perfil, onEdit, onEditInfo, onDelete, onToggleValidar }) => {
  const { nome, email, role, validated } = perfil;

  const badgeColor = validated ? 'bg-success' : 'bg-warning text-dark';
  const badgeText  = validated ? 'Validada' : 'Não validada';

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
        {/* ─────────────── info principal ─────────────── */}
        <div>
          <h5 className="card-title mb-1">
            {nome || <span className="text-muted">(sem nome)</span>}
          </h5>
          <p className="mb-1 text-muted">{email}</p>

          {/* role + estado validação */}
          <span className="badge bg-secondary me-1">Role: {role}</span>
          <span className={`badge ${badgeColor}`}>{badgeText}</span>
        </div>

        {/* ─────────────── botões ─────────────── */}
        <div className="d-flex flex-column flex-md-row gap-2">
          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            onClick={() => onToggleValidar(perfil)}
          >
            {validated ? 'Desvalidar' : 'Validar'}
          </button>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(perfil)}
          >
            Editar
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEditInfo && onEditInfo(perfil)}
          >
            Dados
          </button>


          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(perfil)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilCardAdmin;
