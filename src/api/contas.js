// src/api/contas.js

import { supabase } from '../services/supabaseClient';

/**
 * Convida/cria um novo usuário via Supabase Auth e insere na tabela perfis.
 * @param {object} data - deve conter:
 *   - email (string)
 *   - role  (string: 'admin', 'senhorio' ou 'inquilino')
 *   - nome  (string)
 *
 * Retorna o perfil criado (incluindo o user_id do Auth e os campos em perfis).
 */
export const createConta = async ({ email, role, nome }) => {
  // 1) Cria o usuário no Supabase Auth via signUp (gera e-mail de confirmação)
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password: Math.random().toString(36).slice(-8), // senha temporária gerada aleatoriamente
    email_confirm: true, // opcional: define como confirmado automaticamente
  });
  if (authErr) throw authErr;

  const user_id = authData.user.id;

  // 2) Insere o perfil na tabela perfis
  const perfilObj = {
    user_id,
    role,
    nome,
    validated: role === 'admin' ? true : false, // se quiser validar diretamente para admin
    foto_url: null,
    condominio_id: null, // inquilino ou senhorio poderá editar depois
  };

  const { data: inserted, error: insertErr } = await supabase
    .from('perfis')
    .insert(perfilObj)
    .select('*')
    .single();

  if (insertErr) throw insertErr;
  return inserted;
};

/**
 * Busca todos os perfis (admin-only).
 */
export const fetchContas = async () => {
  const { data, error } = await supabase.from('perfis').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Atualiza um perfil existente (por ex.: alterar role, validar, trocar nome).
 * Só admin pode alterar qualquer perfil. Inquilino/senhorio podem atualizar próprio nome/foto.
 *
 * @param {string} userId - campo user_id que queremos alterar
 * @param {object} updates - ex.: { role: 'senhorio', validated: true, nome: 'Novo Nome' }
 */
export const updateConta = async (userId, updates) => {
  const { data: updated, error } = await supabase
    .from('perfis')
    .update(updates)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return updated;
};

/**
 * Remove um perfil e exclui o usuário do Auth.
 * @param {string} userId - deve ser o user_id em perfis (UUID)
 */
export const deleteConta = async (userId) => {
  // 1) Deleta perfil em perfis
  const { error: deletePerfilErr } = await supabase.from('perfis').delete().eq('user_id', userId);
  if (deletePerfilErr) throw deletePerfilErr;

  // 2) Deleta usuário do Auth (admin)
  const { error: deleteUserErr } = await supabase.auth.admin.deleteUser(userId);
  if (deleteUserErr) throw deleteUserErr;

  return true;
};
