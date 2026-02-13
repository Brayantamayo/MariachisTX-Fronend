
import React from 'react';
import { DollarSign, CreditCard, ChevronDown, AlertCircle, CheckCircle, Bookmark, FileText } from 'lucide-react';
import { Reservation } from '../../../types';
import { CustomDatePicker } from '../../../shared/components/CustomDatePicker';

interface Props {
  formData: any;
  reservations: Reservation[];
  selectedReserva: Reservation | null;
  calculations: {
      totalReserva: number;
      paidAmount: number;
      saldoPendienteActual: number;
      nuevoSaldo: number;
      willConfirm: boolean;
      missingForConfirmation: number;
      isConfirmed: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onDateChange: (name: string, value: string) => void;
  onReservationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  initialReservationId?: string;
}

export const AbonoForm: React.FC<Props> = ({ 
    formData, 
    reservations, 
    selectedReserva, 
    calculations,
    onChange, 
    onDateChange,
    onReservationChange, 
    onSubmit, 
    initialReservationId 
}) => {
  
  const { 
      totalReserva, 
      paidAmount, 
      saldoPendienteActual, 
      nuevoSaldo, 
      willConfirm, 
      missingForConfirmation, 
      isConfirmed 
  } = calculations;

  const amountNumber = Number(formData.amount);

  return (
    <form id="abono-form" onSubmit={onSubmit} className="space-y-4">
        
        {/* Contexto: Selección de Reserva */}
        <div>
            <label className="label-form">Vincular Reserva <span className="text-red-500">*</span></label>
            <div className="relative">
                <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select 
                    name="reservationId"
                    value={formData.reservationId}
                    onChange={onReservationChange}
                    required
                    disabled={!!initialReservationId && !!selectedReserva} 
                    className={`input-form pl-9 appearance-none cursor-pointer font-bold text-slate-700 text-xs ${initialReservationId ? 'bg-slate-100 opacity-80' : ''}`}
                >
                    <option value="">-- Seleccionar Reserva --</option>
                    {reservations.map(r => (
                        <option key={r.id} value={r.id}>
                            #{r.id} - {r.clientName} ({r.eventType})
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
        </div>

        {/* Información Financiera Compacta */}
        {selectedReserva && (
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between items-center text-[10px]">
                <div>
                    <span className="text-slate-500 block uppercase tracking-wide">Total Reserva</span>
                    <span className="font-bold text-slate-700 text-sm">${totalReserva.toLocaleString()}</span>
                </div>
                <div className="text-right">
                    <span className="text-slate-500 block uppercase tracking-wide">Saldo Pendiente</span>
                    <span className="font-bold text-red-500 text-sm">${saldoPendienteActual.toLocaleString()}</span>
                </div>
            </div>
        )}

        {/* Campos del Pago (Grid) */}
        <div className="grid grid-cols-2 gap-3">
            
            {/* Monto */}
            <div className="col-span-2 sm:col-span-1">
                <label className="label-form">Monto a Abonar <span className="text-red-500">*</span></label>
                <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 ${willConfirm ? 'text-emerald-500' : 'text-slate-400'}`} size={14} />
                    <input 
                        type="number" 
                        name="amount"
                        required
                        min="1"
                        max={saldoPendienteActual}
                        value={formData.amount}
                        onChange={onChange}
                        className={`input-form pl-9 font-bold text-sm ${willConfirm ? 'text-emerald-600 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100' : ''}`}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Fecha (Custom Date Picker) */}
            <div className="col-span-2 sm:col-span-1">
                <CustomDatePicker 
                    name="date"
                    label="Fecha Pago"
                    value={formData.date}
                    onChange={onDateChange}
                    required
                />
            </div>

            {/* Método */}
            <div className="col-span-2 sm:col-span-1">
                <label className="label-form">Método</label>
                <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <select 
                        name="method"
                        value={formData.method}
                        onChange={onChange}
                        className="input-form pl-9 appearance-none cursor-pointer text-xs text-slate-700"
                    >
                        <option value="Transferencia">Transferencia</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Nequi">Nequi</option>
                        <option value="Daviplata">Daviplata</option>
                    </select>
                </div>
            </div>

            {/* Nuevo Saldo (Readonly) */}
            <div className="col-span-2 sm:col-span-1">
                <label className="label-form">Nuevo Saldo Est.</label>
                <div className="input-form bg-slate-50 text-slate-500 border-slate-200 text-xs font-medium">
                    ${nuevoSaldo.toLocaleString()}
                </div>
            </div>

            {/* Notas */}
            <div className="col-span-2">
                <label className="label-form">Notas (Opcional)</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-400" size={14} />
                    <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={onChange}
                        className="input-form pl-9 resize-none min-h-[50px] py-2 text-xs"
                        placeholder="Referencia, detalles..."
                    />
                </div>
            </div>
        </div>

        {/* Feedback Visual / Progreso */}
        {selectedReserva && (
            <div className="pt-1 space-y-2">
                <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${(paidAmount / totalReserva) * 100}%` }} className="absolute top-0 left-0 h-full bg-slate-300"></div>
                    <div style={{ width: `${(amountNumber / totalReserva) * 100}%`, left: `${(paidAmount / totalReserva) * 100}%` }} className={`absolute top-0 h-full transition-all duration-300 ${willConfirm ? 'bg-emerald-500' : 'bg-primary-400'}`}></div>
                </div>

                {willConfirm && (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded-lg text-[10px] font-bold animate-fade-in-up">
                        <CheckCircle size={12} />
                        <span>¡Abono confirma la reserva! (50%)</span>
                    </div>
                )}
                
                {!isConfirmed && missingForConfirmation > 0 && amountNumber > 0 && !willConfirm && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-lg text-[10px] font-bold">
                        <AlertCircle size={12} />
                        <span>Faltan ${Math.max(0, missingForConfirmation - amountNumber).toLocaleString()} para confirmar.</span>
                    </div>
                )}
            </div>
        )}

        <style>{`
        .label-form {
            display: block;
            font-size: 9px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
            padding-left: 2px;
        }
        .input-form {
            width: 100%;
            padding: 8px 10px;
            border-radius: 8px;
            background-color: white;
            border: 1px solid #e2e8f0;
            color: #334155;
            font-size: 12px;
            outline: none;
            transition: all 0.2s;
        }
        .input-form.pl-9 { padding-left: 32px; }
        .input-form:focus {
            border-color: #cbd5e1;
            box-shadow: 0 0 0 2px rgba(226, 232, 240, 0.5);
        }
      `}</style>
    </form>
  );
};
