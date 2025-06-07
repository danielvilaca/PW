// src/api/faturas.js
import { supabase } from '../services/supabaseClient';

/**
 * Busca todas as faturas para o perfil atual:
 * - admin e senhorio veem todas,
 * - inquilino só vê as próprias (user_id = auth.uid()).
 *
 * @param {{ adminParam?: boolean }} opts → se adminParam=true, ignora filtro de user_id
 */
export async function fetchFaturas({ adminParam = false } = {}) {
  // 1. Pega o user autenticado
  const {
    data: { user },
    error: authErr
  } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error('Não autenticado');

  // 2. Pega o perfil para ler o role
  const { data: perfil, error: perfilErr } = await supabase
    .from('perfis')
    .select('role')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;

  // 3. Monta a query base
  let query = supabase
    .from('faturas')
    .select('*')
    .order('ano', { ascending: false })
    .order('mes', { ascending: false });

  // 4. Se não for admin nem senhorio e não passou override, filtra pelo próprio
  if (!adminParam && perfil.role === 'inquilino') {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria nova fatura para ano/mes especificados, associando user_id = auth.uid()
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
 * Deleta fatura
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
 * Busca uma fatura específica
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
