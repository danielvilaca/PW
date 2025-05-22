import { supabase } from '../services/supabaseClient';

export const fetchPedidos = async () => {
  const { data, error } = await supabase.from('pedidos').select('*');
  if (error) throw error;
  return data;
};

export const criarPedido = async (pedido) => {
  const { data, error } = await supabase.from('pedidos').insert([pedido]);

  if (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
  return data;
};

export const eliminarPedido = async (id) => {
  const { error } = await supabase.from('pedidos').delete().eq('id', id);
  if (error) throw error;
};

export const updatePedido = async (pedido) => {
  console.log('Dados pedido:', pedido);
  const { error } = await supabase
    .from('pedidos')
    .update(pedido)
    .eq('id', pedido.id);

  if (error) throw error;
};
