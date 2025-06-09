import { supabase } from '../services/supabaseClient';

/**
 * Convida/cria um novo user via Supabase Auth e insere na tabela perfis.
 * @param {object} data - deve conter:
 *   - email (string)
 *   - role  (string: "admin", "senhorio" ou "inquilino")
 *   - nome  (string)
 *
 * Retorna o perfil criado (incluindo o user_id do Auth e os campos em perfis).
 */
export const createConta = async ({ email, role, nome }) => {
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password: Math.random().toString(36).slice(-8), // senha temporária gerada aleatoriamente
    email_confirm: true,
  });
  if (authErr) throw authErr;

  const user_id = authData.user.id;


  const perfilObj = {
    user_id,
    role,
    nome,
    validated: role === 'admin' ? true : false,
    foto_url: null,
    condominio_id: null,
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
 * Procura todos os perfis (admin-only).
 */
export const fetchContas = async () => {
  const { data, error } = await supabase.from('perfis').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Atualiza um perfil existente (por ex.: alterar role, validar, trocar nome).
 *
 * @param {string} userId
 * @param {object} updates
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
 * Remove um perfil e exclui o user do Auth.
 * @param {string} userId - deve ser o user_id em perfis (UUID)
 */
export const deleteConta = async (userId) => {
  const { error: deletePerfilErr } = await supabase.from('perfis').delete().eq('user_id', userId);
  if (deletePerfilErr) throw deletePerfilErr;

  const { error: deleteUserErr } = await supabase.auth.admin.deleteUser(userId);
  if (deleteUserErr) throw deleteUserErr;

  return true;
};
