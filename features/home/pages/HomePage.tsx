
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Reservation, Rehearsal, UserRole } from '../../../types';
import { reservaService } from '../../reservas/services/reservaService';
import { rehearsalService } from '../../ensayos/services/rehearsalService';
import { 
  Calendar, 
  Clock, 
  Music, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Star,
  Phone,
  CheckCircle,
  X,
  Mic2,
  ListMusic,
  TrendingUp,
  User,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  
  // Estado para Clientes
  const [clientEvents, setClientEvents] = useState<Reservation[]>([]);

  // Estado para Empleados
  const [nextGig, setNextGig] = useState<Reservation | null>(null);
  const [nextRehearsal, setNextRehearsal] = useState<Rehearsal | null>(null);
  const [stats, setStats] = useState({ gigsCount: 0, rehearsalCount: 0 });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
          if (user?.role === UserRole.EMPLEADO) {
              // --- LÓGICA EMPLEADO ---
              const [allReservations, allRehearsals] = await Promise.all([
                  reservaService.getReservations(),
                  rehearsalService.getRehearsals()
              ]);

              const now = new Date();

              // Próximos eventos (Confirmados y Futuros)
              const upcomingGigs = allReservations
                  .filter(r => r.status === 'Confirmado' && new Date(`${r.eventDate}T${r.eventTime}`) >= now)
                  .sort((a, b) => new Date(`${a.eventDate}T${a.eventTime}`).getTime() - new Date(`${b.eventDate}T${b.eventTime}`).getTime());
              
              setNextGig(upcomingGigs.length > 0 ? upcomingGigs[0] : null);

              // Próximos ensayos
              const upcomingRehearsals = allRehearsals
                  .filter(r => r.status === 'Programado' && new Date(`${r.date}T${r.time}`) >= now)
                  .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

              setNextRehearsal(upcomingRehearsals.length > 0 ? upcomingRehearsals[0] : null);

              setStats({
                  gigsCount: upcomingGigs.length,
                  rehearsalCount: upcomingRehearsals.length
              });

          } else {
              // --- LÓGICA CLIENTE ---
              const reservations = await reservaService.getReservations();
              let relevantEvents = [];
              if (user) {
                  relevantEvents = reservations.filter(r => 
                    (r.clientId === user.id || r.clientName.includes(user.name)) && 
                    (r.status === 'Confirmado' || r.status === 'Pendiente')
                  );
              }
              relevantEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
              setClientEvents(relevantEvents.slice(0, 5));
          }
      } catch (error) {
          console.error("Error loading home data", error);
      } finally {
          setLoading(false);
          setTimeout(() => setShowWelcomeToast(true), 500);
          setTimeout(() => setShowWelcomeToast(false), 5000);
      }
    };

    loadData();
  }, [user]);

  const WelcomeToast = () => (
      createPortal(
        <div className={`fixed top-6 right-6 z-[200] transition-all duration-500 transform ${showWelcomeToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border border-emerald-100 bg-white/95 backdrop-blur-md min-w-[320px]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                    <CheckCircle size={20} strokeWidth={3} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-emerald-950">¡Hola de nuevo, {user?.name}!</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                        {user?.role === UserRole.EMPLEADO ? 'Tu agenda está lista.' : 'Bienvenido a Mariachis Texas.'}
                    </p>
                </div>
                <button onClick={() => setShowWelcomeToast(false)} className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg">
                    <X size={18} />
                </button>
            </div>
        </div>,
        document.body
      )
  );

  const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr + 'T00:00:00');
      return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  };

  const getMonthDay = (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      return {
          day: date.getDate(),
          month: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
      };
  };

  if (loading) {
      return <div className="p-10 text-center text-slate-400 flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="animate-pulse">Cargando tu experiencia...</p>
      </div>;
  }

  // --- VISTA DE EMPLEADO (MÚSICO) ---
  if (user?.role === UserRole.EMPLEADO) {
      return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <WelcomeToast />

            {/* Header Compacto con Fecha */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Panel de Músico</h2>
                    <h1 className="text-3xl font-serif font-bold text-slate-800">
                        Hola, {user.name.split(' ')[0]}
                    </h1>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-3xl font-bold text-primary-600 font-serif">
                        {new Date().getDate()}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary-100 transition-all">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toques Pendientes</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.gigsCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Star size={20} className="fill-primary-600" />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ensayos</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.rehearsalCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Music size={20} />
                    </div>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* COL 1 & 2: NEXT GIG (Feature Card) */}
                <div className="lg:col-span-2">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles size={14} className="text-primary-500" /> Tu Próximo Show
                    </h3>
                    
                    {nextGig ? (
                        <div className="relative bg-[#0f172a] rounded-[2rem] p-8 text-white overflow-hidden shadow-2xl shadow-slate-900/20 group">
                            {/* Abstract Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-center min-w-[70px]">
                                        <p className="text-[10px] font-bold uppercase text-white/60">
                                            {getMonthDay(nextGig.eventDate).month}
                                        </p>
                                        <p className="text-2xl font-bold font-serif leading-none mt-0.5">
                                            {getMonthDay(nextGig.eventDate).day}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                            Confirmado
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 leading-tight">
                                        {nextGig.eventType}
                                    </h2>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <User size={14} />
                                        <span>Cliente: {nextGig.clientName}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400">
                                            <Clock size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Hora Inicio</p>
                                            <p className="font-bold text-sm">{nextGig.eventTime}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <MapPin size={16} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Ubicación</p>
                                            <p className="font-bold text-sm truncate">{nextGig.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Music size={16} className="text-primary-500" />
                                        <span className="font-bold">{nextGig.repertoireIds.length} Canciones</span>
                                        <span className="text-slate-600">|</span>
                                        <span className="text-xs text-slate-500">Ver lista</span>
                                    </div>
                                    <button className="bg-white text-slate-900 hover:bg-slate-200 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300">
                                        Detalles <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-dashed border-slate-300 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center h-[300px]">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-slate-800 font-bold text-lg">Sin eventos próximos</h3>
                            <p className="text-slate-500 text-sm mt-2 max-w-xs">Tu agenda está libre por ahora. ¡Aprovecha para ensayar o descansar!</p>
                        </div>
                    )}
                </div>

                {/* COL 3: REHEARSAL & ACTIONS */}
                <div className="space-y-6">
                    
                    {/* Next Rehearsal */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Mic2 size={14} className="text-blue-500" /> Ensayo
                        </h3>
                        {nextRehearsal ? (
                            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <p className="text-xs font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-md mb-3">
                                        {formatDate(nextRehearsal.date)}
                                    </p>
                                    <h4 className="font-serif font-bold text-slate-800 text-lg mb-1">{nextRehearsal.title}</h4>
                                    <p className="text-sm text-slate-500 mb-4">{nextRehearsal.location}</p>
                                    
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl">
                                        <Clock size={14} className="text-blue-500" />
                                        {nextRehearsal.time}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-[1.5rem] border border-slate-200 p-6 text-center">
                                <p className="text-sm text-slate-400 italic">No hay ensayos programados.</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-[1.5rem] border border-slate-200 p-5 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Accesos Rápidos</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-700 transition-colors gap-2 group">
                                <ListMusic size={20} className="text-slate-400 group-hover:text-primary-600" />
                                <span className="text-[10px] font-bold uppercase">Repertorio</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-700 transition-colors gap-2 group">
                                <Calendar size={20} className="text-slate-400 group-hover:text-primary-600" />
                                <span className="text-[10px] font-bold uppercase">Calendario</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      );
  }

  // --- VISTA DE CLIENTE (MANTENIDA PERO PULIDA) ---
  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
        <WelcomeToast />
        
        {/* Welcome Banner */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[380px] flex items-center group bg-black">
            
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1549836938-f2785bdfae6a?q=80&w=2874&auto=format&fit=crop" 
                    alt="Mariachi Background" 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Content */}
                <div className="space-y-6 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gold-400 text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
                        <Sparkles size={14} className="text-gold-500" /> Experiencia Premium
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
                        Bienvenido, <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-primary-500 filter drop-shadow-lg">
                            {user?.name}
                        </span>
                    </h1>
                    
                    <p className="text-slate-300 text-lg font-light leading-relaxed max-w-md">
                        La música es el lenguaje del alma. Estamos listos para hacer de tu próxima celebración un momento inolvidable.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-primary-900/30 hover:-translate-y-1 flex items-center gap-3">
                            <Star size={18} className="fill-white" />
                            Nuevo Evento
                        </button>
                    </div>
                </div>

                {/* Right Content: Highlight Card (Next Event or Promo) */}
                <div className="hidden lg:block relative">
                    {clientEvents.length > 0 ? (
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-white transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-1">Próximo Evento</p>
                                    <h3 className="text-2xl font-serif font-bold">{clientEvents[0].eventType}</h3>
                                </div>
                                <div className="bg-white/20 rounded-xl p-3 text-center min-w-[70px]">
                                    <p className="text-xs font-bold uppercase">
                                        {getMonthDay(clientEvents[0].eventDate).month}
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {getMonthDay(clientEvents[0].eventDate).day}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm text-slate-300">
                                <p className="flex items-center gap-3"><Clock size={16} /> {clientEvents[0].eventTime}</p>
                                <p className="flex items-center gap-3"><MapPin size={16} /> {clientEvents[0].location}</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30`}>
                                    {clientEvents[0].status}
                                </span>
                                <ArrowRight size={20} className="text-white hover:translate-x-2 transition-transform cursor-pointer" />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-white text-center shadow-2xl">
                            <Music className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Sin Eventos Pendientes</h3>
                            <p className="text-sm text-slate-400 mb-6">Agenda tu serenata hoy y vive la magia.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Calendar size={20} className="text-primary-600" />
                        Mis Reservas
                    </h3>
                </div>
                
                {clientEvents.length === 0 ? (
                    <div className="bg-white p-12 rounded-[2rem] border border-slate-200 text-center text-slate-400 flex flex-col items-center">
                        <Calendar size={48} className="mb-4 opacity-20" />
                        <p>No tienes reservas activas en este momento.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {clientEvents.map(event => (
                            <div key={event.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-between items-center group">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-primary-700 transition-colors">{event.eventType}</h4>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-500 border border-slate-200">
                                            #{event.id}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <Calendar size={14} className="text-primary-500" /> 
                                        {formatDate(event.eventDate)} a las {event.eventTime}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-1 ${
                                        event.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-700' : 
                                        event.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {event.status}
                                    </span>
                                    {event.paidAmount < event.totalAmount && (
                                        <p className="text-xs text-red-500 font-bold mt-1 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                                            Saldo: ${(event.totalAmount - event.paidAmount).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm sticky top-8">
                    <h3 className="font-serif font-bold text-slate-800 mb-4 text-lg">Contacto Soporte</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">¿Tienes dudas sobre tu evento o necesitas realizar un cambio? Contáctanos.</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-slate-700 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-xs uppercase text-slate-400">Horario de Atención</p>
                                <p className="font-bold">Lun - Sab: 8am - 8pm</p>
                            </div>
                        </div>
                        <button className="w-full py-4 border-2 border-slate-100 rounded-2xl text-xs font-bold uppercase text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2">
                            <Phone size={16} /> Llamar Ahora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
