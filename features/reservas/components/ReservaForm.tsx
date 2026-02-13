
import React from 'react';
import { User, Calendar, Clock, MapPin, Map, AlignLeft, Search, Music, Star, ChevronDown, DollarSign, ShieldAlert, Check, AlertTriangle } from 'lucide-react';
import { User as UserType, Song } from '../../../types';
import { CustomDatePicker } from '../../../shared/components/CustomDatePicker';

interface Props {
  formData: any;
  isAdmin: boolean;
  clients: UserType[];
  availableHours: string[];
  songs: Song[];
  searchTerm: string;
  blockStatus?: { isBlocked: boolean; reason?: string; hasPartialBlocks?: boolean }; 
  onSearchChange: (val: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onDateChange?: (name: string, value: string) => void; 
  onClientSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onToggleSong: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ReservaForm: React.FC<Props> = ({ 
    formData, 
    isAdmin, 
    clients, 
    availableHours,
    songs,
    searchTerm,
    blockStatus = { isBlocked: false, reason: '', hasPartialBlocks: false },
    onSearchChange,
    onChange, 
    onDateChange,
    onClientSelect, 
    onToggleSong,
    onSubmit,
    onCancel
}) => {
  
  const PRICE_URBANA = 480000;
  const PRICE_RURAL = 650000;
  const INCLUDED_SONGS = 7;
  const PRICE_PER_EXTRA_SONG = 10000;
  
  const today = new Date().toISOString().split('T')[0];

  const filteredSongs = songs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDateChange = (name: string, value: string) => {
      if (onDateChange) {
          onDateChange(name, value);
      }
  };

  return (
    <form id="reserva-form" onSubmit={onSubmit} className="flex flex-col lg:flex-row h-full">
                
        {/* COLUMNA IZQUIERDA: Datos Cliente y Evento */}
        <div className="w-full lg:w-1/2 p-8 space-y-6 bg-white border-r border-slate-100">
            
            {/* Sección Cliente */}
            <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={12} className="text-primary-600" /> Información del Cliente
                </h4>
                
                {isAdmin && (
                    <div className="mb-4">
                        <label className="label-form">BUSCAR CLIENTE REGISTRADO</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <select onChange={onClientSelect} className="input-form pl-9 appearance-none cursor-pointer">
                                <option value="">-- Seleccionar de la lista --</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} {c.lastName} - {c.phone}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label-form">NOMBRE CLIENTE <span className="text-red-500">*</span></label>
                        <input type="text" name="clientName" required value={formData.clientName} onChange={onChange} className="input-form" placeholder="Nombre completo" />
                    </div>
                    <div>
                        <label className="label-form">TELÉFONO <span className="text-red-500">*</span></label>
                        <input type="tel" name="clientPhone" required value={formData.clientPhone} onChange={onChange} className="input-form" placeholder="300..." />
                    </div>
                    <div>
                        <label className="label-form">TEL. SECUNDARIO <span className="text-red-500">*</span></label>
                        <input type="tel" name="secondaryPhone" required value={formData.secondaryPhone} onChange={onChange} className="input-form" placeholder="Requerido" />
                    </div>
                    <div>
                        <label className="label-form">EMAIL <span className="text-red-500">*</span></label>
                        <input type="email" name="clientEmail" required value={formData.clientEmail} onChange={onChange} className="input-form" placeholder="correo@..." />
                    </div>
                </div>
            </div>

            {/* Sección Evento */}
            <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Star size={12} className="text-primary-600" /> Detalles del Evento
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="label-form">HOMENAJEADO <span className="text-red-500">*</span></label>
                        <input type="text" name="homenajeado" required value={formData.homenajeado} onChange={onChange} className="input-form" placeholder="Nombre del festejado" />
                    </div>
                    <div>
                        <label className="label-form">OCASIÓN <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="eventType" value={formData.eventType} onChange={onChange} className="input-form appearance-none cursor-pointer">
                                <option value="Cumpleaños">Cumpleaños</option>
                                <option value="Boda">Boda</option>
                                <option value="Serenata">Serenata</option>
                                <option value="Quinceañera">Quinceañera</option>
                                <option value="Empresarial">Empresarial</option>
                                <option value="Fúnebre">Fúnebre</option>
                                <option value="Grado">Grado</option>
                                <option value="Reconciliación">Reconciliación</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                {/* Fecha y Hora Dinámica + ALERTAS DE BLOQUEO */}
                <div className={`grid grid-cols-2 gap-4 mb-4 rounded-xl border p-4 transition-colors ${blockStatus.isBlocked ? 'bg-red-50 border-red-100' : 'bg-primary-50 border-primary-100'}`}>
                    
                    {/* Alerta de Bloqueo TOTAL (Span 2) */}
                    {blockStatus.isBlocked && (
                        <div className="col-span-2 flex items-start gap-3 bg-white p-3 rounded-lg border border-red-100 text-red-600 mb-2 shadow-sm animate-fade-in-up">
                            <ShieldAlert size={20} className="shrink-0" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide">Fecha No Disponible</p>
                                <p className="text-xs mt-0.5">{blockStatus.reason || 'Día bloqueado por administración.'}</p>
                            </div>
                        </div>
                    )}

                    {/* Alerta de Bloqueo PARCIAL (Span 2) */}
                    {!blockStatus.isBlocked && blockStatus.hasPartialBlocks && (
                        <div className="col-span-2 flex items-start gap-3 bg-white p-3 rounded-lg border border-amber-200 text-amber-700 mb-2 shadow-sm animate-fade-in-up">
                            <AlertTriangle size={20} className="shrink-0" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide">Restricción de Horario</p>
                                <p className="text-xs mt-0.5">Algunas horas no están disponibles debido a bloqueos administrativos.</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <CustomDatePicker 
                            name="eventDate"
                            label="FECHA EVENTO"
                            value={formData.eventDate}
                            onChange={handleDateChange}
                            required
                            minDate={today}
                        />
                    </div>
                    <div>
                        <label className="label-form text-primary-800">HORA DISPONIBLE <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={16} />
                            <select 
                                name="eventTime" 
                                required 
                                disabled={blockStatus.isBlocked}
                                value={formData.eventTime} 
                                onChange={onChange} 
                                className={`input-form pl-10 border-primary-200 focus:border-primary-500 appearance-none cursor-pointer ${blockStatus.isBlocked ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                            >
                                {blockStatus.isBlocked ? (
                                    <option value="">Bloqueado</option>
                                ) : (
                                    <>
                                        <option value="">Seleccionar Hora</option>
                                        {availableHours.map(hour => (
                                            <option key={hour} value={hour}>{hour}</option>
                                        ))}
                                        {availableHours.length === 0 && !blockStatus.isBlocked && (
                                            <option value="" disabled>Sin horas libres</option>
                                        )}
                                    </>
                                )}
                                {/* Si la hora seleccionada no está en disponibles (edición), mostrarla */}
                                {formData.eventTime && !availableHours.includes(formData.eventTime) && !blockStatus.isBlocked && (
                                    <option value={formData.eventTime}>{formData.eventTime} (Actual)</option>
                                )}
                            </select>
                        </div>
                        {!blockStatus.isBlocked && (
                            <p className="text-[9px] text-primary-600 mt-1 pl-1 leading-tight">
                                * Se bloquea 1h extra por transporte.
                            </p>
                        )}
                    </div>
                </div>

                {/* Ubicación y Zona */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="label-form">DIRECCIÓN EXACTA <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" name="address" required value={formData.address} onChange={onChange} className="input-form pl-10" placeholder="Calle 123 # 45-67..." />
                        </div>
                    </div>
                    <div>
                        <label className="label-form">BARRIO / SECTOR <span className="text-red-500">*</span></label>
                        <input type="text" name="neighborhood" required value={formData.neighborhood} onChange={onChange} className="input-form" />
                    </div>
                    <div>
                        <label className="label-form">ZONA (TARIFA) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select name="zone" value={formData.zone} onChange={onChange} className="input-form pl-10 appearance-none cursor-pointer font-bold text-slate-700">
                                <option value="Urbana">Urbana (${PRICE_URBANA.toLocaleString()})</option>
                                <option value="Rural">Rural (${PRICE_RURAL.toLocaleString()})</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="label-form">NOTAS ADICIONALES</label>
                    <div className="relative">
                        <AlignLeft className="absolute left-3 top-3 text-slate-400" size={14} />
                        <textarea name="notes" value={formData.notes} onChange={onChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 outline-none text-sm min-h-[80px] bg-white focus:border-primary-300" placeholder="Indicaciones especiales..." />
                    </div>
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
                        onChange={(e) => onSearchChange(e.target.value)}
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
                    <div className="flex justify-between text-lg font-bold text-slate-800">
                        <span>TOTAL A PAGAR</span>
                        <span className="text-primary-600 flex items-center gap-1">
                            <DollarSign size={18} />
                            {formData.totalAmount.toLocaleString()}
                        </span>
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
                        {blockStatus.isBlocked ? 'Fecha Bloqueada' : 'Guardar Reserva'}
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
