import React from 'react';
import PerfilForm from '../components/PerfilForm';

export default function ContaPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
      {/* Removemos “Avatar” separada e deixamos PerfilForm */}
      <PerfilForm />
    </div>
  );
}
