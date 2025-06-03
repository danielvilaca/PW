import { useEffect, useState } from 'react';
import { fetchPagamentos } from '../api/pagamentos';
import { supabase } from '../services/supabaseClient';

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      // Vai buscar o utilizador autenticado (importante!)
      const user = (await supabase.auth.getUser()).data.user;
      // Busca só os pagamentos do próprio user
      const lista = await fetchPagamentos(false, user.id);
      setPagamentos(lista);
    };
    carregar();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Pagamentos de Renda</h1>
      <div>
        {pagamentos.length === 0 && <div className="text-gray-500">Sem pagamentos registados.</div>}
        {pagamentos.map(pg => (
          <div key={pg.id} className="border p-3 my-2 flex justify-between">
            <span>
              <strong>{pg.descricao}</strong> | {pg.valor} € | {pg.estado} | {pg.data_pg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
