import { supabase } from '../services/supabaseClient';

/**
 * Recupera todos os orçamentos de um pedido específico.
 * @param {string} pedidoId - PK de “pedidos.id”
 * @returns {Promise<Array>}
 */
export async function fetchOrcamentos(pedidoId) {
  const { data, error } = await supabase
    .from('orcamentos')
    .select('*')
    .eq('pedido_id', pedidoId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Cria um novo orçamento associado a um pedido (quem submete é o inquilino).
 * Usamos “perfil.id” como FK em “orcamentos.user_id”
 * @param {{
 *   pedido_id: string,
 *   fornecedor: string,
 *   contacto: string,
 *   valor: number,
 *   anexo_url: string (opcional)
 * }} orcData
 * @returns {Promise<Object>}
 */
export async function createOrcamento({ pedido_id, fornecedor, contacto, valor, anexo_url }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');


  const { data: perfilData, error: perfilErr } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;
  const perfil = perfilData;


  const { data, error } = await supabase
    .from('orcamentos')
    .insert([
      {
        pedido_id,
        user_id: perfil.id,
        fornecedor,
        contacto,
        valor,
        anexo_url: anexo_url || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualiza um orçamento existente (por id, PK de “orcamentos.id”).
 * @param {string} id
 * @param {{ fornecedor?: string, contacto?: string, valor?: number, anexo_url?: string }} updates
 * @returns {Promise<Object>}
 */
export async function updateOrcamento(id, updates) {
  const { data, error } = await supabase
    .from('orcamentos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Elimina um orçamento (PK).
 * @param {string} id
 */
export async function deleteOrcamento(id) {
  const { data, error } = await supabase
    .from('orcamentos')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
}

/**
 * Procura somente um orçamento pelo seu PK.
 * @param {string} id → PK de “orcamentos.id”
 * @returns {Promise<Object>}
 */
export async function getOrcamentoById(id) {
  const { data, error } = await supabase
    .from('orcamentos')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
