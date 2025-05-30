import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { fetchPerfil, createPerfil, updatePerfil } from '../api/perfis';
import { useAuth } from '../auth/AuthContext';

const bucket = 'avatars';

export default function PerfilForm() {
  const { user } = useAuth();
  const [perfil, setPerfil]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        let p = await fetchPerfil(user.id);

        if (!p) {
          await createPerfil({
            user_id : user.id,
            role    : 'inquilino',
            nome    : '',
            foto_url: null,
          });
          p = await fetchPerfil(user.id);
        }
        setPerfil(p);
      } catch (err) {
        console.error('PERFIL-FORM-ERROR →', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleChange = (e) =>
    setPerfil({ ...perfil, [e.target.name]: e.target.value });

  const uploadFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const path = `${user.id}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase
      .storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (upErr) {
      alert('Falhou o upload.');
      console.error(upErr);
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      await updatePerfil(user.id, { foto_url: data.publicUrl });
      setPerfil({ ...perfil, foto_url: data.publicUrl });
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updatePerfil(user.id, { nome: perfil.nome });
    setSaving(false);
    alert('Perfil atualizado!');
  };

  if (loading) return <p>A carregar…</p>;
  if (!perfil)  return <p>Não foi possível carregar o perfil.</p>;

  return (
    <form onSubmit={handleSave} className="max-w-md space-y-4">

      <div className="d-flex align-items-center gap-3">
        <img
          src={perfil.foto_url || 'https://placehold.co/80'}
          alt="avatar"
          className="rounded-circle border"
          width="80"
          height="80"
        />
        <input
          type="file"
          accept="image/*"
          onChange={uploadFoto}
          disabled={uploading}
        />
      </div>

      {/* nome */}
      <input
        name="nome"
        value={perfil.nome || ''}
        onChange={handleChange}
        className="form-control"
        placeholder="Nome"
      />

      {/* email (read-only) */}
      <input
        value={user.email}
        readOnly
        className="form-control-plaintext"
      />

      <button
        className="btn btn-primary"
        disabled={saving}
      >
        {saving ? 'A guardar…' : 'Guardar'}
      </button>
    </form>
  );
}
