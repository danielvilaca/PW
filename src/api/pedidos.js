// src/api/pedidos.js
import { supabase } from '../services/supabaseClient';

/**
 * Recupera todos os pedidos visíveis para o utilizador atual,
 * filtrando automaticamente pelo perfil (user_id ou condições de senhorio).
 * Se for admin (role='admin'), recupera todos.
 *
 * @returns {Promise<Array>} lista de pedidos
 */
export async function fetchPedidos() {
  // Obtém o user e seu perfil (para saber role e id)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  // Busca o perfil para saber role
  const { data: perfilData, error: perfilErr } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (perfilErr) throw perfilErr;
  const perfil = perfilData;

  let query = supabase.from('pedidos').select('*').order('created_at', { ascending: false });

  if (perfil.role === 'admin') {
    // não filtra nada
  } else if (perfil.role === 'senhorio') {
    // Exemplo simplificado: supondo que exista tabela 'senhorio_condominio(senhorio_id, condominio_id)'
    // e que 'pedidos' tenha 'condominio_id' para relacionar:
    query = query.in(
      'condominio_id',
      // subquery: lista dos condominio_id em que este senhorio é responsável
      supabase
        .from('senhorio_condominio')
        .select('condominio_id')
        .eq('senhorio_id', perfil.user_id)
    );
  } else {
    // inquilino: só seus próprios pedidos
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria um novo pedido, associando automaticamente o user_id do utilizador logado.
 *
 * @param {{ titulo: string, descricao: string, validade_orcamentos: string (YYYY-MM-DD), condominio_id: uuid }} pedidoData
 */
export async function criarPedido({ titulo, descricao, validade_orcamentos, condominio_id }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { data, error } = await supabase
    .from('pedidos')
    .insert([
      {
        user_id: user.id,
        titulo,
        descricao,
        validade_orcamentos,
        condominio_id,
        estado: 'Aberto', // valor padrão
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualiza um pedido existente (por id), retornando o registo atualizado.
 * O backend impõe RLS, então só quem tiver permissão (admin, senhorio do condomínio ou próprio inquilino em 'Aberto')
 * poderá atualizar.
 *
 * @param {string} id
 * @param {{ titulo?: string, descricao?: string, estado?: string, validade_orcamentos?: string }} updates
 */
export async function updatePedido(id, updates) {
  const { data, error } = await supabase
    .from('pedidos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Elimina um pedido (apenas admin ou proprietário ou senhorio do condomínio pode).
 *
 * @param {string} id
 */
export async function deletePedido(id) {
  const { data, error } = await supabase.from('pedidos').delete().eq('id', id);
  if (error) throw error;
  return data;
}


export async function getPedidoById(id) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
