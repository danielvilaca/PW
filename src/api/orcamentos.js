// src/api/orcamentos.js
import { supabase } from '../services/supabaseClient';

/**
 * Retorna todos os orçamentos associados a um pedido específico,
 * filtrando pela role do perfil:
 * - admin vê todos,
 * - senhorio vê os do seu condomínio (assumindo relação pedido->condominio->senhorio),
 * - inquilino vê apenas os que ele próprio criou (user_id = auth.uid()).
 *
 * @param {string} pedidoId
 * @returns {Promise<Array>}
 */
export async function fetchOrcamentos(pedidoId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  // Pega perfil para saber role
  const { data: perfilData, error: perfilErr } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;
  const perfil = perfilData;

  let query = supabase.from('orcamentos').select('*').order('created_at', { ascending: true }).eq('pedido_id', pedidoId);

  if (perfil.role === 'admin') {
    // sem filtro adicional
  } else if (perfil.role === 'senhorio') {
    // exemplo simplificado: pega todos orçamentos cujo pedido pertence a condomínio do senhorio
    query = query.in(
      'pedido_id',
      supabase
        .from('pedidos')
        .select('id')
        .in(
          'condominio_id',
          supabase
            .from('senhorio_condominio')
            .select('condominio_id')
            .eq('senhorio_id', perfil.user_id)
        )
    );
  } else {
    // inquilino: só orçamentos que ele mesmo criou para esse pedido
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria um novo orçamento para um pedido (pedido_id), associando user_id automaticamente.
 *
 * @param {{ pedido_id: string, fornecedor: string, contacto: string, valor: number, anexo_url: string }} orcData
 */
export async function createOrcamento({ pedido_id, fornecedor, contacto, valor, anexo_url }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { data, error } = await supabase
    .from('orcamentos')
    .insert([
      {
        pedido_id,
        user_id: user.id,
        fornecedor,
        contacto,
        valor,
        anexo_url,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualiza um orçamento já existente (o próprio inquilino ou senhorio/admin pode editar, de acordo com RLS).
 *
 * @param {string} id
 * @param {Object} updates → { fornecedor?, contacto?, valor?, anexo_url?, estado? }
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
 * Exclui um orçamento (admin ou proprietário ou senhorio pode, conforme RLS).
 *
 * @param {string} id
 */
export async function deleteOrcamento(id) {
  const { data, error } = await supabase.from('orcamentos').delete().eq('id', id);
  if (error) throw error;
  return data;
}

/**
 * Pega um orçamento específico pelo ID (útil para ver detalhes ou edição).
 *
 * @param {string} id
 */
export async function getOrcamentoById(id) {
  const { data, error } = await supabase.from('orcamentos').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
