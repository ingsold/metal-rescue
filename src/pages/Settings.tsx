import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Loader2, User as UserIcon, Save, AlertCircle, CheckCircle2, Lock, Shield } from 'lucide-react';
import { updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const Settings: React.FC = () => {
  const { user, updateProfile, logout } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculatePasswordStrength(newPassword);

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength === 0) return '';
    if (strength <= 1) return 'Débil';
    if (strength <= 3) return 'Aceptable';
    return 'Fuerte';
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      showToast('Las contraseñas no coinciden.', 'error');
      setIsPasswordLoading(false);
      return;
    }
    
    if (strength < 2) {
      showToast('La contraseña es demasiado débil.', 'error');
      setIsPasswordLoading(false);
      return;
    }

    try {
      if (auth.currentUser) {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
        showToast('Contraseña actualizada correctamente.', 'success');
        setPasswordSuccess(null);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast('No hay usuario autenticado.', 'error');
      }
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        showToast('Por seguridad, cerraremos tu sesión. Vuelve a ingresar para cambiar tu contraseña.', 'error');
        setTimeout(async () => {
          await logout();
          navigate('/login');
        }, 3000);
      } else {
        showToast(err.message || 'Error al actualizar la contraseña.', 'error');
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };


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
      showToast('Perfil actualizado correctamente.', 'success');
      setSuccessMsg(null);
    } catch (err: any) {
      showToast(err.message || 'Error al actualizar el perfil.', 'error');
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
                value={user.email || ''}
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

        {/* Change Password Section */}
        <div className="bg-sabbath-900 border border-sabbath-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-sabbath-800 pb-4">
            <Lock className="w-6 h-6 text-sabbath-400" />
            <h2 className="text-xl font-bold text-white">Seguridad y Contraseña</h2>
          </div>

          {passwordError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nueva Contraseña</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
              />
              
              {newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Nivel de seguridad:
                    </span>
                    <span className={`font-bold ${
                      strength <= 1 ? 'text-red-400' : strength <= 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="w-full bg-sabbath-950 rounded-full h-1.5 overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full ${strength >= 1 ? getStrengthColor() : 'bg-transparent'}`}></div>
                    <div className={`h-full flex-1 rounded-full ${strength >= 2 ? getStrengthColor() : 'bg-sabbath-800'}`}></div>
                    <div className={`h-full flex-1 rounded-full ${strength >= 3 ? getStrengthColor() : 'bg-sabbath-800'}`}></div>
                    <div className={`h-full flex-1 rounded-full ${strength >= 4 ? getStrengthColor() : 'bg-sabbath-800'}`}></div>
                    <div className={`h-full flex-1 rounded-full ${strength >= 5 ? getStrengthColor() : 'bg-sabbath-800'}`}></div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Usa 8+ caracteres, mayúsculas, minúsculas, números y símbolos.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
              />
            </div>

            <div className="pt-4 border-t border-sabbath-800">
              <button
                type="submit"
                disabled={isPasswordLoading || strength < 2 || !newPassword}
                className="bg-sabbath-600 hover:bg-sabbath-500 text-white px-6 py-2 rounded font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isPasswordLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
