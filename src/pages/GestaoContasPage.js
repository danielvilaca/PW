import { useEffect, useState } from 'react';
import { fetchTodosPerfis, updatePerfilAdmin, eliminarPerfil, createPerfilAdmin } from '../api/perfis';
import PerfilCardAdmin from '../components/PerfilCardAdmin';
import { useAuth } from '../auth/AuthContext';

export default function GestaoContasPage() {
  const { perfil } = useAuth();
  const role = perfil?.role;

  const [contas, setContas] = useState([]);
  const [email, setEmail] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoUtilizador, setNovoUtilizador] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'inquilino',
  });

  const carregar = async () => setContas(await fetchTodosPerfis());
  useEffect(() => { carregar(); }, []);

  const criar = async (e) => {
    e.preventDefault();
    await fetch('/auth/adminInvite'); // substituir
    setEmail('');
    carregar();
  };

  const criarUtilizadorCompleto = async (e) => {
    e.preventDefault();
    try {
      await createPerfilAdmin(novoUtilizador);
      setNovoUtilizador({ nome: '', email: '', password: '', role: 'inquilino' });
      setMostrarModal(false);
      carregar();
    } catch (err) {
      console.error('ERRO ao criar utilizador →', err);
      alert('Falhou a criação do perfil.');
    }
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

  if (role !== 'admin') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Não tens permissões para aceder a esta página.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 display-6">Gestão de Contas</h2>

      <div className="d-flex gap-3 mb-4">
        <form onSubmit={criar} className="input-group">
          <input
            type="email"
            placeholder="Novo email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-primary">Convidar</button>
        </form>

        <button className="btn btn-outline-success" onClick={() => setMostrarModal(true)}>
          Criar novo utilizador
        </button>
      </div>

      <div className="vstack gap-3">
        {contas.map((c) => (
          <PerfilCardAdmin
            key={c.id}
            perfil={c}
            onEdit={editarRole}
            onEditInfo={() => alert('Editar informações não implementado')}
            onDelete={remover}
          />
        ))}
      </div>

      {mostrarModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={criarUtilizadorCompleto}>
                <div className="modal-header">
                  <h5 className="modal-title">Novo Utilizador</h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Nome</label>
                    <input
                      className="form-control"
                      value={novoUtilizador.nome}
                      onChange={(e) =>
                        setNovoUtilizador({ ...novoUtilizador, nome: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={novoUtilizador.email}
                      onChange={(e) =>
                        setNovoUtilizador({ ...novoUtilizador, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Palavra-passe</label>
                    <input
                      type="password"
                      className="form-control"
                      value={novoUtilizador.password}
                      onChange={(e) =>
                        setNovoUtilizador({ ...novoUtilizador, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={novoUtilizador.role}
                      onChange={(e) =>
                        setNovoUtilizador({ ...novoUtilizador, role: e.target.value })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="senhorio">Senhorio</option>
                      <option value="inquilino">Inquilino</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">Criar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
