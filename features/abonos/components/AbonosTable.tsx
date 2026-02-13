
import React, { useState } from 'react';
import { EnrichedPayment } from '../services/abonoService';
import { Eye, Download, FileText, Calendar, CreditCard, User } from 'lucide-react';
import { TablePagination } from '../../../shared/components/TablePagination';

interface Props {
  abonos: EnrichedPayment[];
  loading: boolean;
  onView: (abono: EnrichedPayment) => void;
  onDownload: (id: string) => void;
}

export const AbonosTable: React.FC<Props> = ({ abonos, loading, onView, onDownload }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const ActionButton: React.FC<{ icon: React.ElementType, onClick: () => void, tooltip?: string, variant?: 'default' | 'danger' }> = ({ icon: Icon, onClick, tooltip, variant = 'default' }) => (
    <button 
        onClick={onClick}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 
            ${variant === 'danger' 
                ? 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
            }`}
        title={tooltip}
    >
        <Icon size={16} strokeWidth={2} />
    </button>
  );

  if (loading) {
      return <div className="text-center py-20 text-slate-400">Cargando pagos...</div>;
  }

  if (abonos.length === 0) {
      return <div className="text-center py-20 text-slate-400">No se encontraron abonos registrados.</div>;
  }

  // Pagination Logic
  const totalPages = Math.ceil(abonos.length / itemsPerPage);
  const currentAbonos = abonos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto p-8 pb-4">
          <table className="w-full">
              <thead>
                  <tr className="border-b border-slate-100 text-left">
                      <th className="py-5 px-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID Pago</th>
                      <th className="py-5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                      <th className="py-5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reserva / Cliente</th>
                      <th className="py-5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Método</th>
                      <th className="py-5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Monto</th>
                      <th className="py-5 px-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {currentAbonos.map(abono => (
                      <tr key={abono.id} className="hover:bg-slate-50/50 transition-colors group">
                          
                          {/* ID */}
                          <td className="py-5 px-8">
                              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">#{abono.id}</span>
                          </td>

                          {/* Fecha */}
                          <td className="py-5 px-6">
                              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                  <Calendar size={14} className="text-slate-400" />
                                  {new Date(abono.date).toLocaleDateString()}
                              </span>
                          </td>

                          {/* Cliente */}
                          <td className="py-5 px-6">
                              <div className="flex flex-col">
                                  <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                      <User size={12} className="text-slate-400" /> {abono.clientName}
                                  </span>
                                  <span className="text-[10px] text-primary-600 font-bold uppercase tracking-wide flex items-center gap-1 mt-0.5">
                                      <FileText size={10} /> Reserva #{abono.reservationId}
                                  </span>
                              </div>
                          </td>

                          {/* Método */}
                          <td className="py-5 px-6">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest bg-white">
                                  <CreditCard size={10} />
                                  {abono.method}
                              </span>
                          </td>

                          {/* Monto */}
                          <td className="py-5 px-6">
                              <span className="text-sm font-bold text-emerald-600">
                                  ${abono.amount.toLocaleString()}
                              </span>
                          </td>

                          {/* Acciones */}
                          <td className="py-5 px-8">
                              <div className="flex items-center justify-center gap-2">
                                  <ActionButton 
                                      icon={Eye} 
                                      onClick={() => onView(abono)} 
                                      tooltip="Ver Detalle" 
                                  />
                                  <ActionButton 
                                      icon={Download} 
                                      onClick={() => onDownload(abono.id)} 
                                      tooltip="Descargar Comprobante" 
                                  />
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={abonos.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};
