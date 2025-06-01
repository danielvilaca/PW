import { useEffect, useState } from 'react';
import { fetchTodosPerfis, updatePerfilAdmin, eliminarPerfil } from '../api/perfis';
import PerfilCardAdmin from '../components/PerfilCardAdmin';

export default function GestaoContasPage() {
  const [contas, setContas] = useState([]);
  const [email, setEmail]   = useState('');

  const carregar = async () => setContas(await fetchTodosPerfis());
  useEffect(() => { carregar(); }, []);

  const criar = async (e) => {
    e.preventDefault();
    // criação mínima: novo utilizador recebe email + role default
    await fetch('/auth/adminInvite', { /* endpoint próprio ou Supabase invite */ });
    setEmail('');
    carregar();
  };

  const editarRole = async (perfil) => {
    const novoRole = prompt('Role (admin/senhorio/inquilino):', perfil.role);
    if (!novoRole) return;
    await updatePerfilAdmin(perfil.id, { role: novoRole });
    carregar();
  };

  const remover = async (id) => {
    if (!window.confirm('Eliminar conta?')) return;
    await eliminarPerfil(id);
    carregar();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-bold">Gestão de Contas</h2>

      {/* Form para convidar/utilizador (simplificado) */}
      <form onSubmit={criar} className="flex gap-2">
        <input
          type="email"
          placeholder="Novo email"
          className="border p-2 flex-grow rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">Convidar</button>
      </form>

      {contas.map((c) => (
        <PerfilCardAdmin
          key={c.id}
          perfil={c}
          onEdit={editarRole}
          onDelete={remover}
        />
      ))}
    </div>
  );
}
