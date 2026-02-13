
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../../types';
import { 
  BarChart3, 
  UserCircle, 
  Settings, 
  Users, 
  ShoppingCart, 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  Calendar,
  Shield,
  Briefcase,
  Music,
  FileText,
  CreditCard,
  Bookmark,
  ShieldCheck,
  LayoutGrid,
  Circle,
  Home
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout } = useAuth();
  
  // Inicializar estado de menús.
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
      'ventas': false
  });

  // Efecto para mantener abierto el menú correspondiente a la ruta actual
  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    let hasChanges = false;

    const menuGroups = {
        'ventas': ['/reservas', '/ventas', '/cotizaciones', '/abonos', '/clientes'],
        'servicios': ['/repertorio', '/ensayos'],
        'usuarios': ['/usuarios', '/empleados'],
        'gestion': ['/roles']
    };

    Object.entries(menuGroups).forEach(([key, paths]) => {
        if (paths.includes(currentPath) && !newOpenMenus[key]) {
            newOpenMenus[key] = true;
            hasChanges = true;
        }
    });

    if (hasChanges) {
        setOpenMenus(newOpenMenus);
    }
  }, [currentPath]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  if (!user) return null;

  const renderAdminSidebar = () => {
    return (
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
        
        {/* SECCIÓN PRINCIPAL */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-4">Principal</p>
          <ul className="space-y-1">
            <li>
              <MainMenuItem 
                icon={BarChart3} 
                label="Dashboard" 
                path="/dashboard" 
                currentPath={currentPath} 
                onNavigate={onNavigate} 
              />
            </li>
            <li>
              <MainMenuItem 
                icon={UserCircle} 
                label="Mi Perfil" 
                path="/perfil" 
                currentPath={currentPath} 
                onNavigate={onNavigate} 
              />
            </li>
          </ul>
        </div>

        {/* GRUPOS DE ACORDEÓN */}
        <div className="space-y-3">
            
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-6 mb-3 px-4">Administración</p>

            {/* 1. GESTIÓN */}
            <MenuDropdown 
                id="gestion" 
                label="Gestión" 
                icon={Settings} 
                isOpen={openMenus['gestion']} 
                onToggle={() => toggleMenu('gestion')}
                active={['/roles'].includes(currentPath)}
            >
                <SubMenuItem label="Roles y Permisos" path="/roles" icon={ShieldCheck} currentPath={currentPath} onNavigate={onNavigate} />
            </MenuDropdown>

            {/* 2. USUARIOS */}
            <MenuDropdown 
                id="usuarios" 
                label="Usuarios" 
                icon={Users} 
                isOpen={openMenus['usuarios']} 
                onToggle={() => toggleMenu('usuarios')}
                active={['/usuarios', '/empleados'].includes(currentPath)}
            >
                <SubMenuItem label="Usuarios Sistema" path="/usuarios" icon={Shield} currentPath={currentPath} onNavigate={onNavigate} />
                <SubMenuItem label="Empleados" path="/empleados" icon={Briefcase} currentPath={currentPath} onNavigate={onNavigate} />
            </MenuDropdown>

            {/* 3. SERVICIOS */}
            <MenuDropdown 
                id="servicios" 
                label="Servicios" 
                icon={LayoutGrid} 
                isOpen={openMenus['servicios']} 
                onToggle={() => toggleMenu('servicios')}
                active={['/repertorio', '/ensayos'].includes(currentPath)}
            >
                 <SubMenuItem label="Repertorio" path="/repertorio" icon={Music} currentPath={currentPath} onNavigate={onNavigate} />
                 <SubMenuItem label="Ensayos" path="/ensayos" icon={Calendar} currentPath={currentPath} onNavigate={onNavigate} />
            </MenuDropdown>

            {/* 4. VENTAS (Incluye Reservas) */}
            <MenuDropdown 
                id="ventas" 
                label="Ventas" 
                icon={ShoppingCart} 
                isOpen={openMenus['ventas']} 
                onToggle={() => toggleMenu('ventas')}
                active={['/reservas', '/ventas', '/cotizaciones', '/abonos', '/clientes'].includes(currentPath)}
            >
                <SubMenuItem label="Reservas" path="/reservas" icon={Bookmark} currentPath={currentPath} onNavigate={onNavigate} />
                <SubMenuItem label="Venta" path="/ventas" icon={ShoppingCart} currentPath={currentPath} onNavigate={onNavigate} />
                <SubMenuItem label="Cotización" path="/cotizaciones" icon={FileText} currentPath={currentPath} onNavigate={onNavigate} />
                <SubMenuItem label="Abono" path="/abonos" icon={CreditCard} currentPath={currentPath} onNavigate={onNavigate} />
                <SubMenuItem label="Clientes" path="/clientes" icon={Users} currentPath={currentPath} onNavigate={onNavigate} />
            </MenuDropdown>

        </div>

      </nav>
    );
  };

  const renderSimpleSidebar = () => {
    const isEmpleado = user.role === UserRole.EMPLEADO;
    
    return (
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
            <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-4">Menu Principal</p>
                 <ul className="space-y-2">
                    
                    <MainMenuItem label="Inicio" path="/home" icon={Home} currentPath={currentPath} onNavigate={onNavigate} />
                    <MainMenuItem label="Mi Perfil" path="/perfil" icon={UserCircle} currentPath={currentPath} onNavigate={onNavigate} />
                    <MainMenuItem label="Reservas" path="/reservas" icon={Bookmark} currentPath={currentPath} onNavigate={onNavigate} />
                    <MainMenuItem label="Repertorio" path="/repertorio" icon={Music} currentPath={currentPath} onNavigate={onNavigate} />
                    
                    {isEmpleado && (
                        <MainMenuItem label="Ensayos" path="/ensayos" icon={Calendar} currentPath={currentPath} onNavigate={onNavigate} />
                    )}

                    {!isEmpleado && (
                         <>
                            <MainMenuItem label="Cotización" path="/cotizaciones" icon={FileText} currentPath={currentPath} onNavigate={onNavigate} />
                            <MainMenuItem label="Mis Compras" path="/ventas" icon={ShoppingCart} currentPath={currentPath} onNavigate={onNavigate} />
                         </>
                    )}
                 </ul>
            </div>
        </nav>
    );
  };

  return (
    <div className="w-72 bg-[#050505] text-white h-screen flex flex-col fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.4)] border-r border-white/5 z-50 transition-all duration-300">
      
      {/* HEADER */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center shadow-lg shadow-primary-900/20 text-white font-bold font-serif transform transition-transform hover:scale-105">
                M
            </div>
            <div>
                <h2 className="text-base font-serif font-bold text-white tracking-wide leading-none">MARIACHIS</h2>
                <span className="text-[10px] font-bold text-primary-500 tracking-[0.2em] uppercase">Texas Medellín</span>
            </div>
        </div>
        
        {/* User Badge */}
        <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="relative">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold border border-white/10 text-gray-300">
                    {user.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#050505] ${user.role === UserRole.ADMIN ? 'bg-primary-500' : 'bg-green-500'}`}></div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">{user.role}</p>
            </div>
        </div>
      </div>

      {/* CONTENIDO */}
      {user.role === UserRole.ADMIN ? renderAdminSidebar() : renderSimpleSidebar()}

      {/* FOOTER */}
      <div className="p-4 border-t border-white/5 bg-[#080808]">
        <button
          onClick={logout}
          className="group w-full flex items-center px-4 py-3 text-xs font-bold tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
        >
          <LogOut size={16} className="mr-3 group-hover:text-primary-500 transition-colors" />
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
};

// --- Subcomponentes Estilizados ---

const MainMenuItem: React.FC<{
    label: string;
    path: string;
    icon: React.ElementType;
    currentPath: string;
    onNavigate: (path: string) => void;
}> = ({ label, path, icon: Icon, currentPath, onNavigate }) => {
    const isActive = currentPath === path;

    return (
        <button
            onClick={() => onNavigate(path)}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden mb-1
              ${isActive 
                ? 'bg-gradient-to-r from-primary-900/40 to-transparent text-white shadow-lg shadow-black/20 border-l-2 border-primary-500' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
        >
            <Icon 
              className={`mr-3 transition-all duration-300 ${isActive ? 'text-primary-500 scale-110' : 'text-gray-500 group-hover:text-primary-400 group-hover:scale-105'}`} 
              size={20} 
            />
            <span className={`font-bold text-sm tracking-wide transition-colors ${isActive ? 'text-white' : 'group-hover:text-gray-200'}`}>{label}</span>
        </button>
    );
};

const MenuDropdown: React.FC<{
    id: string;
    label: string;
    icon: React.ElementType;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    active?: boolean;
}> = ({ label, icon: Icon, isOpen, onToggle, children, active }) => {
    return (
        <div className="overflow-hidden mb-1">
            <button 
                onClick={onToggle}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group select-none
                    ${active 
                        ? 'text-white bg-gradient-to-r from-primary-900/20 to-transparent border-l-2 border-primary-600' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}
                `}
            >
                <div className="flex items-center">
                    <Icon size={18} className={`mr-3 transition-colors ${active ? 'text-primary-500' : 'text-gray-600 group-hover:text-gray-300'}`} />
                    <span className={`font-bold text-xs uppercase tracking-wider transition-colors ${active ? 'text-white' : ''}`}>{label}</span>
                </div>
                <div className={`transform transition-transform duration-300 text-gray-500 ${isOpen ? 'rotate-180 text-primary-500' : ''}`}>
                     {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
            </button>
            
            {/* Contenedor animado para el acordeón - Increased max-h to prevent cutting off items */}
            <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
            >
                <ul className="ml-4 pl-3 border-l border-white/10 space-y-1 pb-2">
                    {children}
                </ul>
            </div>
        </div>
    );
};

const SubMenuItem: React.FC<{
    label: string;
    path: string;
    icon: React.ElementType;
    currentPath: string;
    onNavigate: (path: string) => void;
}> = ({ label, path, icon: Icon, currentPath, onNavigate }) => {
    const isActive = currentPath === path;
    
    return (
        <li>
            <button
                onClick={() => onNavigate(path)}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group relative
                ${isActive 
                    ? 'text-white bg-primary-600/10' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }
                `}
            >
                <div className={`mr-3 transition-all duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                    {isActive ? (
                        <Circle size={8} className="fill-primary-500 text-primary-500" />
                    ) : (
                        <Icon size={16} className="text-gray-600 group-hover:text-gray-400" />
                    )}
                </div>
                
                <span className={`transition-transform duration-200 font-medium ${isActive ? 'text-primary-400' : ''} ${!isActive && 'group-hover:translate-x-1'}`}>
                    {label}
                </span>
                
                {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                )}
            </button>
        </li>
    );
};
