import { supabase } from '../services/supabaseClient';

/**
 * Retorna todos os pagamentos visíveis para o user logado:
 *  - adminParam=true - TODOS
 *  - adminParam=false & role='senhorio' - TODOS
 *  - adminParam=false & role='inquilino' - só user_id = auth.uid()
 *
 * @param {{ adminParam?: boolean }} opts
 */
export async function fetchPagamentos({ adminParam = false } = {}) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error('Não autenticado');

  const { data: perfil, error: perfilErr } = await supabase
    .from('perfis')
    .select('role,user_id')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;

  let query = supabase
    .from('pagamentos')
    .select('*')
    .order('data_pg', { ascending: false });

  if (!adminParam && perfil.role === 'inquilino') {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria um pagamento:
 *  - inquilino - attributo user_id = auth.uid()
 *  - admin/senhorio - payData.user_id deve estar presente
 */
export async function createPagamento(payData) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error('Não autenticado');

  const { data: perfil, error: perfilErr } = await supabase
    .from('perfis')
    .select('role,user_id')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;

  // decide user_id no insert
  const assignedUserId =
    perfil.role === 'inquilino' ? user.id : payData.user_id;
  if (!assignedUserId) {
    throw new Error(
      'Para admin/senhorio é obrigatório passar payData.user_id'
    );
  }

  const { data, error } = await supabase
    .from('pagamentos')
    .insert([
      {
        user_id: assignedUserId,
        descricao: payData.descricao,
        valor: payData.valor,
        data_pg: payData.data_pg,
        estado: 'pendente',
        metodo: payData.metodo,
        tipo: payData.tipo || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Atualiza um pagamento (ex: marcar como pago) */
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

/** Exclui um pagamento */
export async function deletePagamento(id) {
  const { data, error } = await supabase
    .from('pagamentos')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
}

/** Procura um pagamento específico */
export async function getPagamentoById(id) {
  const { data, error } = await supabase
    .from('pagamentos')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
