const PerfilCardAdmin = ({ perfil, onEdit, onDelete }) => (
  <div className="bg-white shadow p-4 rounded-lg flex justify-between items-center">
    <div>
      <h4 className="font-semibold">{perfil.nome || '(sem nome)'}</h4>
      <p className="text-sm text-gray-500">{perfil.email}</p>
      <p className="text-xs text-gray-400">Role: {perfil.role}</p>
    </div>
    <div className="flex items-center gap-3">
      <button onClick={() => onEdit(perfil)} className="text-blue-600 hover:underline text-sm">
        Editar
      </button>
      <button onClick={() => onDelete(perfil.id)} className="text-red-600 hover:underline text-sm">
        Eliminar
      </button>
    </div>
  </div>
);

export default PerfilCardAdmin;
