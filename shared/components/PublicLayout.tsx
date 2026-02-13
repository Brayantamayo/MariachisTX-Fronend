import React, { useState, useEffect } from 'react';
import { Music, Star, Menu, X } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const PublicLayout: React.FC<Props> = ({ children, onNavigate, currentPath }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INICIO', id: 'inicio' },
    { name: 'CONÓCENOS', id: 'conocenos' },
    { name: 'GALERÍA', id: 'galeria' }
  ];

  const handleNavClick = (sectionId: string) => {
    if (currentPath !== '/') {
      onNavigate('/');
      // Pequeño timeout para permitir que la navegación ocurra antes del scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 font-sans text-white overflow-x-hidden selection:bg-primary-600 selection:text-white relative">
      
      {/* --- BACKGROUND EFFECTS GLOBAL --- */}
      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', 
             backgroundSize: '4rem 4rem' 
           }}>
      </div>
      
      {/* Red Glow Spotlights (Animated) */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-900/20 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-900/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/90 backdrop-blur-md border-white/10 py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center">
            
            {/* Logo - Relative Z-10 to stay on top */}
            <div className="relative z-10 flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('/')}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600 blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-black border border-white/20 p-2 rounded-lg group-hover:border-primary-500/50 transition-colors">
                  <Music className="text-primary-500 h-6 w-6" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-widest leading-none text-white">MARIACHIS</span>
                <span className="text-sm font-bold text-primary-500 tracking-[0.3em] leading-none mt-1">TEXAS</span>
              </div>
            </div>

            {/* Desktop Navigation - ABSOLUTE CENTERED */}
            {/* Esto asegura que esté matemáticamente centrado en la pantalla, independientemente del ancho del logo o botones */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center bg-white/5 backdrop-blur-sm rounded-full px-8 py-2.5 border border-white/10 gap-8 shadow-2xl">
              {navLinks.map((item) => (
                <button 
                  key={item.name}
                  onClick={() => handleNavClick(item.id)} 
                  className="text-xs font-bold tracking-widest text-gray-300 hover:text-white hover:text-primary-500 transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                </button>
              ))}
            </div>

            {/* Auth Buttons - Relative Z-10 */}
            <div className="hidden md:flex items-center gap-6 relative z-10">
              <button 
                onClick={() => onNavigate('/register')}
                className={`text-xs font-bold tracking-widest transition-colors relative group ${currentPath === '/register' ? 'text-primary-500' : 'text-white hover:text-primary-500'}`}
              >
                REGISTRARSE
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 transition-all ${currentPath === '/register' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              
              <button 
                onClick={() => onNavigate('/login')}
                className={`
                  relative overflow-hidden group px-6 py-2.5 rounded-lg font-bold text-xs tracking-widest transition-all duration-300 border
                  ${currentPath === '/login' 
                    ? 'bg-primary-600 text-white border-primary-500 shadow-[0_0_30px_rgba(220,38,38,0.8)]' 
                    : 'bg-black text-white border-primary-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-primary-600 hover:shadow-[0_0_40px_rgba(220,38,38,0.9)] hover:-translate-y-0.5'
                  }
                `}
              >
                <span className="relative z-10 flex items-center gap-2">
                  INICIAR SESIÓN
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
              </button>
            </div>

            {/* Mobile Menu Button - Relative Z-10 */}
            <div className="md:hidden relative z-10">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/10 backdrop-blur-xl p-4 flex flex-col gap-4">
                 {navLinks.map((item) => (
                    <button key={item.name} onClick={() => handleNavClick(item.id)} className="text-left py-2 px-4 text-sm font-bold tracking-widest text-white border-l-2 border-transparent hover:border-primary-500 hover:bg-white/5">
                        {item.name}
                    </button>
                 ))}
                 <div className="h-px bg-white/10 my-2"></div>
                 <button onClick={() => { onNavigate('/login'); setMobileMenuOpen(false); }} className="text-left py-2 px-4 text-sm font-bold tracking-widest text-primary-500">
                     INICIAR SESIÓN
                 </button>
                 <button onClick={() => { onNavigate('/register'); setMobileMenuOpen(false); }} className="text-left py-2 px-4 text-sm font-bold tracking-widest text-white">
                     REGISTRARSE
                 </button>
            </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
};