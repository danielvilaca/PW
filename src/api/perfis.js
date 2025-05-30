import { supabase } from '../services/supabaseClient';


export const fetchPerfil = async (userId) => {
  if (!userId) throw new Error('fetchPerfil requer userId');

  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // 116 = row not found
  return data;  // pode ser null se ainda não existir
};


export const createPerfil = async (perfil) => {
  const { error } = await supabase.from('perfis').insert(perfil).select().single();
  if (error) throw error;
  return perfil;
};


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


export const uploadAvatar = async (file, userId) => {
  const bucket = 'avatars';
  const filePath = `${userId}/${Date.now()}_${file.name}`;

  // 1) upload (upsert sobrepõe)
  const { error: upErr } = await supabase
    .storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (upErr) throw upErr;


  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  const fotoUrl = data.publicUrl;


  await updatePerfil(userId, { foto_url: fotoUrl });

  return fotoUrl;
};
