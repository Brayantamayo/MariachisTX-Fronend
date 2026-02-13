
import React, { useEffect, useRef } from 'react';
import { Music, Clock, Users, ChevronRight, Star, Phone, Instagram, Award, MapPin, Play } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

// Hook para animaciones al hacer scroll
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '50px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

// Componente Interno para efecto Bento
const BentoCard: React.FC<{ 
    children: React.ReactNode, 
    className?: string, 
    title?: string, 
    icon?: React.ReactNode,
    delay?: string
}> = ({ children, className = "", title, icon, delay = "delay-0" }) => (
    <div className={`reveal-on-scroll opacity-0 ${delay} group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/10 p-6 hover:border-white/20 transition-all duration-500 hover:bg-neutral-800/50 ${className}`}>
        {/* Spotlight Effect Gradient */}
        <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
             style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(220, 38, 38, 0.1), transparent 40%)' }}>
        </div>
        <div className="relative z-10 h-full flex flex-col">
            {icon && <div className="mb-4 text-primary-500 bg-white/5 w-fit p-3 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-900/10">{icon}</div>}
            {title && <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{title}</h3>}
            <div className="text-gray-400 text-sm leading-relaxed flex-grow">{children}</div>
        </div>
    </div>
);

// Componente Marquee
const Marquee: React.FC<{ children: React.ReactNode, reverse?: boolean }> = ({ children, reverse = false }) => (
    <div className="relative flex w-full overflow-hidden select-none group">
        <div className={`flex min-w-full shrink-0 gap-4 justify-around py-4 animate-scroll ${reverse ? 'direction-reverse' : ''} group-hover:[animation-play-state:paused]`}>
            {children}
            {children} 
        </div>
        <div className={`absolute top-0 flex min-w-full shrink-0 gap-4 justify-around py-4 animate-scroll ${reverse ? 'direction-reverse' : ''} group-hover:[animation-play-state:paused]`} aria-hidden="true">
            {children}
            {children}
        </div>
    </div>
);

const ReviewCard: React.FC<{ name: string, text: string, stars: number }> = ({ name, text, stars }) => (
    <div className="w-[280px] md:w-[300px] flex-shrink-0 rounded-xl bg-neutral-900/80 border border-white/10 p-6 backdrop-blur-sm hover:border-primary-500/30 transition-colors duration-300">
        <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < stars ? "text-primary-500 fill-primary-500" : "text-gray-700"} />
            ))}
        </div>
        <p className="text-gray-300 text-sm mb-4 italic">"{text}"</p>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 flex items-center justify-center text-xs font-bold text-white shadow-md">
                {name.charAt(0)}
            </div>
            <span className="text-sm font-bold text-white">{name}</span>
        </div>
    </div>
);

export const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  useScrollReveal();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const reviews = [
      { name: "Andrea Gómez", text: "Hicieron de mi boda un sueño. La presentación impecable.", stars: 5 },
      { name: "Carlos Ruiz", text: "Muy puntuales y el repertorio excelente. Los recomiendo 100%.", stars: 5 },
      { name: "María P.", text: "La serenata a mi madre fue emotiva. Grandes músicos.", stars: 5 },
      { name: "Jorge L.", text: "Energía pura. Levantaron la fiesta en minutos.", stars: 4 },
  ];

  return (
    <>
      {/* HERO SECTION - H-SCREEN for No Scroll */}
      <section id="inicio" className="relative h-screen flex flex-col pt-16 md:pt-20 overflow-hidden">
        {/* Background Gradients & Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] md:w-[1000px] md:h-[500px] bg-primary-600/20 blur-[120px] rounded-full -z-10 opacity-50 animate-pulse-slow"></div>
        
        {/* Floating Particles/Blobs */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl animate-float-slow -z-10"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float -z-10"></div>

        {/* Main Content Centered Vertically */}
        <div className="flex-grow flex flex-col justify-center items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center z-10 w-full">
          
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-900/30 backdrop-blur-md mb-6 animate-fade-in-up hover:bg-primary-900/40 transition-colors cursor-default hover:scale-105 duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-primary-200 uppercase">
              #1 En Medellín y Antioquia
            </span>
          </div>

          {/* Main Title with Gradient & Shadow */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-bold leading-none mb-4 md:mb-6 tracking-tight animate-fade-in-up delay-150">
            <span className="block text-white drop-shadow-2xl transition-transform hover:scale-[1.02] duration-500 cursor-default">MARIACHIS</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-primary-500 via-primary-600 to-primary-900 drop-shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-float">
              TEXAS
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-xl md:max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-300 px-4">
            No solo tocamos música, creamos <span className="text-primary-400 font-medium">atmósferas</span>. 
            Vive la tradición mexicana con un toque de elegancia moderna.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center animate-fade-in-up delay-500 w-full px-4 sm:px-0">
            <button 
              onClick={() => onNavigate('/register')}
              className="w-full sm:w-auto group relative px-8 py-4 bg-primary-600 rounded-lg min-w-[200px] overflow-hidden transition-all active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:-translate-y-1"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
               <span className="relative font-bold tracking-widest text-xs uppercase text-white flex items-center justify-center gap-2">
                 Reservar Ahora <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </span>
            </button>
            
            <button 
              onClick={() => scrollToSection('conocenos')}
              className="w-full sm:w-auto px-8 py-4 rounded-lg min-w-[200px] border border-white/10 hover:bg-white/5 transition-all text-xs font-bold tracking-widest uppercase text-white hover:border-white/30"
            >
              Conócenos
            </button>
          </div>
        </div>

        {/* Infinite Scroll Strip Bottom Hero - Anchored at bottom */}
        <div className="w-full border-y border-white/5 bg-black/30 backdrop-blur-sm py-4 z-20 animate-fade-in-up delay-700">
             <Marquee>
                {["BODAS", "SERENATAS", "CUMPLEAÑOS", "QUINCEAÑERAS", "EMPRESARIALES", "RECONCILIACIONES", "DESPEDIDAS", "GRADOS"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 md:gap-4 px-4 md:px-8 group/item hover:scale-110 transition-transform cursor-default">
                        <Star size={10} className="text-primary-600 fill-primary-600" />
                        <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-gray-400 whitespace-nowrap group-hover/item:text-white transition-colors">{item}</span>
                    </div>
                ))}
             </Marquee>
        </div>
      </section>

      {/* SECCIÓN CONÓCENOS (BENTO GRID) */}
      <section id="conocenos" className="py-16 md:py-24 relative bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 reveal-on-scroll opacity-0 transition-all duration-700">
             <div className="max-w-2xl text-center md:text-left">
                <h3 className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase mb-4">La Experiencia Texas</h3>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">MÁS QUE MÚSICA, <br/><span className="text-gray-500">ES UN ESPECTÁCULO.</span></h2>
             </div>
             <p className="text-gray-400 max-w-xs text-sm text-right hidden md:block">
                 Cuidamos cada detalle, desde la vestimenta hasta la última nota musical.
             </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
             
             {/* Card 1: Main Video/Image (Span 2 cols, 2 rows) */}
             <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden border border-white/10 h-[300px] md:h-auto reveal-on-scroll opacity-0 transition-all duration-700">
                <img 
                    src="https://images.unsplash.com/photo-1549836938-f2785bdfae6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                    alt="Mariachis Show" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-50" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-primary-600 group-hover:border-primary-500 transition-all cursor-pointer shadow-lg group-hover:scale-110 duration-300">
                        <Play size={24} className="text-white fill-white ml-1" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Show En Vivo</h3>
                    <p className="text-gray-300 max-w-md text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">Disfruta de una puesta en escena coreográfica y musical que cautivará a todos tus invitados.</p>
                </div>
             </div>

             {/* Card 2: Repertorio */}
             <BentoCard title="Repertorio Ilimitado" icon={<Music size={20} />} className="min-h-[200px]" delay="delay-100">
                 Más de 500 canciones disponibles. Rancheras, Corridos, Boleros y adaptaciones modernas. Tú eliges el setlist.
             </BentoCard>

             {/* Card 3: Puntualidad */}
             <BentoCard title="Puntualidad" icon={<Clock size={20} />} className="md:col-start-3 min-h-[200px]" delay="delay-200">
                 Tu tiempo es sagrado. Llegamos 30 minutos antes para garantizar que el show inicie en el segundo exacto.
             </BentoCard>

          </div>
          
          {/* Bottom Features Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
               {[{l:"Trajes de Gala", i:<Users/>, d: 300}, {l:"Sonido Pro", i:<Music/>, d: 400}, {l:"Disponibilidad 24/7", i:<Phone/>, d: 500}, {l:"Cobertura Total", i:<MapPin/>, d: 600}].map((f, i) => (
                   <div key={i} className={`reveal-on-scroll opacity-0 bg-neutral-900/50 border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/5 transition-all hover:translate-y-[-2px] duration-300`} style={{transitionDelay: `${f.d}ms`}}>
                       <span className="text-primary-500 bg-primary-900/20 p-2 rounded-lg">{f.i}</span>
                       <span className="text-xs font-bold text-white uppercase tracking-wider">{f.l}</span>
                   </div>
               ))}
          </div>
        </div>
      </section>

      {/* REVIEWS MARQUEE */}
      <section className="py-16 md:py-20 border-y border-white/5 bg-black overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none z-10"></div>
          <div className="text-center mb-8 md:mb-12 reveal-on-scroll opacity-0">
            <h3 className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase">Testimonios</h3>
          </div>
          <div className="reveal-on-scroll opacity-0 transition-opacity duration-1000">
            <Marquee>
                {reviews.map((r, i) => (
                    <ReviewCard key={i} {...r} />
                ))}
                {reviews.map((r, i) => (
                    <ReviewCard key={`dup-${i}`} {...r} />
                ))}
            </Marquee>
             <div className="mt-6 md:mt-8">
              <Marquee reverse>
                  {reviews.map((r, i) => (
                      <ReviewCard key={`rev-${i}`} {...r} />
                  ))}
                   {reviews.map((r, i) => (
                      <ReviewCard key={`rev-dup-${i}`} {...r} />
                  ))}
              </Marquee>
             </div>
          </div>
      </section>

      {/* SECCIÓN GALERÍA MASONRY */}
      <section id="galeria" className="py-20 md:py-32 relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-4 reveal-on-scroll opacity-0">
             <div className="text-center md:text-left w-full md:w-auto">
                <h3 className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase mb-4">Galería</h3>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">MOMENTOS <span className="italic text-primary-600">INOLVIDABLES</span></h2>
             </div>
             <button className="hidden md:flex items-center gap-2 text-xs font-bold tracking-widest uppercase border px-4 py-2 rounded-full border-white/20 hover:bg-white hover:text-black transition-all hover:scale-105">
               <Instagram size={14} /> @mariachistexas
             </button>
           </div>

           <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
              {[
                  "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9",
                  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
                  "https://images.unsplash.com/photo-1550985543-f4423c9d7481",
                  "https://images.unsplash.com/photo-1582234033037-b778736e6329",
                  "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
                  "https://images.unsplash.com/photo-1511192336575-5a79af67a629"
              ].map((src, i) => (
                  <div key={i} className={`break-inside-avoid relative group overflow-hidden rounded-2xl reveal-on-scroll opacity-0 transition-all duration-700`} style={{transitionDelay: `${i * 100}ms`}}>
                      <img src={`${src}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} alt="Gallery" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <Instagram className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 scale-125" />
                      </div>
                  </div>
              ))}
           </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-black border-t border-white/10 pt-16 md:pt-24 pb-12 reveal-on-scroll opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                 <div className="bg-primary-600 p-2 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                    <Music className="text-white h-5 w-5" />
                 </div>
                 <span className="text-2xl font-serif font-bold tracking-wide text-white">MARIACHIS TEXAS</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-light">
                Medellín, Colombia. <br/>
                Llevando alegría y tradición desde 2014.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Contacto</h4>
              <ul className="space-y-6 text-sm text-gray-500">
                <li className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer group">
                   <Phone size={14} className="group-hover:text-primary-500 transition-colors"/> +57 300 123 4567
                </li>
                <li className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer group">
                   <Award size={14} className="group-hover:text-primary-500 transition-colors"/> contacto@mariachistexas.com
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Enlaces</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-200">Login Empleados</li>
                <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-200">Política de Privacidad</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-xs uppercase tracking-[0.2em]">
              © 2024 Mariachis Texas Medellín.
            </p>
            <div className="flex gap-4">
                <Instagram size={16} className="text-gray-600 hover:text-white transition-colors cursor-pointer hover:scale-110 duration-200" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
