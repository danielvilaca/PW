const OrcamentoCard = ({ orc }) => (
  <div className="border rounded p-2 flex justify-between items-center">
    <span>€{orc.valor}</span>
    {orc.anexo_url && (
      <a href={orc.anexo_url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
        Anexo
      </a>
    )}
  </div>
);
export default OrcamentoCard;
