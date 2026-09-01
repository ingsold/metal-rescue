import re

with open('src/pages/Settings.tsx', 'r') as f:
    content = f.read()

# Add imports for password update
content = content.replace("import { Loader2, User as UserIcon, Save, AlertCircle, CheckCircle2 } from 'lucide-react';", 
"""import { Loader2, User as UserIcon, Save, AlertCircle, CheckCircle2, Lock, Shield } from 'lucide-react';
import { updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { auth } from '../lib/firebase';""")

# Define Password strength logic and new states inside the component
new_state_logic = """  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      setPasswordError('Las contraseñas no coinciden.');
      setIsPasswordLoading(false);
      return;
    }
    
    if (strength < 2) {
      setPasswordError('La contraseña es demasiado débil.');
      setIsPasswordLoading(false);
      return;
    }

    try {
      if (auth.currentUser) {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
        setPasswordSuccess('Contraseña actualizada correctamente.');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError('No hay usuario autenticado.');
      }
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setPasswordError('Por seguridad, debes cerrar sesión y volver a ingresar para cambiar tu contraseña.');
      } else {
        setPasswordError(err.message || 'Error al actualizar la contraseña.');
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };
"""

content = content.replace("  const [successMsg, setSuccessMsg] = useState<string | null>(null);", new_state_logic)

# Append Password section after the User Profile form
password_ui = """        </div>

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
        </div>"""

content = content.replace("        </div>\n      </div>", password_ui + "\n      </div>")

with open('src/pages/Settings.tsx', 'w') as f:
    f.write(content)
