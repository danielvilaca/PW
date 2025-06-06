// src/api/pedidos.js

import { supabase } from '../services/supabaseClient';

/**
 * Garante que há um registro em perfis.user_id = user.id.
 * Se já existir, retorna-o; se não, cria um perfil “default” de inquilino.
 */
async function ensurePerfilExists(user) {
  // 1. Tenta buscar um perfil cujo user_id === user.id
  const { data: existingPerfil, error: fetchErr } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Se houver erro diferente de “row not found” (PGRST116), relança
  if (fetchErr && fetchErr.code !== 'PGRST116') {
    throw fetchErr;
  }

  // Se já existe, devolve
  if (existingPerfil) {
    return existingPerfil;
  }

  // 2. Se não existe, cria um perfil default com role = 'inquilino'
  const defaultPerfil = {
    user_id: user.id,
    nome: '',
    role: 'inquilino',
    foto_url: null,
    // (quaisquer outros campos obrigatórios em “perfis” podem ir aqui, ex. validated: false, email: user.email, etc.)
  };

  const { data: newPerfil, error: createErr } = await supabase
    .from('perfis')
    .insert(defaultPerfil)
    .select()
    .single();

  if (createErr) {
    throw createErr;
  }

  return newPerfil;
}

/**
 * fetchPedidos()
 *
 * Recupera todos os pedidos que o utilizador logado pode ver:
 * - admin → todos os pedidos
 * - senhorio → nenhum filtro (já que não há condominio_id)
 * - inquilino → apenas os seus próprios pedidos (user_id = current user.id)
 */
export async function fetchPedidos() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  // Busca role no perfil
  const { data: perfilData, error: perfilErr } = await supabase
    .from('perfis')
    .select('role,user_id')
    .eq('user_id', user.id)
    .single();
  if (perfilErr) throw perfilErr;

  const perfil = perfilData;

  let query = supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (perfil.role === 'admin') {
    // Sem filtro
  } else if (perfil.role === 'senhorio') {
    // Aqui, como supomos que NÃO há condominio_id, damos acesso a todos.
    // (Se futuramente tiver condominio_id, bastaria filtrar via in('condominio_id', […]).)
  } else {
    // inquilino: apenas os próprios
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * criarPedido({ titulo, descricao, validade_orcamentos })
 *
 * Antes de inserir, garante que exista um perfil (perfis.user_id = user.id).
 */
export async function criarPedido({ titulo, descricao, validade_orcamentos }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  // Garante que haja perfis.user_id = user.id
  await ensurePerfilExists(user);

  // Insere sem condominio_id (porque tudo faz parte do mesmo condomínio por enquanto)
  const { data, error } = await supabase
    .from('pedidos')
    .insert([
      {
        user_id: user.id,
        titulo,
        descricao,
        validade_orcamentos,
        estado: 'Aberto',
        // condominio_id deixamos de usar (ou ele nem existe em schema)
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * updatePedido(id, updates)
 *
 * Atualiza um pedido já existente. (RLS suporá quem pode editar.)
 */
export async function updatePedido(id, updates) {
  const { data, error } = await supabase
    .from('pedidos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * deletePedido(id)
 *
 * Apaga o pedido cujo ID = id. (RLS suporá se o user pode ou não.)
 */
export async function deletePedido(id) {
  const { data, error } = await supabase.from('pedidos').delete().eq('id', id);
  if (error) throw error;
  return data;
}

/**
 * getPedidoById(id)
 *
 * Pega um único pedido por ID.
 */
export async function getPedidoById(id) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
