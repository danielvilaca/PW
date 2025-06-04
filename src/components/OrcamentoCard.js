const OrcamentoCard = ({ orc }) => (
  <div className="card mb-2 border-0 shadow-sm">
    <div className="card-body d-flex justify-content-between align-items-center py-2">
      <span className="fw-bold text-success">€{orc.valor}</span>
      {orc.anexo_url && (
        <a
          href={orc.anexo_url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-primary btn-sm"
        >
          Anexo
        </a>
      )}
    </div>
  </div>
);

export default OrcamentoCard;
