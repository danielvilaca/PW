import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { fetchPerfil, createPerfil, updatePerfil } from '../api/perfis';
import { useAuth } from '../auth/AuthContext';

const bucket = 'avatars';

export default function PerfilForm() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        let p = await fetchPerfil(user.id);

        if (!p) {
          await createPerfil({
            user_id: user.id,
            role: 'inquilino',
            nome: '',
            foto_url: null,
          });
          p = await fetchPerfil(user.id);
        }
        setPerfil(p);
      } catch (err) {
        setMensagem('Erro ao carregar perfil!');
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
      setMensagem('Falhou o upload.');
      console.error(upErr);
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      await updatePerfil(user.id, { foto_url: data.publicUrl });
      setPerfil({ ...perfil, foto_url: data.publicUrl });
      setMensagem('Foto de perfil atualizada!');
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updatePerfil(user.id, { nome: perfil.nome });
    setSaving(false);
    setMensagem('Perfil atualizado!');
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="spinner-border text-primary" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
          <span className="visually-hidden">A carregar…</span>
        </div>
      </div>
    );

  if (!perfil)
    return (
      <div className="alert alert-danger my-5">
        Não foi possível carregar o perfil.
      </div>
    );

  return (
    <form onSubmit={handleSave} className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 400 }}>
      <h3 className="mb-3">O meu perfil</h3>
      {mensagem && (
        <div className={`alert ${mensagem.includes('Erro') || mensagem.includes('Falhou') ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensagem}
        </div>
      )}

      <div className="d-flex align-items-center gap-3 mb-3">
        <img
          src={perfil.foto_url || 'https://placehold.co/80'}
          alt="avatar"
          className="rounded-circle border"
          width="80"
          height="80"
        />
        <div>
          <label className="form-label mb-1">Foto de perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={uploadFoto}
            disabled={uploading}
            className="form-control form-control-sm"
          />
          {uploading && (
            <div className="spinner-border spinner-border-sm text-primary ms-2" role="status">
              <span className="visually-hidden">A carregar...</span>
            </div>
          )}
        </div>
      </div>

      {/* nome */}
      <div className="mb-3">
        <label className="form-label">Nome</label>
        <input
          name="nome"
          value={perfil.nome || ''}
          onChange={handleChange}
          className="form-control"
          placeholder="Nome"
          required
        />
      </div>

      {/* email (read-only) */}
      <div className="mb-4">
        <label className="form-label">E-mail</label>
        <input
          value={user.email}
          readOnly
          className="form-control-plaintext"
        />
      </div>

      <button
        className="btn btn-primary w-100"
        disabled={saving}
      >
        {saving ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            A guardar…
          </>
        ) : 'Guardar'}
      </button>
    </form>
  );
}
