import { supabase } from '../services/supabaseClient';

// Obter todos
export const fetchPedidos = async () => {
  const { data, error } = await supabase.from('pedidos').select('*');
  if (error) throw error;
  return data;
};

// Criar um novo
export const criarPedido = async (pedido) => {
  const { data, error } = await supabase.from('pedidos').insert([pedido]);
  if (error) throw error;
  return data;
};
