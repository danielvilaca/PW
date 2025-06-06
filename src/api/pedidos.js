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

  // Começamos por obter todos, ordenados por created_at
  let query = supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (perfil.role === 'admin') {
    // Sem filtro
  } else if (perfil.role === 'senhorio') {
    // Se daqui para a frente precisar de “filtrar por condomínio_id”,
    // descomente e ajuste a subquery abaixo. No momento,
    // para simplificar, assume-se que tudo faz parte de um único condomínio:
    //
    // query = query.in(
    //   'condominio_id',
    //   supabase
    //     .from('senhorio_condominio')
    //     .select('condominio_id')
    //     .eq('senhorio_id', perfil.user_id)
    // );

  } else {
    // inquilino: apenas os próprios
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria um novo pedido, associando automaticamente o user_id do utilizador logado.
 *
 * @param {{
 *   titulo: string,
 *   descricao: string,
 *   validade_orcamentos: string (YYYY-MM-DD),
 *   condominio_id: uuid (pode ficar nulo ou valor fixo)
 * }} pedidoData
 */
export async function criarPedido({
  titulo,
  descricao,
  validade_orcamentos,
  condominio_id = null, // se vai ser um único condomínio, podemos usar null ou um valor fixo
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  // Tentar inserir user_id. Se ainda não existir perfil para este user,
  // vai dar “violates foreign key” (porque user_id não está em perfis).
  // Por isso, certifique-se de que todo utilizador tenha perfil criado primeiro.
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
 * O RLS no Supabase só permite que quem tiver permissão (admin, senhorio do condomínio ou próprio inquilino em 'Aberto')
 * faça o update.
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
 * Obtém um pedido pelo seu ID.
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
