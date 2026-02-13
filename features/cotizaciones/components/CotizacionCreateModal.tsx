
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, FileText } from 'lucide-react';
import { UserRole, User as UserType, Song } from '../../../types';
import { clientService } from '../../clients/services/clientService';
import { repertoireService } from '../../repertoire/services/repertoireService';
import { reservaService } from '../../reservas/services/reservaService';
import { blockService } from '../../bloqueos/services/blockService';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { CotizacionForm } from './CotizacionForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const CotizacionCreateModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  // Configuración de Precios
  const PRICE_URBANA = 480000;
  const PRICE_RURAL = 650000;
  const INCLUDED_SONGS = 7;
  const PRICE_PER_EXTRA_SONG = 10000;
  
  const initialFormState = {
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    eventDate: new Date().toISOString().split('T')[0], // Default today
    eventType: 'Serenata',
    location: '',
    zone: 'Urbana',
    startTime: '',
    endTime: '',
    repertoireIds: [] as string[],
    repertoireNotes: '',
    totalAmount: PRICE_URBANA
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const [clients, setClients] = useState<UserType[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [blockStatus, setBlockStatus] = useState<any>({ isBlocked: false });

  // Estado para controlar si el admin editó manualmente el precio
  const [isManuallyOverridden, setIsManuallyOverridden] = useState(false);

  useEffect(() => {
    if (isOpen) {
        repertoireService.getSongs().then(setSongs);
        if (isAdmin) {
            clientService.getClients().then(setClients);
        }

        let baseData = { ...initialFormState };
        if (user && user.role === UserRole.CLIENTE) {
            baseData = {
                ...baseData,
                clientId: user.id,
                clientName: `${user.name} ${user.lastName}`,
                clientPhone: user.phone,
                clientEmail: user.email,
                location: user.address,
                zone: user.zone === 'Rural' ? 'Rural' : 'Urbana'
            };
        }
        setFormData(baseData);
        setIsManuallyOverridden(false);
        checkBlockAndHours(baseData.eventDate);
    }
  }, [isOpen, user, isAdmin]);

  // Lógica de Cálculo de Precio Automático
  useEffect(() => {
      if (!isOpen || isManuallyOverridden) return;

      const calculateTotal = () => {
          let basePrice = formData.zone === 'Urbana' ? PRICE_URBANA : PRICE_RURAL;
          
          // 1. Calcular duración en horas
          let hours = 1; // Mínimo 1 hora / serenata base
          if (formData.startTime && formData.endTime) {
              const [startH, startM] = formData.startTime.split(':').map(Number);
              const [endH, endM] = formData.endTime.split(':').map(Number);
              
              const startMinutes = startH * 60 + startM;
              let endMinutes = endH * 60 + endM;
              
              // Ajuste si cruza medianoche (ej: 23:00 a 01:00)
              if (endMinutes < startMinutes) {
                  endMinutes += 24 * 60; 
              }
              
              const diffMinutes = endMinutes - startMinutes;
              const calculatedHours = diffMinutes / 60;
              
              // Si la duración es mayor a 0, usarla. Si es 0 o negativa (error), usar base 1.
              if (calculatedHours > 0) {
                  hours = calculatedHours;
              }
          }

          // 2. Calcular Costo Base (Precio x Horas)
          // Nota: Si es serenata simple, usualmente es precio fijo, pero aquí aplicamos lógica por hora según requerimiento
          const timeCost = basePrice * hours;

          // 3. Calcular Canciones Extra
          const songCount = formData.repertoireIds?.length || 0;
          let extraSongsPrice = 0;
          if (songCount > INCLUDED_SONGS) {
              extraSongsPrice = (songCount - INCLUDED_SONGS) * PRICE_PER_EXTRA_SONG;
          }

          return timeCost + extraSongsPrice;
      };

      const newTotal = calculateTotal();
      setFormData((prev: any) => ({ ...prev, totalAmount: newTotal }));

  }, [formData.zone, formData.startTime, formData.endTime, formData.repertoireIds, isOpen, isManuallyOverridden]);

  const checkBlockAndHours = async (date: string) => {
      // 1. Verificar bloqueo
      const status = await blockService.checkDateStatus(date);
      setBlockStatus(status);

      // 2. Cargar horas
      let hours = await reservaService.getAvailableHours(date);
      
      // 3. Filtrar parciales
      if (!status.isBlocked && status.hasPartialBlocks && status.blockedRanges) {
          hours = hours.filter(hour => {
              return !status.blockedRanges!.some(range => hour >= range.start && hour < range.end);
          });
      }
      setAvailableHours(hours);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Si el admin edita el totalAmount, marcamos como manual para detener el cálculo automático
    if (name === 'totalAmount') {
        setIsManuallyOverridden(true);
    }
    // Si cambia cualquier otro parámetro que afecta el precio, reactivamos el cálculo automático
    else if (['zone', 'startTime', 'endTime'].includes(name)) {
        setIsManuallyOverridden(false);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para el CustomDatePicker
  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value, startTime: '', endTime: '' }));
    setIsManuallyOverridden(false);
    if (name === 'eventDate') {
        checkBlockAndHours(value);
    }
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      const client = clients.find(c => c.id === id);
      if (client) {
          setFormData(prev => ({
              ...prev,
              clientId: client.id,
              clientName: `${client.name} ${client.lastName}`,
              clientPhone: client.phone,
              clientEmail: client.email,
              location: client.address,
              zone: client.zone || 'Urbana'
          }));
          setIsManuallyOverridden(false); // Recalcular zona del cliente
      } else {
          setFormData(prev => ({ ...prev, clientId: '' }));
      }
  };

  const toggleSong = (songId: string) => {
      setFormData((prev: any) => {
          const current = prev.repertoireIds || [];
          if (current.includes(songId)) {
              return { ...prev, repertoireIds: current.filter((id: string) => id !== songId) };
          } else {
              return { ...prev, repertoireIds: [...current, songId] };
          }
      });
      setIsManuallyOverridden(false); // Recalcular costo canciones
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (blockStatus.isBlocked) {
        alert(`La fecha está bloqueada: ${blockStatus.reason}`);
        return;
    }

    if (!formData.startTime || !formData.endTime) {
        alert("Por favor selecciona la hora de inicio y fin.");
        return;
    }
    if (formData.endTime <= formData.startTime && formData.endTime !== '00:00' && formData.endTime !== '00:30') {
       if (!confirm("La hora de fin es menor o igual a la de inicio. ¿Es un evento que termina al día siguiente?")) {
           return;
       }
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shadow-sm">
                <FileText className="text-orange-600" size={18} />
            </div>
            <div>
                <h3 className="text-lg font-serif font-bold text-slate-800 tracking-wide uppercase">Nueva Cotización</h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">Crear propuesta comercial</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
            <CotizacionForm 
                formData={formData}
                isAdmin={isAdmin}
                clients={clients}
                songs={songs}
                availableHours={availableHours}
                blockStatus={blockStatus}
                onChange={handleChange}
                onDateChange={handleDateChange}
                onClientSelect={handleClientSelect}
                onToggleSong={toggleSong}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </div>
      </div>
    </div>,
    document.body
  );
};
