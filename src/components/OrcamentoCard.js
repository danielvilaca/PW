import { FiFileText } from 'react-icons/fi';

const AVATAR = {
  sm: '48px', // ~ 3 rem  → 1/3 do que estavas a ver
};

const OrcamentoCard = ({ orc }) => (
  <div className="border rounded p-3 flex items-center gap-3">
    {/* Avatar / iniciais */}
    {orc.perfis?.foto_url ? (
      <img
        src={orc.perfis.foto_url}
        alt="avatar"
        style={{ width: AVATAR.sm, height: AVATAR.sm }}
        className="rounded-full object-cover shrink-0"
      />
    ) : (
      <div
        style={{ width: AVATAR.sm, height: AVATAR.sm }}
        className="rounded-full bg-gray-300 grid place-items-center shrink-0"
      >
        <span className="text-sm text-white">
          {orc.perfis?.nome?.[0] || '?'}
        </span>
      </div>
    )}

    {/* Nome + fornecedor */}
    <div className="flex-1">
      <p className="text-sm font-medium">{orc.perfis?.nome || 'Utilizador'}</p>
      <p className="text-xs text-gray-500">{orc.fornecedor}</p>
    </div>

    {/* Valor + anexo */}
    <span className="font-bold whitespace-nowrap mr-2">€{orc.valor}</span>

    {orc.anexo_url && (
      <a
        href={orc.anexo_url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
      >
        <FiFileText /> Anexo
      </a>
    )}
  </div>
);

export default OrcamentoCard;
