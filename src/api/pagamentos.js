// src/api/pagamentos.js
import { supabase } from '../services/supabaseClient';

/**
 * Retorna todos os pagamentos visíveis para o user logado:
 * admin vê todos, senhorio só dos seus condomínios, inquilino apenas seus próprios.
 *
 * @returns {Promise<Array>}
 */
export async function fetchPagamentos() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { data: perfilData, error: perfilErr } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;
  const perfil = perfilData;

  let query = supabase.from('pagamentos').select('*').order('created_at', { ascending: false });

  if (perfil.role === 'admin') {
    // sem filtro extra
  } else {
    // inquilino: só pagamentos que ele próprio criou
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria um pagamento, associando automaticamente user_id = auth.uid().
 *
 * @param {{ condominio_id: string, descricao: string, valor: number, data_pg: string, metodo: string, tipo: string }} payData
 */
export async function createPagamento({ condominio_id, descricao, valor, data_pg, metodo, tipo }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { data, error } = await supabase
    .from('pagamentos')
    .insert([
      {
        user_id: user.id,
        condominio_id,
        descricao,
        valor,
        data_pg,
        estado: 'pendente',
        metodo,
        tipo,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualiza um pagamento existente (admin ou senhorio ou inquilino próprio pode atualizar, conforme RLS).
 *
 * @param {string} id
 * @param {{ condominio_id?: string, descricao?: string, valor?: number, data_pg?: string, estado?: string, metodo?: string, tipo?: string }} updates
 */
export async function updatePagamento(id, updates) {
  const { data, error } = await supabase
    .from('pagamentos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Exclui um pagamento (admin ou proprietário ou senhorio pode, de acordo com RLS).
 *
 * @param {string} id
 */
export async function deletePagamento(id) {
  const { data, error } = await supabase.from('pagamentos').delete().eq('id', id);
  if (error) throw error;
  return data;
}

/**
 * Pega um pagamento específico pelo ID.
 *
 * @param {string} id
 */
export async function getPagamentoById(id) {
  const { data, error } = await supabase.from('pagamentos').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
