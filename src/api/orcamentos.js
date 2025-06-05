import { supabase } from '../services/supabaseClient';

/**
 *
 * @param orc Objeto de orçamento a ser criado
 */
export async function createOrcamento(orc) {
  const { error } = await supabase.from('orcamentos').insert([orc]);
  if (error) throw error;
}

/**
 *
 * @param pedidoId ID do pedido para buscar os orçamentos
 * @returns
 */
export async function fetchOrcamentos(pedidoId) {
  const { data, error } = await supabase
    .from('orcamentos')
    .select('id, valor, fornecedor, anexo_url, perfis(nome,foto_url)')
    .eq('pedido_id', pedidoId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
