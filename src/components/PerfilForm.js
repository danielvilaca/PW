import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { fetchPerfil, updatePerfil } from '../api/perfis';
import { useAuth } from '../auth/AuthContext';

const bucket = 'avatars';

export default function PerfilForm() {
  const { user } = useAuth();
  const [perfil, setPerfil]   = useState(null);
  const [email,  setEmail]    = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);


  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const p = await fetchPerfil(user.id);
        setPerfil(p);

        setEmail(user.email);
      } catch (err) {
        console.error('PERFIL-FORM-ERROR →', err);
      }
    })();
  }, [user]);


  const handleChange = (e) =>
    setPerfil({ ...perfil, [e.target.name]: e.target.value });

  const uploadFoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);

    const path = `${user.id}-${Date.now()}`;
    const { error: upErr } = await supabase
      .storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (upErr) {
      console.error('UPLOAD-ERROR →', upErr);
      alert('Falhou o upload.');
    } else {
      const { data } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(path);

      await updatePerfil(user.id, { foto_url: data.publicUrl });
      setPerfil({ ...perfil, foto_url: data.publicUrl });
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    await updatePerfil(user.id, { nome: perfil.nome });
    setSaving(false);
    alert('Perfil atualizado!');
  };

  if (!perfil) return null;

  return (
    <form onSubmit={handleSave} className="max-w-md space-y-4">

      <div className="flex items-center gap-4">
        <img
          src={perfil.foto_url || 'https://placehold.co/80'}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <input
          type="file"
          accept="image/*"
          onChange={uploadFoto}
          disabled={uploading}
        />
      </div>

      <input
        name="nome"
        value={perfil.nome || ''}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Nome"
      />

      <input
        value={email}
        readOnly
        className="w-full border p-2 rounded bg-gray-50"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={saving}
      >
        {saving ? 'A guardar…' : 'Guardar'}
      </button>
    </form>
  );
}
