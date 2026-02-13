
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { User, Mail, Lock, Phone, MapPin, Calendar, FileText, Camera, Home, Hash, Map, CheckCircle, AlertCircle, X } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    email: '',
    telefono: '',
    telefonoAlternativo: '',
    fechaNacimiento: '',
    ciudad: 'Medellín',
    direccion: '',
    barrio: '',
    zonaServicio: 'Urbana',
    password: '',
    confirmPassword: ''
  });

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showNotification("Las contraseñas no coinciden.", "error");
      return;
    }

    if (formData.password.length < 6) {
        showNotification("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
    }

    console.log("Datos de registro:", formData);
    
    // Éxito
    showNotification("¡Registro exitoso! Redirigiendo al inicio de sesión...", "success");
    
    // Redirección después de 2 segundos para que el usuario lea el mensaje
    setTimeout(() => {
        onNavigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-28 pb-10">
      
      {/* Toast Notification */}
      {notification && createPortal(
        <div className="fixed top-6 right-6 z-[200] animate-fade-in-up">
            <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md min-w-[320px] ${
                notification.type === 'success' 
                ? 'bg-white/95 border-emerald-100 shadow-emerald-900/5' 
                : 'bg-white/95 border-red-100 shadow-red-900/5'
            }`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                    {notification.type === 'success' ? <CheckCircle size={20} strokeWidth={3} /> : <AlertCircle size={20} strokeWidth={3} />}
                </div>
                <div className="flex-1">
                    <h4 className={`font-bold text-sm ${notification.type === 'success' ? 'text-emerald-950' : 'text-red-950'}`}>
                        {notification.type === 'success' ? '¡Excelente!' : '¡Atención!'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">{notification.message}</p>
                </div>
                <button onClick={() => setNotification(null)} className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg">
                    <X size={18} />
                </button>
            </div>
        </div>,
        document.body
      )}

      {/* Glass Card - Container Wider for more fields */}
      <div className="max-w-4xl w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in-up">
        
         {/* Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-primary-900 via-primary-600 to-primary-900"></div>

        <div className="p-8 md:p-10">
           <div className="text-center mb-8">
            <h3 className="text-3xl font-serif font-bold text-white mb-2">Únete a la Familia</h3>
            <p className="text-gray-400 text-sm font-light">Campos obligatorios marcados con <span className="text-primary-500">*</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- SECCIÓN FOTO --- */}
            <div className="flex justify-center mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-dark-800 border-2 border-dashed border-gray-600 flex items-center justify-center group-hover:border-primary-500 transition-colors overflow-hidden">
                  <Camera className="text-gray-500 group-hover:text-primary-500 transition-colors" size={32} />
                  {/* Aquí iría la previsualización de la imagen si se sube una */}
                </div>
                <div className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full shadow-lg">
                  <PlusIcon size={16} className="text-white" />
                </div>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                <p className="text-xs text-center text-gray-500 mt-2 group-hover:text-primary-400">Subir Foto</p>
              </div>
            </div>

            {/* --- GRID PRINCIPAL --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Nombre <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Apellido <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              {/* Tipo Documento */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Tipo Documento <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="CC" className="bg-dark-900 text-gray-300">Cédula de Ciudadanía</option>
                    <option value="CE" className="bg-dark-900 text-gray-300">Cédula de Extranjería</option>
                    <option value="TI" className="bg-dark-900 text-gray-300">Tarjeta de Identidad</option>
                    <option value="PAS" className="bg-dark-900 text-gray-300">Pasaporte</option>
                    <option value="NIT" className="bg-dark-900 text-gray-300">NIT</option>
                  </select>
                </div>
              </div>

              {/* Número Documento */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Número Documento <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="number"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>

              {/* Fecha Nacimiento */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Fecha Nacimiento <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Correo Electrónico <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>

              {/* Teléfono Principal */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Teléfono Principal <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="+57 300..."
                    required
                  />
                </div>
              </div>

              {/* Teléfono Alternativo */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Teléfono Alternativo</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="tel"
                    name="telefonoAlternativo"
                    value={formData.telefonoAlternativo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Ciudad <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Barrio */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Barrio <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="barrio"
                    value={formData.barrio}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="Tu barrio"
                    required
                  />
                </div>
              </div>

              {/* Dirección - Span 2 cols */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Dirección <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="Calle 123 # 45 - 67"
                    required
                  />
                </div>
              </div>

               {/* Zona de Servicio */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Zona de Servicio <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <select
                    name="zonaServicio"
                    value={formData.zonaServicio}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Urbana" className="bg-dark-900 text-gray-300">Urbana</option>
                    <option value="Rural" className="bg-dark-900 text-gray-300">Rural</option>
                  </select>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Contraseña <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Confirmar Contraseña <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 outline-none transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] uppercase tracking-widest text-sm hover:-translate-y-0.5"
              >
                Completar Registro
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button 
                onClick={() => onNavigate('/login')}
                className="text-primary-500 font-bold hover:text-primary-400 transition-colors"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon for the photo upload overlay
const PlusIcon = ({ size, className }: { size: number, className: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
