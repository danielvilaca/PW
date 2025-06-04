// src/api/contas.js
import { supabase } from '../services/supabaseClient';

/**
 * Cria um novo utilizador (Auth) e, logo a seguir, insere o perfil na tabela "perfis".
 * Atenção: `supabase.auth.signUp(...)` envia automaticamente e-mail de confirmação, a menos que tenha desativado
 * essa opção no painel de Authentication. Se quiser convidar sem confirmar, use a API de invite.
 *
 * @param { object } usuario
 * @param { string } usuario.nome
 * @param { string } usuario.email
 * @param { string } usuario.password
 * @param { 'admin' | 'inquilino' | 'senhorio' } usuario.role
 * @returns { perfilCriado }  → Objeto `{ id, user_id, nome, email, role, created_at }`
 */
export async function criarConta({ nome, email, password, role }) {
  // 1) Cria o Auth User
  //    Repare que supabase.auth.signUp retorna (data.user.id, data.user.email, etc).
  //    Se estiver a usar e-mail de confirmação, o utilizador ficará "não confirmado"
  //    até clicar no link. Mas aqui basta gravar o perfil.
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    throw signUpError;
  }

  // signUpData.user.id é o user_id (UUID) que vamos usar em "perfis.user_id"
  const user_id = signUpData.user.id;

  // 2) Insere na tabela "perfis"
  const { data: perfilCriado, error: perfilError } = await supabase
    .from('perfis')
    .insert({
      user_id,
      nome,
      email,
      role,       // 'admin' ou 'inquilino' ou 'senhorio'
      foto_url: null  // por enquanto fica null
    })
    .single();

  if (perfilError) {
    // Se falhar ao inserir o perfil, convém apagar o Auth User recém‐criado
    // para não ficar registado “metade criado”
    await supabase.auth.admin.deleteUser(user_id);
    throw perfilError;
  }

  return perfilCriado;
}

/**
 * Busca todos os perfis (Admin consegue ver tudo).
 */
export async function fetchTodasContas() {
  const { data, error } = await supabase
    .from('perfis')
    .select('id, user_id, nome, email, role');

  if (error) throw error;
  return data;
}

/**
 * Elimina um conjunto de registos: Apaga da tabela 'perfis' e depois
 * elimina também o Auth User. Note que `deleteUser` requer Service Role Key,
 * por isso só vai funcionar se estiver a chamar do lado do Back‐end,
 * ou se tiver configurado no Supabase uma “Function” que receba o user_id e
 * chame deleteUser internamente.
 *
 * @param { string } user_id  → O UUID do Auth User a eliminar
 */
export async function eliminarConta(user_id) {
  // 1) Apaga na tabela 'perfis'
  const { error: delPerfilError } = await supabase
    .from('perfis')
    .delete()
    .eq('user_id', user_id);

  if (delPerfilError) throw delPerfilError;

  // 2) Apaga o Auth User
  const { error: delAuthError } = await supabase.auth.admin.deleteUser(user_id);

  if (delAuthError) throw delAuthError;

  return true;
}

/**
 * Atualiza um perfil (nome e/ou role). O próprio 'email' não deve ser alterado
 * (pode causar inconsistências), mas pode-se atualizar 'nome' e 'role' (admin ou inquilino).
 * Para alterar e-mail ou password, preferir usar a área de “conta” individual ou um endpoint separado.
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

