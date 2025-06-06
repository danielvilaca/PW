// src/api/faturas.js
import { supabase } from '../services/supabaseClient';

/**
 * Busca todas as faturas, ordenadas por ano e mês descendente.
 * Se 'admin' for false (ou omitido), filtra só as faturas do usuário logado.
 *
 * @param {Object} options
 * @param {boolean} [options.admin=false] — true para buscar todas as faturas; false para buscar só as próprias.
 * @returns {Promise<Array>} Lista de faturas.
 */
export const fetchFaturas = async ({ admin = false } = {}) => {
  // Obter ID do usuário logado
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  const uid = user.id;

  // Construir query básica
  let query = supabase
    .from('faturas')
    .select('*')
    .order('ano', { ascending: false })
    .order('mes', { ascending: false });

  // Se não for admin, filtrar só as próprias faturas
  if (!admin) {
    query = query.eq('user_id', uid);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Marca a fatura como paga (campo 'pago' = true) e retorna o registo atualizado.
 *
 * @param {string} id — ID da fatura.
 * @returns {Promise<Object>} A fatura atualizada.
 */
export const pagarFatura = async (id) => {
  const { data: fatura, error: upErr } = await supabase
    .from('faturas')
    .update({ pago: true })
    .eq('id', id)
    .select('*')
    .single();

  if (upErr) throw upErr;
  return fatura;
};
