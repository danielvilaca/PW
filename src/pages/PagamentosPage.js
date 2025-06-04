import { useEffect, useState } from 'react';
import { fetchPagamentos } from '../api/pagamentos';
import { supabase } from '../services/supabaseClient';
import CriarPagamentoForm from '../components/CriarPagamentoForm';
import { useAuth } from '../auth/AuthContext';
import { isAdmin, isSenhorio, isInquilino } from '../utils/roles';

export default function PagamentosPage() {
  const { perfil } = useAuth();
  const [pagamentos, setPagamentos] = useState([]);

  const carregar = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const lista = await fetchPagamentos(false, user.id);
    setPagamentos(lista);
  };

  useEffect(() => {
    carregar();
  }, []);

  // --- Validação de roles ---
  if (!perfil) return <div className="container mt-5">A carregar...</div>;
  if (!(isAdmin(perfil) || isSenhorio(perfil) || isInquilino(perfil))) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Não tens permissões para aceder a esta página.
        </div>
      </div>
    );
  }
  // --------------------------

  return (
    <div className="container py-5">
      <h1 className="mb-4">Pagamentos </h1>
      <CriarPagamentoForm onCreated={carregar} />

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Valor (€)</th>
              <th>Estado</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-secondary">Sem pagamentos registados.</td>
              </tr>
            ) : (
              pagamentos.map(pg => (
                <tr key={pg.id}>
                  <td>{pg.tipo ? pg.tipo.charAt(0).toUpperCase() + pg.tipo.slice(1) : '-'}</td>
                  <td>{pg.descricao}</td>
                  <td>{pg.valor}</td>
                  <td>
                    {pg.estado === 'pago'
                      ? <span className="badge bg-success">Pago</span>
                      : <span className="badge bg-warning text-dark">Pendente</span>
                    }
                  </td>
                  <td>{pg.data_pg}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
