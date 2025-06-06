// src/api/pedidos.js

import { supabase } from '../services/supabaseClient';

/**
 * Busca todos os pedidos do usuário atual, ou de todos se for admin/senhorio.
 * - Se admin=true, retorna todos os pedidos.
 * - Se isSenhorio=true, retorna pedidos cujo condominio_id está ligado a algum registro em senhorio_condominio.
 * - Caso contrário, retorna apenas os próprios pedidos (inquilino).
 */
export const fetchPedidos = async ({ admin = false, isSenhorio = false } = {}) => {
  let query = supabase.from('pedidos').select('*').order('created_at', { ascending: false });

  if (admin) {
    // admin vê todos; RLS não bloqueará nada
  } else if (isSenhorio) {
    // RLS irá filtrar apenas pedidos de condomínios que ele gere
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
 * Cria um novo pedido de reparação.
 * @param {object} data - deve conter:
 *   - titulo             (string)
 *   - descricao          (string)
 *   - validade_orcamentos (date em formato ISO, ex.: '2025-06-30')
 *   - condominio_id      (UUID)
 *
 * O backend completa com:
 *   - user_id (UUID do supabase.auth.getUser())
 *   - created_at (timestamp automático no banco)
 *   - estado (string padrão: 'Aberto')
 */
export const criarPedido = async (data) => {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;

  const novo = {
    ...data,
    user_id: user.id,
    estado: data.estado ?? 'Aberto',
  };

  const { data: inserted, error } = await supabase
    .from('pedidos')
    .insert(novo)
    .select('*')
    .single();

  if (error) throw error;
  return inserted;
};

/**
 * Atualiza um pedido (ex.: mudar estado para 'Concluído' e definir chosen_orcamento_id).
 *
 * @param {string} id - UUID do pedido
 * @param {object} updates - campos a alterar, ex.: { estado: 'Concluído', chosen_orcamento_id: '<orcamentoId>' }
 */
export const updatePedido = async (id, updates) => {
  const { data: updated, error } = await supabase
    .from('pedidos')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return updated;
};

/**
 * Deleta um pedido (somente permitido por inquilino próprio enquanto 'Aberto', senhorio ou admin).
 * @param {string} id
 */
export const deletePedido = async (id) => {
  const { error } = await supabase.from('pedidos').delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * Busca um único pedido pelo ID.
 * @param {string} id
 */
export const getPedidoById = async (id) => {
  const { data, error } = await supabase.from('pedidos').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
