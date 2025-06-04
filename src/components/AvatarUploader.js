import { useState } from 'react';
import { uploadAvatar } from '../api/perfis';
import { useAuth } from '../auth/AuthContext';

const AvatarUploader = () => {
  const { user } = useAuth();
  const [preview, setPreview] = useState(null);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      const url = await uploadAvatar(file, user.id);
      alert('Avatar atualizado!');
      console.log('Foto guardada em:', url);
    } catch (err) {
      console.error('SUPABASE ERROR 👉', JSON.stringify(err, null, 2));
      alert(err.message ?? 'Falhou o upload — vê a consola.');
    }
  };

  return (
    <div className="mb-3">
      {/* Label Bootstrap */}
      <label htmlFor="avatarInput" className="form-label">
        Alterar Avatar
      </label>
      {/* Input file Bootstrap */}
      <input
        className="form-control"
        type="file"
        id="avatarInput"
        accept="image/*"
        onChange={handleChange}
      />
      {/* Preview Bootstrap */}
      {preview && (
        <div className="mt-3 d-flex justify-content-center">
          <img
            src={preview}
            alt="preview"
            className="rounded-circle border shadow"
            style={{
              width: '8rem',
              height: '8rem',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
