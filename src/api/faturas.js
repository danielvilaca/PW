// src/api/faturas.js

import { supabase } from '../services/supabaseClient';

/**
 * Busca faturas:
 * - Se admin=true, retorna todas,
 * - Se isSenhorio=true, retorna as faturas de pagamentos de inquilinos de condomínios que ele gere,
 * - Caso contrário, retorna apenas as próprias faturas (inquilino).
 *
 * @param {object} options
 *   - admin (boolean)
 *   - isSenhorio (boolean)
 */
export const fetchFaturas = async ({ admin = false, isSenhorio = false } = {}) => {
  let query = supabase.from('faturas').select('*').order('created_at', { ascending: false });

  if (admin) {
    // admin vê tudo
  } else if (isSenhorio) {
    // RLS filtra somente faturas cujos pagamentos são de seus condomínios
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
 * Cria/gera uma nova fatura a partir de um pagamento existente.
 * @param {object} data - deve conter:
 *   - pagamento_id (UUID)  → para relacionamento
 *   - ano           (number)
 *   - mes           (number)
 *   - valor         (number)
 *   - user_id       (UUID do inquilino) (pode ser preenchido como parte da payload)
 *
 *  O backend complementa:
 *   - created_at (timestamp automático no banco)
 */
export const createFatura = async (data) => {
  // Se o front não passar user_id, busca do pagamento
  let { user_id } = data;

  if (!user_id) {
    // extrai o user_id diretamente do registro de pagamento
    const { data: pagamento, error: pgErr } = await supabase
      .from('pagamentos')
      .select('user_id')
      .eq('id', data.pagamento_id)
      .single();
    if (pgErr) throw pgErr;
    user_id = pagamento.user_id;
  }

  const body = {
    ...data,
    user_id,
    pago: data.pago ?? false,
  };

  const { data: inserted, error } = await supabase
    .from('faturas')
    .insert(body)
    .select('*')
    .single();

  if (error) throw error;
  return inserted;
};

/**
 * Atualiza uma fatura existente (ex.: marca como paga ou atualiza pdf_url).
 * @param {string} id
 * @param {object} updates - ex.: { pago: true, pdf_url: 'https://...' }
 */
export const updateFatura = async (id, updates) => {
  const { data: updated, error } = await supabase
    .from('faturas')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return updated;
};

/**
 * Deleta uma fatura (admin apenas).
 * @param {string} id
 */
export const deleteFatura = async (id) => {
  const { error } = await supabase.from('faturas').delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * Busca uma fatura pelo ID.
 * @param {string} id
 */
export const getFaturaById = async (id) => {
  const { data, error } = await supabase.from('faturas').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
