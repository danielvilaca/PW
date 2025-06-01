import { supabase } from '../services/supabaseClient';

export const fetchPagamentos = async (isAdmin, userId) => {
  const q = supabase.from('pagamentos').select('*').order('data_pg', { ascending: false });
  const { data, error } = isAdmin ? await q : await q.eq('user_id', userId);
  if (error) throw error;
  return data;
};

export const criarPagamento = async (pg) => {
  const { error } = await supabase.from('pagamentos').insert(pg);
  if (error) throw error;
};

export const eliminarPagamento = async (id) => {
  const { error } = await supabase.from('pagamentos').delete().eq('id', id);
  if (error) throw error;
};
