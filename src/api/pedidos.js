// src/api/pedidos.js
import { supabase } from '../services/supabaseClient';

/**
 * Recupera todos os pedidos visíveis para o utilizador atual,
 * filtrando automaticamente pelo perfil (perfil.id e perfil.role).
 * Se for admin (role='admin'), recupera todos.
 *
 * @returns {Promise<Array>} lista de pedidos
 */
export async function fetchPedidos() {
  // 1) Obter sessão e user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  // 2) Buscar o perfil (para sabermos perfil.id e perfil.role)
  const { data: perfilData, error: perfilErr } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;
  const perfil = perfilData;

  // 3) Montar query base (seleciona todos os campos de “pedidos”)
  let query = supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  // 4) Se não for admin, aplicar filtro
  if (perfil.role === 'admin') {
    // Admin: sem filtro, vê todos
  } else if (perfil.role === 'senhorio') {
    // Senhorio: neste exemplo, não existe condominio_id relacionamento,
    // então considerar que o senhorio vê todos também.
    // Caso queira filtrar por condomínio, teria de existir uma tabela “senhorio_condominio”.
    // Por enquanto, deixa sem filtro também.
  } else {
    // Inquilino: só vê *seus* próprios pedidos
    // OBS.: note que em “pedidos.user_id” agora guardamos PERFIL.ID (e não user.id).
    query = query.eq('user_id', perfil.id);
  }

  // 5) Executar
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria um novo pedido, associando automaticamente o user_id = perfil.id
 * (chave primária de “perfis”).
 *
 * @param {{ titulo: string, descricao: string, validade_orcamentos: string (YYYY-MM-DD) }} pedidoData
 */
export async function criarPedido({ titulo, descricao, validade_orcamentos }) {
  // 1) Obter user atual
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  // 2) Obter o perfil deste user (para sabermos perfil.id)
  const { data: perfilData, error: perfilErr } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;
  const perfil = perfilData;

  // 3) Inserir no “pedidos” usando perfil.id como FK
  const { data, error } = await supabase
    .from('pedidos')
    .insert([
      {
        user_id: perfil.id,
        titulo,
        descricao,
        validade_orcamentos,
        estado: 'Aberto', // estado padrão
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualiza um pedido existente (por pedido.id), retornando o registro atualizado.
 * O backend (RLS) validará se este perfil tem permissão.
 *
 * @param {string} id  → este “id” refere-se ao PK de “pedidos.id”
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
 * Elimina um pedido pelo seu “id” (PK). Só admin ou próprio perfil ou senhorio do
 * condomínio (se aplicável) poderão eliminar, via RLS.
 *
 * @param {string} id → PK de “pedidos.id”
 */
export async function deletePedido(id) {
  const { data, error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
}

/**
 * Busca e devolve um único pedido pelo seu “id” (PK)
 *
 * @param {string} id → PK de “pedidos.id”
 */
export async function getPedidoById(id) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
