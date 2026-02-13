
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bookmark } from 'lucide-react';
import { ReservaForm } from './ReservaForm';
import { User as UserType, Song, UserRole } from '../../../types';
import { clientService } from '../../clients/services/clientService';
import { repertoireService } from '../../repertoire/services/repertoireService';
import { reservaService } from '../services/reservaService';
import { blockService } from '../../bloqueos/services/blockService';
import { useAuth } from '../../../shared/contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedDate?: string | null;
}

export const ReservaCreateModal: React.FC<Props> = ({ isOpen, onClose, onSave, selectedDate }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  // Configuración de Precios
  const PRICE_URBANA = 480000;
  const PRICE_RURAL = 650000;
  const INCLUDED_SONGS = 7;
  const PRICE_PER_EXTRA_SONG = 10000;

  const initialFormState = {
    clientName: '',
    clientPhone: '',
    secondaryPhone: '',
    clientEmail: '',
    homenajeado: '',
    eventType: 'Cumpleaños',
    eventDate: '',
    eventTime: '',
    location: '',
    address: '',
    neighborhood: '',
    zone: 'Urbana',
    notes: '',
    repertoireIds: [] as string[],
    totalAmount: PRICE_URBANA,
    clientId: ''
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  
  // Data Auxiliar
  const [clients, setClients] = useState<UserType[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado de Bloqueo
  const [blockStatus, setBlockStatus] = useState<any>({ isBlocked: false });

  useEffect(() => {
    if (isOpen) {
        // Cargar datos
        repertoireService.getSongs().then(setSongs);
        if (isAdmin) {
            clientService.getClients().then(setClients);
        }

        // Inicializar formulario
        const dateToUse = selectedDate || new Date().toISOString().split('T')[0];
        let baseState = { ...initialFormState, eventDate: dateToUse };

        if (user && !isAdmin) {
            baseState = {
                ...baseState,
                clientName: `${user.name} ${user.lastName}`,
                clientPhone: user.phone,
                clientEmail: user.email,
                clientId: user.id
            };
        }
        setFormData(baseState);
        
        // Verificar bloqueos y cargar horas
        checkBlockAndHours(dateToUse);
        setSearchTerm('');
    }
  }, [isOpen, selectedDate, user, isAdmin]);

  // Recalcular precios
  useEffect(() => {
      if (!isOpen) return;
      let basePrice = formData.zone === 'Urbana' ? PRICE_URBANA : PRICE_RURAL;
      const songCount = formData.repertoireIds?.length || 0;
      let extraSongsPrice = 0;
      if (songCount > INCLUDED_SONGS) {
          extraSongsPrice = (songCount - INCLUDED_SONGS) * PRICE_PER_EXTRA_SONG;
      }
      setFormData((prev: any) => ({ ...prev, totalAmount: basePrice + extraSongsPrice }));
  }, [formData.zone, formData.repertoireIds, isOpen]);

  const checkBlockAndHours = async (date: string) => {
      // 1. Verificar bloqueo
      const status = await blockService.checkDateStatus(date);
      setBlockStatus(status);

      // 2. Cargar horas base (del servicio de reservas)
      let hours = await reservaService.getAvailableHours(date);
      
      // 3. Filtrar si hay bloqueos PARCIALES
      if (!status.isBlocked && status.hasPartialBlocks && status.blockedRanges) {
          hours = hours.filter(hour => {
              return !status.blockedRanges!.some(range => hour >= range.start && hour < range.end);
          });
      }
      setAvailableHours(hours);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
      // Actualizar estado de forma atómica para evitar inconsistencias
      setFormData((prev: any) => ({ 
          ...prev, 
          [name]: value,
          // Si cambia la fecha, resetear la hora
          ...(name === 'eventDate' ? { eventTime: '' } : {})
      }));

      if (name === 'eventDate') {
          checkBlockAndHours(value);
      }
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const clientId = e.target.value;
      const client = clients.find(c => c.id === clientId);
      if (client) {
          setFormData((prev: any) => ({
              ...prev,
              clientName: `${client.name} ${client.lastName}`,
              clientPhone: client.phone,
              secondaryPhone: client.secondaryPhone || '',
              clientEmail: client.email,
              address: client.address,
              neighborhood: client.neighborhood,
              zone: client.zone || 'Urbana',
              clientId: client.id
          }));
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validación de Bloqueo Total (Estricta para TODOS)
    if (blockStatus.isBlocked) {
        alert(`No se puede crear reserva: La fecha está bloqueada por "${blockStatus.reason || 'motivos administrativos'}".`);
        return; 
    }

    // 2. Validación de Bloqueo Parcial
    if (blockStatus.hasPartialBlocks && blockStatus.blockedRanges && formData.eventTime) {
        const isTimeBlocked = blockStatus.blockedRanges.some((range: any) => 
            formData.eventTime >= range.start && formData.eventTime < range.end
        );
        if (isTimeBlocked) {
            alert(`La hora seleccionada (${formData.eventTime}) no está disponible debido a un bloqueo administrativo.`);
            return;
        }
    }

    if (!formData.eventTime) {
        alert("Por favor selecciona una hora.");
        return;
    }
    
    onSave(formData);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden">
        
        <div className="flex items-center justify-between p-6 pb-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shadow-lg shadow-primary-900/10">
                <Bookmark className="text-primary-600" size={20} />
            </div>
            <div>
                <h3 className="text-xl font-serif font-bold text-slate-800 tracking-wide uppercase">Nueva Reserva</h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">Complete todos los detalles del servicio</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
            <ReservaForm 
                formData={formData}
                isAdmin={isAdmin}
                clients={clients}
                availableHours={availableHours}
                songs={songs}
                searchTerm={searchTerm}
                blockStatus={blockStatus}
                onSearchChange={setSearchTerm}
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
