// src/api/faturas.js
import { supabase } from '../services/supabaseClient';

/**
 * Busca todas as faturas para o perfil atual:
 * - admin vê todas,
 * - “inquilino” só vê as faturas cujo user_id = auth.uid(),
 * - “senhorio” (se aplicável) só vê faturas de inquilinos de seus condomínios.
 *
 * @param {{ admin?: boolean }} opts → se admin=true, ignora filtro de user_id
 */
export async function fetchFaturas({ admin = false } = {}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  // Pega perfil para identificar role
  const { data: perfilData, error: perfilErr } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;
  const perfil = perfilData;

  let query = supabase.from('faturas').select('*').order('ano', { ascending: false }).order('mes', { ascending: false });

  if (perfil.role === 'admin') {
    // sem filtro
  } else if (perfil.role === 'senhorio') {
    // ex.: supor que “faturas” tem coluna condominio_id:
    query = query.in(
      'condominio_id',
      supabase
        .from('senhorio_condominio')
        .select('condominio_id')
        .eq('senhorio_id', perfil.user_id)
    );
  } else {
    // inquilino: só faturas associadas ao próprio user_id
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria nova fatura para ano/mes especificados, associando user_id automáticamente.
 * Também aceita um URL de PDF já gerado (pdf_url).
 *
 * @param {{ user_id?: string, condominio_id?: string, ano: number, mes: number, valor: number, pago?: boolean, pdf_url?: string }} faturaData
 */
export async function createFatura({ ano, mes, valor, condominio_id, pdf_url = null }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { data, error } = await supabase
    .from('faturas')
    .insert([
      {
        user_id: user.id,
        condominio_id,
        ano,
        mes,
        valor,
        pago: false,
        pdf_url,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Marca a fatura como paga (pago = true) e retorna o registo atualizado.
 *
 * @param {string} id
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
 * Deleta a fatura (apenas admin ou inquilino próprio até certo ponto, conforme RLS).
 *
 * @param {string} id
 */
export async function deleteFatura(id) {
  const { data, error } = await supabase.from('faturas').delete().eq('id', id);
  if (error) throw error;
  return data;
}

/**
 * Pega uma fatura específica por ID (útil para visualizar ou gerar PDF completo).
 *
 * @param {string} id
 */
export async function getFaturaById(id) {
  const { data, error } = await supabase.from('faturas').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
