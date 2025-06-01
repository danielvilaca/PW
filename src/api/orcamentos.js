import { supabase } from '../services/supabaseClient';

// Criar orçamento
export async function createOrcamento(orcamento) {
  const { error } = await supabase.from('orcamentos').insert([orcamento]);
  if (error) throw error;
}

// Buscar orçamentos
export async function fetchOrcamentos() {
  const { data, error } = await supabase.from('orcamentos').select('*');
  if (error) throw error;
  return data;
}
