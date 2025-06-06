// src/api/orcamentos.js

import { supabase } from '../services/supabaseClient';

/**
 * Busca todos os orçamentos de um dado pedido.
 * - Se admin=true, retorna todos.
 * - Se isSenhorio=true, retorna apenas orçamentos de pedidos cujos condomínios o usuário gerencia.
 * - Caso contrário (inquilino/padrão), retorna somente os próprios orçamentos.
 *
 * @param {object} options
 *   - pedidoId (string, obrigatório): ID do pedido
 *   - admin (boolean): se true, recupera todos os orçamentos
 *   - isSenhorio (boolean): se true, recupera orçamentos dos pedidos de condomínios que o usuário gerencia
 */
export const fetchOrcamentos = async ({
  pedidoId,
  admin = false,
  isSenhorio = false,
}) => {
  // Se admin, traz tudo (não filtra pedidoId)
  let query = supabase.from('orcamentos').select('*').order('created_at', { ascending: false });

  if (admin) {
    // retorna todos os orçamentos (podemos opcionalmente filtrar por pedidoId, mas admin vê tudo)
    if (pedidoId) {
      query = query.eq('pedido_id', pedidoId);
    }
  } else if (isSenhorio) {
    // traz orçamentos cujo pedido pertence a condomínio que o usuário gerencia
    // (não podemos filtrar pelo pedidoId diretamente, pois o RLS já bloqueia tudo não autorizado)
    if (pedidoId) {
      query = query.eq('pedido_id', pedidoId);
    }
    // RLS vai garantir que o supabase só devolva orçamentos de pedidos desse senhorio
  } else {
    // inquilino/fornecedor: só os próprios orçamentos
    query = query
      .eq('pedido_id', pedidoId)
      .eq('user_id', (await supabase.auth.getUser()).data.user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Cria um novo orçamento.
 * O objeto data deve conter, no mínimo:
 *   - pedido_id  (UUID)
 *   - fornecedor (string)
 *   - contacto   (string)
 *   - valor      (number)
 *   - anexo_url  (string, URL do Storage)
 *
 *  O backend completará com:
 *   - user_id     (UUID retirado de supabase.auth.getUser())
 *   - created_at  (timestamp automático no banco)
 */
export const createOrcamento = async (data) => {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;

  const novo = {
    ...data,
    user_id: user.id,
  };

  const { data: inserted, error } = await supabase
    .from('orcamentos')
    .insert(novo)
    .select('*')
    .single();

  if (error) throw error;
  return inserted;
};

/**
 * Atualiza um orçamento existente.
 * @param {string} id
 * @param {object} updates - campos a alterar, ex.: { valor: 150, fornecedor: 'Nova Empresa', anexo_url: '...' }
 */
export const updateOrcamento = async (id, updates) => {
  // RLS garantirá que apenas quem pode atualizar (fornecedor próprio OU senhorio/admin) consiga
  const { data: updated, error } = await supabase
    .from('orcamentos')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return updated;
};

/**
 * Deleta um orçamento. (Somente quem pode: fornecedor, senhorio ou admin.)
 * @param {string} id
 */
export const deleteOrcamento = async (id) => {
  const { error } = await supabase.from('orcamentos').delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * Recupera um único orçamento pelo ID.
 * @param {string} id
 */
export const getOrcamentoById = async (id) => {
  const { data, error } = await supabase.from('orcamentos').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
