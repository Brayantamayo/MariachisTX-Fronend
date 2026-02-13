
import React, { useState } from 'react';
import { User, Calendar, Clock, MapPin, Map, AlignLeft, Search, Music, Star, ChevronDown, DollarSign, Check, ShieldAlert, AlertTriangle, Calculator } from 'lucide-react';
import { User as UserType, Song } from '../../../types';
import { CustomDatePicker } from '../../../shared/components/CustomDatePicker';

interface Props {
  formData: any;
  isAdmin: boolean;
  clients: UserType[];
  songs: Song[];
  availableHours?: string[]; // Use available hours instead of static timeOptions
  blockStatus?: { isBlocked: boolean; reason?: string; hasPartialBlocks?: boolean; blockedRanges?: any[] };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onDateChange: (name: string, value: string) => void;
  onClientSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onToggleSong: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CotizacionForm: React.FC<Props> = ({ 
    formData, 
    isAdmin, 
    clients, 
    songs, 
    availableHours = [], // Use dynamic hours
    blockStatus = { isBlocked: false, reason: '', hasPartialBlocks: false, blockedRanges: [] },
    onChange, 
    onDateChange,
    onClientSelect, 
    onToggleSong, 
    onSubmit,
    onCancel
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Constantes de Precios (Mismas que en Reserva)
  const PRICE_URBANA = 480000;
  const PRICE_RURAL = 650000;
  const INCLUDED_SONGS = 7;
  const PRICE_PER_EXTRA_SONG = 10000;
  
  const today = new Date().toISOString().split('T')[0];

  const filteredSongs = songs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Generar opciones de fin basadas en la hora de inicio (simple +1h logic for UI if needed, but select is better)
  // For End Time, we might want to allow selecting any hour AFTER start time, but for now lets just show same list.
  
  return (
    <form id="cotizacion-form" onSubmit={onSubmit} className="flex flex-col lg:flex-row h-full">
        
        {/* COLUMNA IZQUIERDA: Datos Cliente y Evento */}
        <div className="w-full lg:w-1/2 p-6 space-y-6 bg-white border-r border-slate-100">
            
            {/* 1. Datos del Cliente */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={12} className="text-primary-600" /> Información del Cliente
                </h4>
                
                {isAdmin && (
                    <div className="mb-4">
                        <label className="label-form">BUSCAR CLIENTE REGISTRADO</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <select 
                                name="clientId" 
                                value={formData.clientId} 
                                onChange={onClientSelect} 
                                className="w-full pl-9 py-2 rounded-lg bg-white border border-orange-200 text-sm outline-none focus:border-orange-400 appearance-none cursor-pointer text-slate-700 font-medium"
                            >
                                <option value="">-- Buscar en base de datos --</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} {c.lastName} - {c.phone}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label-form">Nombre Completo <span className="text-red-500">*</span></label>
                        <input type="text" name="clientName" required value={formData.clientName} onChange={onChange} className="input-form" placeholder="Nombre cliente" />
                    </div>
                    <div>
                        <label className="label-form">Teléfono <span className="text-red-500">*</span></label>
                        <input type="tel" name="clientPhone" required value={formData.clientPhone} onChange={onChange} className="input-form" placeholder="300..." />
                    </div>
                </div>
                
                <div>
                    <label className="label-form">Correo Electrónico <span className="text-red-500">*</span></label>
                    <input type="email" name="clientEmail" required value={formData.clientEmail} onChange={onChange} className="input-form" placeholder="email@ejemplo.com" />
                </div>
            </div>

            {/* 2. Detalles del Evento */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar size={12} className="text-primary-600" /> Detalles del Evento
                </h4>

                {/* Alertas de Bloqueo */}
                {blockStatus.isBlocked && (
                    <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100 text-red-600 mb-4 animate-fade-in-up">
                        <ShieldAlert size={18} className="shrink-0" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide">Fecha Bloqueada</p>
                            <p className="text-[10px] mt-0.5">{blockStatus.reason}</p>
                        </div>
                    </div>
                )}

                {!blockStatus.isBlocked && blockStatus.hasPartialBlocks && (
                    <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-700 mb-4 animate-fade-in-up">
                        <AlertTriangle size={18} className="shrink-0" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide">Disponibilidad Limitada</p>
                            <p className="text-[10px] mt-0.5">Algunas horas no están disponibles por bloqueos administrativos.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        {/* Selector de Fecha Personalizado */}
                        <CustomDatePicker 
                            name="eventDate"
                            label="FECHA EVENTO"
                            value={formData.eventDate}
                            onChange={onDateChange}
                            required
                            minDate={today}
                        />
                    </div>
                    <div>
                        <label className="label-form">Tipo Evento <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="eventType" value={formData.eventType} onChange={onChange} className="input-form appearance-none cursor-pointer">
                                <option value="Serenata">Serenata</option>
                                <option value="Boda">Boda</option>
                                <option value="Cumpleaños">Cumpleaños</option>
                                <option value="Empresarial">Empresarial</option>
                                <option value="Fúnebre">Fúnebre</option>
                                <option value="Otro">Otro</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                {/* Rango Horario */}
                <div className={`bg-orange-50/50 p-3 rounded-lg border border-orange-100 mb-4 ${blockStatus.isBlocked ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <label className="text-[9px] text-orange-700 font-bold block mb-1">HORA INICIO <span className="text-red-500">*</span></label>
                            <select 
                                name="startTime" 
                                required 
                                value={formData.startTime} 
                                onChange={onChange} 
                                className="w-full bg-white border border-orange-200 text-sm rounded-lg p-2 outline-none focus:border-orange-400 cursor-pointer text-slate-700"
                            >
                                <option value="">Inicio</option>
                                {availableHours.map(time => (
                                    <option key={`start-${time}`} value={time}>{time}</option>
                                ))}
                                {/* Show current selected even if blocked now (for edits) */}
                                {formData.startTime && !availableHours.includes(formData.startTime) && (
                                    <option value={formData.startTime}>{formData.startTime} (Actual)</option>
                                )}
                            </select>
                        </div>
                        <span className="text-orange-300 font-bold mt-4">-</span>
                        <div className="flex-1">
                            <label className="text-[9px] text-orange-700 font-bold block mb-1">HORA FIN <span className="text-red-500">*</span></label>
                            <select 
                                name="endTime" 
                                required 
                                value={formData.endTime} 
                                onChange={onChange} 
                                className="w-full bg-white border border-orange-200 text-sm rounded-lg p-2 outline-none focus:border-orange-400 cursor-pointer text-slate-700"
                            >
                                <option value="">Fin</option>
                                {/* End time list could potentially include all times, or filtered. Keeping simple for now. */}
                                {availableHours.map(time => (
                                    <option key={`end-${time}`} value={time}>{time}</option>
                                ))}
                                <option value="00:30">00:30</option> {/* Extra option often needed for late events */}
                                {formData.endTime && !availableHours.includes(formData.endTime) && (
                                    <option value={formData.endTime}>{formData.endTime} (Actual)</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2">
                        <label className="label-form">Ubicación / Dirección <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="text" name="location" required value={formData.location} onChange={onChange} className="input-form pl-9" placeholder="Dirección completa" />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="label-form">ZONA (TARIFA BASE) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <select name="zone" value={formData.zone} onChange={onChange} className="input-form pl-9 appearance-none cursor-pointer font-bold text-slate-700">
                                <option value="Urbana">Urbana (${PRICE_URBANA.toLocaleString()})</option>
                                <option value="Rural">Rural (${PRICE_RURAL.toLocaleString()})</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="label-form">Notas Adicionales</label>
                    <textarea name="repertoireNotes" value={formData.repertoireNotes} onChange={onChange} className="input-form min-h-[60px] py-3 resize-none" placeholder="Comentarios sobre el repertorio o evento..." />
                </div>
            </div>
        </div>

        {/* COLUMNA DERECHA: Repertorio y Totales */}
        <div className="w-full lg:w-1/2 p-0 flex flex-col bg-slate-50">
            
            {/* Header Repertorio */}
            <div className="p-6 bg-white border-b border-slate-100 shadow-sm z-10">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Music size={12} className="text-primary-600" /> Selección de Repertorio
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${formData.repertoireIds.length > INCLUDED_SONGS ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {formData.repertoireIds.length} / {INCLUDED_SONGS} Incluidas
                    </span>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Buscar canción..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary-300"
                    />
                </div>
            </div>

            {/* Lista Canciones */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                {filteredSongs.map(song => {
                    const isSelected = formData.repertoireIds.includes(song.id);
                    return (
                        <div 
                            key={song.id} 
                            onClick={() => onToggleSong(song.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-white border-primary-500 shadow-md transform scale-[1.01]' : 'bg-white border-transparent hover:border-slate-200'}`}
                        >
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>{song.title}</span>
                                <span className="text-[10px] text-slate-400 uppercase">{song.artist} • {song.genre}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-slate-200'}`}>
                                {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Resumen de Costos (Fixed Bottom) */}
            <div className="p-6 bg-white border-t border-slate-200">
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-slate-500">
                        <span>Tarifa Base ({formData.zone})</span>
                        <span>${(formData.zone === 'Urbana' ? PRICE_URBANA : PRICE_RURAL).toLocaleString()}</span>
                    </div>
                    {formData.repertoireIds.length > INCLUDED_SONGS && (
                        <div className="flex justify-between text-amber-600 font-medium">
                            <span>Canciones Extra (+{formData.repertoireIds.length - INCLUDED_SONGS})</span>
                            <span>+${((formData.repertoireIds.length - INCLUDED_SONGS) * PRICE_PER_EXTRA_SONG).toLocaleString()}</span>
                        </div>
                    )}
                    <div className="h-px bg-slate-100 my-2"></div>
                    
                    {/* TOTAL EDITABLE PARA ADMIN */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            TOTAL A PAGAR {isAdmin && <span className="text-emerald-500">(Editable)</span>}
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600" size={20} />
                            <input 
                                type="number" 
                                name="totalAmount"
                                value={formData.totalAmount}
                                onChange={onChange}
                                disabled={!isAdmin} // Solo admin puede editar
                                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xl font-bold border outline-none transition-all
                                    ${isAdmin 
                                        ? 'bg-white border-slate-200 text-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100' 
                                        : 'bg-slate-50 border-transparent text-slate-600 cursor-default'}
                                `}
                            />
                            {!isAdmin && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <Calculator size={16} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={onCancel} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-500 hover:bg-slate-50">Cancelar</button>
                    <button 
                        type="submit" 
                        disabled={blockStatus.isBlocked}
                        className={`flex-1 py-3 text-white rounded-xl text-xs font-bold uppercase shadow-lg transition-all transform flex items-center justify-center gap-2
                            ${blockStatus.isBlocked 
                                ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                                : 'bg-primary-600 hover:bg-primary-700 shadow-primary-900/20 hover:shadow-primary-900/30 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {blockStatus.isBlocked ? 'Fecha Bloqueada' : 'Guardar Cotización'}
                    </button>
                </div>
            </div>

        </div>

        <style>{`
        .label-form {
            display: block;
            font-size: 9px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
            padding-left: 2px;
        }
        .input-form {
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px;
            background-color: white;
            border: 1px solid #e2e8f0;
            color: #334155;
            font-size: 13px;
            outline: none;
            transition: all 0.2s;
        }
        .input-form.pl-9, .input-form.pl-10 { padding-left: 36px; }
        .input-form:focus {
            border-color: #f87171;
            box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
        }
      `}</style>
    </form>
  );
};
