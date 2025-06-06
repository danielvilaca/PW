// src/api/orcamentos.js

import { supabase } from '../services/supabaseClient';

/**
 * Retorna todos os orçamentos de um pedido, incluindo
 * o nome e o foto_url do usuário (via perfis).
 */
export const fetchOrcamentos = async (pedido_id) => {
  // No Supabase, “perfis” é a tabela que guarda { user_id, nome, foto_url, role, ... }
  // Usamos “perfis!inner(nome, foto_url)” para trazer esses dois campos.
  const { data, error } = await supabase
    .from('orcamentos')
    .select(`
      id,
      pedido_id,
      fornecedor,
      contacto,
      valor,
      anexo_url,
      user_id,
      perfis!inner(nome, foto_url),
      created_at
    `)
    .eq('pedido_id', pedido_id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Ajustamos o formato para que OrcamentoCard tenha “nome” e “foto_url” diretamente:
  return data.map((o) => ({
    id: o.id,
    pedido_id: o.pedido_id,
    fornecedor: o.fornecedor,
    contacto: o.contacto,
    valor: o.valor,
    anexo_url: o.anexo_url,
    created_at: o.created_at,
    user_id: o.user_id,
    nome: o.perfis.nome,
    foto_url: o.perfis.foto_url,
  }));
};

/**
 * Cria um novo orçamento. Deve passar { pedido_id, fornecedor, contacto, valor, anexo_url }
 * e supor que supabase.auth.getUser() deu o “user_id” do inquilino atualmente logado.
 */
export const createOrcamento = async ({
  pedido_id,
  fornecedor,
  contacto,
  valor,
  anexo_url,
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('orcamentos')
    .insert([
      {
        pedido_id,
        fornecedor,
        contacto,
        valor,
        anexo_url,
        user_id: user.id,
      },
    ])
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const updateOrcamento = async (id, updates) => {
  const { data, error } = await supabase
    .from('orcamentos')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const deleteOrcamento = async (id) => {
  const { error } = await supabase.from('orcamentos').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const getOrcamentoById = async (id) => {
  const { data, error } = await supabase
    .from('orcamentos')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};
