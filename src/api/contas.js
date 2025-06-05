// src/api/contas.js
import { supabase } from '../services/supabaseClient';

/** Cria uma conta de utilizador e o respetivo perfil.
 *
 * @param { object } usuario
 * @param { string } usuario.nome
 * @param { string } usuario.email
 * @param { string } usuario.password
 * @param { 'admin' | 'inquilino' | 'senhorio' } usuario.role
 * @returns { perfilCriado }
 */
export async function criarConta({ nome, email, password, role }) {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    throw signUpError;
  }

  // signUpData.user.id é o user_id (UUID) que vamos usar em "perfis.user_id"
  const user_id = signUpData.user.id;

  // insert tabela "perfis"
  const { data: perfilCriado, error: perfilError } = await supabase
    .from('perfis')
    .insert({
      user_id,
      nome,
      email,
      role,       // ver roles depois
      foto_url: null //default null
    })
    .single();

  if (perfilError) {
    await supabase.auth.admin.deleteUser(user_id);
    throw perfilError;
  }

  return perfilCriado;
}

/** Procura o perfil do utilizador autenticado.
 *
 */
export async function fetchTodasContas() {
  const { data, error } = await supabase
    .from('perfis')
    .select('id, user_id, nome, email, role');

  if (error) throw error;
  return data;
}

/**
 * Elimina um conjunto de registos: Apaga da tabela "perfis" e depois
 * elimina também o Auth User.
 *
 * @param { string } user_id  → O UUID do Auth User
 */
export async function eliminarConta(user_id) {
  const { error: delPerfilError } = await supabase
    .from('perfis')
    .delete()
    .eq('user_id', user_id);

  if (delPerfilError) throw delPerfilError;

  const { error: delAuthError } = await supabase.auth.admin.deleteUser(user_id);

  if (delAuthError) throw delAuthError;

  return true;
}

/**
 * Atualiza um perfil (nome e/ou role).
 */
export async function atualizarConta({ id, nome, role }) {
  const { data, error } = await supabase
    .from('perfis')
    .update({ nome, role })
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

