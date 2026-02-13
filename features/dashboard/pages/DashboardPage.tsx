
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { UserRole, Reservation } from '../../../types';
import { reservaService } from '../../reservas/services/reservaService';
import { ventaService } from '../../ventas/services/ventaService';
import { clientService } from '../../clients/services/clientService';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Music, 
  ArrowRight,
  CheckCircle,
  X
} from 'lucide-react';

// Componente Interno para Tarjetas KPI
const KpiCard: React.FC<{ title: string, value: string, icon: any, color: string, trend: string }> = ({ title, value, icon: Icon, color, trend }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${colorClasses[color]}`}>
                    <Icon size={22} />
                </div>
                {/* Arrow icon simulated */}
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100">
                    <ArrowRight size={12} className="text-slate-400 -rotate-45" />
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">{trend}</p>
            </div>
        </div>
    );
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    income: 0,
    activeReservations: 0,
    pendingBalance: 0,
    totalClients: 0,
    upcomingEvents: [] as Reservation[],
    recentActivity: [] as Reservation[]
  });
  const [loading, setLoading] = useState(true);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Cargar datos simulados de los servicios
      const reservations = await reservaService.getReservations();
      const sales = await ventaService.getSales();
      const clients = await clientService.getClients();

      // Cálculos básicos
      const activeRes = reservations.filter(r => r.status === 'Confirmado' || r.status === 'Pendiente');
      const totalIncome = sales.reduce((acc, curr) => acc + curr.amount, 0);
      const pending = activeRes.reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0);
      
      // Filtrar según rol
      // Para admin y empleados (cliente ahora usa HomePage)
      let relevantEvents = activeRes;

      // Ordenar por fecha más próxima
      relevantEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

      setStats({
        income: totalIncome,
        activeReservations: activeRes.length,
        pendingBalance: pending,
        totalClients: clients.length,
        upcomingEvents: relevantEvents.slice(0, 5), // Próximos 5
        recentActivity: reservations.slice(0, 5) // Últimas 5 creadas (mock order)
      });

      setLoading(false);
      
      // Mostrar toast de bienvenida
      setTimeout(() => setShowWelcomeToast(true), 500);
      // Ocultar automáticamente
      setTimeout(() => setShowWelcomeToast(false), 5000);
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
      return <div className="p-10 text-center text-slate-400">Cargando tablero...</div>;
  }

  const WelcomeToast = () => (
      createPortal(
        <div className={`fixed top-6 right-6 z-[200] transition-all duration-500 transform ${showWelcomeToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border border-emerald-100 bg-white/95 backdrop-blur-md min-w-[320px]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                    <CheckCircle size={20} strokeWidth={3} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-emerald-950">¡Bienvenido, {user?.name}!</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                        Sesión iniciada correctamente.
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

  // --- VISTA ADMINISTRADOR Y EMPLEADO ---
  // (Nota: Si quieres una vista específica de empleado distinta a la de admin, puedes añadir condicionales aquí)
  
  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <WelcomeToast />
      
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
          <div>
              <h1 className="text-3xl font-serif font-bold text-slate-800">Hola, {user?.name}</h1>
              <p className="text-slate-500 mt-1">Aquí tienes el resumen financiero y operativo de hoy.</p>
          </div>
          <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">FECHA ACTUAL</p>
              <p className="text-lg font-bold text-slate-700">{new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard 
              title="Ingresos Mes" 
              value={`$${stats.income.toLocaleString()}`} 
              icon={TrendingUp} 
              color="emerald" 
              trend="+12% vs mes anterior"
          />
          <KpiCard 
              title="Reservas Activas" 
              value={stats.activeReservations.toString()} 
              icon={Calendar} 
              color="blue" 
              trend="3 eventos esta semana"
          />
          <KpiCard 
              title="Saldo por Cobrar" 
              value={`$${stats.pendingBalance.toLocaleString()}`} 
              icon={DollarSign} 
              color="amber" 
              trend="Gestión de cobro requerida"
          />
          <KpiCard 
              title="Total Clientes" 
              value={stats.totalClients.toString()} 
              icon={Users} 
              color="purple" 
              trend="+2 nuevos esta semana"
          />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif font-bold text-slate-800 text-lg">Actividad Reciente</h3>
                  <button className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">Ver Todo</button>
              </div>
              <div className="space-y-4">
                  {stats.recentActivity.map(res => (
                      <div key={res.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs shadow-sm">
                                  {res.clientName.charAt(0)}
                              </div>
                              <div>
                                  <p className="font-bold text-slate-800 text-sm">{res.eventType} - {res.clientName}</p>
                                  <p className="text-xs text-slate-500">{new Date(res.createdAt).toLocaleDateString()} • {res.status}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="font-bold text-slate-700 text-sm">${res.totalAmount.toLocaleString()}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Valor Total</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Right: Quick Actions & Status */}
          <div className="space-y-6">
              
              {/* Top Repertoire Widget */}
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/10">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center border border-primary-600/30">
                          <Music className="text-primary-500" size={20} />
                      </div>
                      <h3 className="font-serif font-bold text-lg">Top Repertorio</h3>
                  </div>
                  
                  <div className="space-y-5">
                      {/* Song 1 */}
                      <div className="space-y-2">
                          <div className="flex justify-between items-end">
                              <div>
                                  <p className="font-bold text-sm">El Rey</p>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">José Alfredo Jiménez</p>
                              </div>
                              <span className="text-xs font-bold text-primary-500">98 Solicitudes</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-primary-600 to-primary-500 w-[95%]"></div>
                          </div>
                      </div>

                      {/* Song 2 */}
                      <div className="space-y-2">
                          <div className="flex justify-between items-end">
                              <div>
                                  <p className="font-bold text-sm">Si Nos Dejan</p>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">José Alfredo Jiménez</p>
                              </div>
                              <span className="text-xs font-bold text-slate-400">85 Solicitudes</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 w-[80%]"></div>
                          </div>
                      </div>

                      {/* Song 3 */}
                      <div className="space-y-2">
                          <div className="flex justify-between items-end">
                              <div>
                                  <p className="font-bold text-sm">Hermoso Cariño</p>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Vicente Fernández</p>
                              </div>
                              <span className="text-xs font-bold text-slate-400">72 Solicitudes</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 w-[65%]"></div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Quick Shortcuts */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-6">
                  <h3 className="font-serif font-bold text-slate-800 text-lg mb-4">Accesos Rápidos</h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 flex flex-col items-center gap-2 text-center group">
                          <Calendar className="text-primary-600 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-slate-600">Nueva Reserva</span>
                      </button>
                      <button className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 flex flex-col items-center gap-2 text-center group">
                          <DollarSign className="text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-slate-600">Registrar Pago</span>
                      </button>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};
