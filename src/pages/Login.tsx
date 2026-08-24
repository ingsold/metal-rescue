import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, KeyRound, ArrowLeft, Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

type AuthMode = 'login' | 'register' | 'forgot_password';

export const Login: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  // Captcha Visual
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    if (mode === 'register') {
      generateCaptcha();
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'register' && canvasRef.current && captchaText) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = '#18181b'; // bg-sabbath-900 (zinc-900)
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add noise lines
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // Draw text
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#e4e4e7'; // zinc-200
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw with slight rotation per character
      for (let i = 0; i < captchaText.length; i++) {
        ctx.save();
        const x = 20 + (i * 20);
        const y = canvas.height / 2;
        ctx.translate(x, y);
        const rotation = (Math.random() - 0.5) * 0.4; // random rotation
        ctx.rotate(rotation);
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
      }
    }
  }, [captchaText, mode]);

  // Password strength
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Muy Débil', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setCaptchaAnswer('');
    generateCaptcha();
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        navigate('/');
      } else if (mode === 'register') {
        // Validate captcha
        if (captchaAnswer !== captchaText) {
          throw new Error('El código de seguridad no coincide. Verifica las mayúsculas y minúsculas e intenta de nuevo.');
        }
        if (strength < 2) {
          throw new Error('La contraseña es muy débil.');
        }
        await registerWithEmail(name, lastName, email, username, password);
        navigate('/');
      } else if (mode === 'forgot_password') {
        await resetPassword(email);
        setSuccessMsg('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        setMode('login');
      }
    } catch (err: any) {
      // Firebase auth error handling
      let errMsg = err.message || 'Ha ocurrido un error.';
      if (errMsg.includes('auth/invalid-credential')) errMsg = 'Credenciales incorrectas.';
      if (errMsg.includes('auth/email-already-in-use')) errMsg = 'El correo ya está registrado.';
      setError(errMsg);
      // Reset captcha on fail
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sabbath-950 flex items-center justify-center p-4">
      <div className="bg-sabbath-900 border border-sabbath-800 p-8 rounded-lg max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sabbath-600 via-sabbath-400 to-sabbath-600"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sabbath-800 border border-sabbath-700 mb-4 shadow-lg">
            {mode === 'login' && <LogIn className="w-8 h-8 text-sabbath-400" />}
            {mode === 'register' && <UserPlus className="w-8 h-8 text-sabbath-400" />}
            {mode === 'forgot_password' && <KeyRound className="w-8 h-8 text-sabbath-400" />}
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-wider uppercase">
            {mode === 'login' && 'Ingreso'}
            {mode === 'register' && 'Únete al Moshpit'}
            {mode === 'forgot_password' && 'Recuperar Acceso'}
          </h2>
          <p className="text-zinc-400 text-sm mt-2 text-center">
            {mode === 'login' && 'Transforma el metal en ayuda animal.'}
            {mode === 'register' && 'Crea tu cuenta de Donante para subir tus prendas.'}
            {mode === 'forgot_password' && 'Ingresa tu correo para recibir un enlace de recuperación.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
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
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
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
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
            />
          </div>
          
          {mode !== 'forgot_password' && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500"
              />
              
              {mode === 'register' && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div 
                        key={index} 
                        className={`h-1 flex-1 rounded-full ${index < strength ? strengthColors[strength] : 'bg-sabbath-800'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${strength < 2 ? 'text-red-400' : 'text-green-400'}`}>
                    Seguridad: {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>
          )}

          {mode === 'register' && (
            <div className="pt-2 border-t border-sabbath-800">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Ingresa el texto de la imagen</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-sabbath-950 border border-sabbath-800 rounded-md overflow-hidden flex-1 flex justify-center py-2 relative">
                    <canvas 
                      ref={canvasRef} 
                      width={140} 
                      height={40} 
                      className="cursor-not-allowed"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={generateCaptcha}
                    className="p-3 bg-sabbath-900 border border-sabbath-800 rounded-md hover:bg-sabbath-800 text-zinc-400 hover:text-white transition-colors"
                    title="Recargar código"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Escribe el código"
                  value={captchaAnswer}
                  onChange={e => setCaptchaAnswer(e.target.value)}
                  className="w-full bg-sabbath-950 border border-sabbath-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-sabbath-500 tracking-widest text-center"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sabbath-600 hover:bg-sabbath-500 disabled:opacity-50 text-white py-3 rounded-md font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' && <LogIn className="w-5 h-5" />}
                  {mode === 'register' && <UserPlus className="w-5 h-5" />}
                  {mode === 'forgot_password' && <KeyRound className="w-5 h-5" />}
                  <span>
                    {mode === 'login' && 'Entrar'}
                    {mode === 'register' && 'Crear Cuenta'}
                    {mode === 'forgot_password' && 'Enviar Enlace'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {mode === 'login' && (
          <>
            <div className="mt-6 text-center">
              <button 
                onClick={() => { setMode('forgot_password'); resetForm(); }}
                className="text-sm text-sabbath-400 hover:text-white transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sabbath-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-sabbath-900 text-zinc-500">O también puedes</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-md font-bold flex items-center justify-center space-x-3 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continuar con Google</span>
            </button>
            
            <div className="mt-8 text-center text-zinc-400 text-sm">
              ¿No tienes cuenta?{' '}
              <button 
                onClick={() => { setMode('register'); resetForm(); }}
                className="text-white font-bold hover:text-sabbath-400 underline decoration-sabbath-500"
              >
                Regístrate
              </button>
            </div>
          </>
        )}

        {mode !== 'login' && (
          <div className="mt-8 text-center">
            <button 
              onClick={() => { setMode('login'); resetForm(); }}
              className="text-zinc-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Ingreso</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
