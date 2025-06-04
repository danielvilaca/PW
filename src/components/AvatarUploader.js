import { useState } from 'react';
import { uploadAvatar } from '../api/perfis';
import { useAuth } from '../auth/AuthContext';

const AvatarUploader = () => {
  const { user } = useAuth();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadAvatar(file, user.id);
      alert('Avatar atualizado!');
      console.log('Foto guardada em:', url);
    } catch (err) {
      console.error('SUPABASE ERROR 👉', JSON.stringify(err, null, 2));
      alert(err.message ?? 'Falhou o upload — vê a consola.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">Foto de Perfil</label>
      <div className="d-flex align-items-center gap-4">
        <input
          type="file"
          accept="image/*"
          className="form-control"
          style={{ maxWidth: 250 }}
          onChange={handleChange}
          disabled={uploading}
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="rounded-circle border shadow"
            style={{ width: 80, height: 80, objectFit: 'cover' }}
          />
        )}
      </div>
      {uploading && <div className="form-text text-primary mt-1">A fazer upload...</div>}
    </div>
  );
};

export default AvatarUploader;
