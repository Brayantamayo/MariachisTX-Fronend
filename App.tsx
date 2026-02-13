
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './shared/contexts/AuthContext';
import { Sidebar } from './shared/components/Sidebar';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { LandingPage } from './features/public/pages/LandingPage';
import { HomePage } from './features/home/pages/HomePage';
import { ClientsPage } from './features/clients/pages/ClientsPage';
import { RolesPage } from './features/roles/pages/RolesPage';
import { UsersPage } from './features/users/pages/UsersPage';
import { EmployeesPage } from './features/employees/pages/EmployeesPage';
import { RepertoirePage } from './features/repertoire/pages/RepertoirePage';
import { EnsayosPage } from './features/ensayos/pages/EnsayosPage';
import { ReservasPage } from './features/reservas/pages/ReservasPage';
import { AbonosPage } from './features/abonos/pages/AbonosPage'; 
import { VentasPage } from './features/ventas/pages/VentasPage'; 
import { CotizacionesPage } from './features/cotizaciones/pages/CotizacionesPage'; 
import { DashboardPage } from './features/dashboard/pages/DashboardPage'; 
import { ProfilePage } from './features/profile/pages/ProfilePage';
import { ModuleName, UserRole } from './types';
import { PublicLayout } from './shared/components/PublicLayout';
import { LoadingScreen } from './shared/components/LoadingScreen';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Estado de navegación simple
  const [currentPath, setCurrentPath] = useState<string>('/');

  // Si el usuario se loguea, lo redirigimos al dashboard o home según rol
  useEffect(() => {
    if (isAuthenticated && (currentPath === '/' || currentPath === '/login' || currentPath === '/register' || currentPath === '/forgot-password')) {
      // Clientes y Empleados van a HOME, Admin a Dashboard
      if (user?.role === UserRole.CLIENTE || user?.role === UserRole.EMPLEADO) {
          setCurrentPath('/home');
      } else {
          setCurrentPath('/dashboard');
      }
    }
  }, [isAuthenticated, currentPath, user]);

  // Mostrar pantalla de carga global
  if (isLoading) {
      return <LoadingScreen />;
  }

  // Renderizado para usuarios NO autenticados
  if (!isAuthenticated) {
    const renderPublicContent = () => {
        switch (currentPath) {
          case '/login':
            return <LoginPage onNavigate={setCurrentPath} />;
          case '/register':
            return <RegisterPage onNavigate={setCurrentPath} />;
          case '/forgot-password':
            return <ForgotPasswordPage onNavigate={setCurrentPath} />;
          default:
            return <LandingPage onNavigate={setCurrentPath} />;
        }
    };

    return (
        <PublicLayout onNavigate={setCurrentPath} currentPath={currentPath}>
            {renderPublicContent()}
        </PublicLayout>
    );
  }

  // Router simple para usuarios logueados (Dashboard)
  const renderAppContent = () => {
    const module = currentPath.substring(1) as ModuleName;

    switch (module) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'clientes':
        return <ClientsPage />;
      case 'usuarios':
        return <UsersPage />;
      case 'roles':
        return <RolesPage />;
      case 'empleados':
        return <EmployeesPage />;
      case 'repertorio':
        return <RepertoirePage />;
      case 'ensayos':
        return <EnsayosPage />;
      case 'reservas':
        return <ReservasPage />;
      case 'abonos':
        return <AbonosPage />;
      case 'ventas':
        return <VentasPage />;
      case 'cotizaciones':
        return <CotizacionesPage />;
      case 'perfil':
        return <ProfilePage />;
      default:
        // Si no coincide, redirigir al default de cada rol
        return user?.role === UserRole.ADMIN ? <DashboardPage /> : <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath} />
      <main className="flex-1 ml-72 p-8 transition-all bg-slate-50 text-slate-800">
        {renderAppContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
