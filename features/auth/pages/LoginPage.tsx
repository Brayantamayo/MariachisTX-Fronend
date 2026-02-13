
import React, { useState } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Mail, Lock, Music } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) {
        alert("Credenciales incorrectas. Por favor verifica los datos de prueba.");
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      
      {/* Decorative Ambient Light (Behind Card) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up mx-4 ring-1 ring-white/5">
        
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-primary-900 via-primary-600 to-primary-900"></div>

        <div className="p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600/30 to-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/30 shadow-lg shadow-primary-900/20 transform rotate-3">
                 <Music className="text-primary-500 h-7 w-7" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-1 tracking-wide">BIENVENIDO</h3>
            <p className="text-gray-400 text-xs font-medium tracking-wide uppercase opacity-70">Ingresa tus credenciales</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-800/60 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all text-sm font-medium"
                  placeholder="usuario@texas.com"
                  required
                />
              </div>
            </div>

            <div>
               <div className="flex justify-between items-center mb-1.5 ml-1">
                 <label className="block text-[10px] font-bold text-primary-500 uppercase tracking-widest">Contraseña</label>
                 <button 
                    type="button" 
                    onClick={() => onNavigate('/forgot-password')}
                    className="text-[10px] text-gray-500 hover:text-white transition-colors font-medium"
                 >
                    ¿Olvidaste tu contraseña?
                 </button>
               </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-800/60 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] uppercase tracking-widest text-xs mt-2 active:scale-[0.98]"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center pt-5 border-t border-white/5">
            <p className="text-gray-400 text-xs">
              ¿No tienes cuenta?{' '}
              <button 
                onClick={() => onNavigate('/register')}
                className="text-primary-500 font-bold hover:text-primary-400 transition-colors"
              >
                Regístrate
              </button>
            </p>
          </div>
          
          {/* Credentials Hint (Subtle) */}
          <div className="mt-4 text-center opacity-40 hover:opacity-100 transition-opacity duration-300">
             <p className="text-[9px] text-gray-500 font-mono mb-1">
               Admin: admin@texas.com | 123456
             </p>
             <p className="text-[9px] text-gray-500 font-mono">
               Nuevo: brayan@texas.com | 123456
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
