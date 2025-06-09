import { supabase } from '../services/supabaseClient';

/**
 * Procura todas as faturas para o perfil atual
 *
 * @param {{ adminParam?: boolean }} opts
 */
export async function fetchFaturas({ adminParam = false } = {}) {
  const {
    data: { user },
    error: authErr
  } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error('Não autenticado');


  const { data: perfil, error: perfilErr } = await supabase
    .from('perfis')
    .select('role')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;


  let query = supabase
    .from('faturas')
    .select('*')
    .order('ano', { ascending: false })
    .order('mes', { ascending: false });

  if (!adminParam && perfil.role === 'inquilino') {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria nova fatura para ano/mes associando user_id = auth.uid()
 */
export async function createFatura({ ano, mes, valor, condominio_id = null, pdf_url = null }) {
  const {
    data: { user },
    error: authErr
  } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error('Não autenticado');

  const { data, error } = await supabase
    .from('faturas')
    .insert([{
      user_id: user.id,
      condominio_id,
      ano,
      mes,
      valor,
      pago: false,
      pdf_url,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualiza fatura (ex: marcar como paga)
 */
export async function updateFatura(id, updates) {
  const { data, error } = await supabase
    .from('faturas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Apaga fatura
 */
export async function deleteFatura(id) {
  const { data, error } = await supabase
    .from('faturas')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
}

/**
 * Procura uma fatura específica
 */
export async function getFaturaById(id) {
  const { data, error } = await supabase
    .from('faturas')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
