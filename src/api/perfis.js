// src/api/perfis.js

import { supabase } from '../services/supabaseClient';

/**
 * Busca um perfil na tabela `perfis` pelo user_id.
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
export const fetchPerfil = async (userId) => {
  if (!userId) throw new Error('fetchPerfil requer userId');

  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Se não encontrou (code PGRST116), retorna null; caso contrário, lança erro
  if (error && error.code !== 'PGRST116') throw error;
  return data; // retorna perfil ou null se não existir
};

/**
 * Cria um novo perfil na tabela `perfis`.
 * @param {{ user_id: string|null, nome: string, email?: string, password?: string, role: string, foto_url?: string|null, validated?: boolean }} perfilData
 * @returns {Promise<Object>}
 */
export const createPerfil = async (perfilData) => {
  const { data, error } = await supabase
    .from('perfis')
    .insert(perfilData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Criação específica de um perfil admin (usada em Gestão de Contas),
 * onde criamos um registo "não validado" (validated: false) sem user_id no início.
 * O suposto fluxo é que, depois, o Admin clique em "Validar" ou "Desvalidar"
 * para associar/remover user_id quando o utilizador se registar via email.
 *
 * @param {{ nome: string, email: string, password: string, role: string }} obj
 * @returns {Promise<Object>}
 */
export const createPerfilAdmin = async ({ nome, email, password, role }) => {
  const perfilData = {
    user_id: null,
    nome,
    email,
    password,
    role,
    validated: false,
    foto_url: null
  };

  const { data, error } = await supabase
    .from('perfis')
    .insert(perfilData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Atualiza campos específicos no perfil, encontrado via user_id.
 * @param {string} userId
 * @param {{ nome?: string, foto_url?: string, role?: string, email?: string, password?: string, validated?: boolean }} updates
 * @returns {Promise<Object>}
 */
export const updatePerfil = async (userId, updates) => {
  const { data, error } = await supabase
    .from('perfis')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Faz upload de um avatar para o bucket "avatars" e atualiza o campo foto_url no perfil.
 * @param {File} file
 * @param {string} userId
 * @returns {Promise<string>} URL pública da imagem
 */
export const uploadAvatar = async (file, userId) => {
  if (!file) throw new Error('Arquivo de avatar não fornecido');
  if (!userId) throw new Error('userId necessário para uploadAvatar');

  const bucket = 'avatars';
  const filePath = `${userId}/${Date.now()}_${file.name}`;

  // Faz upload do arquivo (upsert = sobregrava se existir)
  const { error: upErr } = await supabase
    .storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (upErr) throw upErr;

  // Obtem a URL pública
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  const fotoUrl = data.publicUrl;

  // Atualiza o campo foto_url no perfil
  await updatePerfil(userId, { foto_url: fotoUrl });

  return fotoUrl;
};

/**
 * Recupera todos os perfis (admin view).
 * @returns {Promise<Array>}
 */
export const fetchTodosPerfis = async () => {
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .order('email', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Atualiza um perfil baseado no seu ID interno (usado em Gestão de Contas para operações admin).
 * @param {string} id
 * @param {{ nome?: string, email?: string, password?: string, role?: string, validated?: boolean }} updates
 * @returns {Promise<void>}
 */
export const updatePerfilAdmin = async (id, updates) => {
  if (!id) throw new Error('updatePerfilAdmin requer id');
  const { error } = await supabase
    .from('perfis')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

/**
 * Elimina um perfil pelo seu ID interno.
 * @param {string} id
 * @returns {Promise<void>}
 */
export const eliminarPerfil = async (id) => {
  if (!id) throw new Error('eliminarPerfil requer id');
  const { error } = await supabase
    .from('perfis')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
