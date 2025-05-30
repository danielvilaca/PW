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
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 rounded-full border shadow"
        />
      )}
    </div>
  );
};

export default AvatarUploader;
