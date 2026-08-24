import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Loader2, User as UserIcon, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, updateProfile } = useApp();
  
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setDireccion(user.direccion || '');
      setTelefono(user.telefono || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await updateProfile({ name, lastName, username, direccion, telefono });
      setSuccessMsg('Perfil actualizado correctamente.');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-zinc-400">Por favor inicia sesión para ver tus ajustes.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">Configuración</h1>
          <p className="text-zinc-400">Administra los detalles de tu cuenta.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{successMsg}</span>
          </div>
        )}

        <div className="bg-sabbath-900 border border-sabbath-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-sabbath-800 pb-4">
            <UserIcon className="w-6 h-6 text-sabbath-400" />
            <h2 className="text-xl font-bold text-white">Perfil de Usuario</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Apellidos</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre de Usuario (Único)</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                placeholder="Ej. Ciudad de Guatemala, Zona 10"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Teléfono</label>
              <input
                type="tel"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                placeholder="Ej. +502 1234 5678"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-500 mb-1">Correo Electrónico (Solo Lectura)</label>
              <input
                type="email"
                readOnly
                value={user.email}
                className="w-full bg-sabbath-950/50 border border-sabbath-800/50 rounded-md px-4 py-2 text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div className="pt-4 border-t border-sabbath-800">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-sabbath-600 hover:bg-sabbath-500 text-white px-6 py-2 rounded font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
