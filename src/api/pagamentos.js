// src/api/pagamentos.js

import { supabase } from '../services/supabaseClient';

/**
 * Busca todos os pagamentos do usuário atual (inquilino), ou de todo o condomínio (senhorio), ou todos (admin).
 * @param {object} options
 *   - admin (boolean): se true, retorna todos
 *   - isSenhorio (boolean): se true, retorna pagamentos de condomínios que o usuário gerencia
 */
export const fetchPagamentos = async ({ admin = false, isSenhorio = false } = {}) => {
  let query = supabase.from('pagamentos').select('*').order('created_at', { ascending: false });

  if (admin) {
    // admin vê tudo
  } else if (isSenhorio) {
    // RLS irá filtrar somente pagamentos de condomínios que ele gerencia
  } else {
    // inquilino: filtra por user_id
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Cria um novo pagamento (registro de comprovante ou cobrança).
 * @param {object} data - deve conter:
 *   - user_id       (UUID do inquilino)
 *   - condominio_id (UUID do condomínio)
 *   - descricao     (string)
 *   - valor         (number)
 *   - data_pg       (string ou Date)
 *   - estado        (string, ex.: 'pendente')
 *   - metodo        (string)
 *   - tipo          (string, ex.: 'renda', 'agua')
 *   - comprovante_url (string, opcional)
 *
 *  Se for inquilino, `user_id` virá do próprio supabase.auth.getUser().id.
 *  Se for senhorio, passará user_id do formulário (desde que pertença a um condomínio dele).
 */
export const createPagamento = async (data) => {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;

  // Se o front não enviou user_id (um pagamento feito pelo próprio inquilino), crie como ele
  const body = {
    ...data,
    user_id: data.user_id || user.id,
  };

  const { data: inserted, error } = await supabase
    .from('pagamentos')
    .insert(body)
    .select('*')
    .single();

  if (error) throw error;
  return inserted;
};

/**
 * Atualiza um pagamento existente (ex.: inquilino anexar comprovante, ou senhorio aprovar).
 * @param {string} id
 * @param {object} updates - ex.: { estado: 'confirmado', comprovante_url: '...' }
 */
export const updatePagamento = async (id, updates) => {
  const { data: updated, error } = await supabase
    .from('pagamentos')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return updated;
};

/**
 * Deleta um pagamento (inquilino próprio ou senhorio/admin).
 * @param {string} id
 */
export const deletePagamento = async (id) => {
  const { error } = await supabase.from('pagamentos').delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * Busca um pagamento pelo ID.
 * @param {string} id
 */
export const getPagamentoById = async (id) => {
  const { data, error } = await supabase.from('pagamentos').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
