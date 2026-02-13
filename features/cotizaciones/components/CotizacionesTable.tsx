
import React, { useState } from 'react';
import { Quotation, UserRole } from '../../../types';
import { User, FileText, Calendar, Eye, Download, Edit2, CheckSquare, Ban } from 'lucide-react';
import { TablePagination } from '../../../shared/components/TablePagination';

interface Props {
  quotations: Quotation[];
  loading: boolean;
  userRole?: UserRole;
  onView: (q: Quotation) => void;
  onEdit: (q: Quotation) => void;
  onConvert: (id: string, amount: number) => void;
  onCancel: (id: string) => void;
  onDownload: (id: string) => void;
}

export const CotizacionesTable: React.FC<Props> = ({ 
    quotations, loading, userRole, onView, onEdit, onConvert, onCancel, onDownload 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Updated ActionButton: all variants removed/ignored, now defaults to slate (gray)
  const ActionButton: React.FC<{ icon: React.ElementType, onClick: (e: React.MouseEvent) => void, tooltip?: string, variant?: string }> = ({ icon: Icon, onClick, tooltip }) => {
      const baseClass = "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600";
      return (
        <button onClick={onClick} title={tooltip} className={baseClass}>
            <Icon size={16} strokeWidth={2} />
        </button>
      );
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'En Espera': return 'bg-amber-50 text-amber-600 border-amber-200';
          case 'Convertida': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
          case 'Anulada': return 'bg-slate-50 text-slate-500 border-slate-200';
          default: return 'bg-slate-50 text-slate-600';
      }
  };

  if (loading) {
      return <div className="text-center py-20 text-slate-400">Cargando cotizaciones...</div>;
  }

  if (quotations.length === 0) {
      return <div className="text-center py-20 text-slate-400">No se encontraron registros.</div>;
  }

  // Pagination Logic
  const totalPages = Math.ceil(quotations.length / itemsPerPage);
  const currentQuotations = quotations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto p-8 pb-4">
          <table className="w-full">
              <thead>
                  <tr className="border-b border-slate-100 text-left">
                      <th className="py-5 px-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                      <th className="py-5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                      <th className="py-5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Evento</th>
                      <th className="py-5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor Estimado</th>
                      <th className="py-5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                      <th className="py-5 px-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {currentQuotations.map(quote => {
                      const isActive = quote.status === 'En Espera';
                      return (
                          <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                              
                              {/* ID */}
                              <td className="py-5 px-8">
                                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">#{quote.id}</span>
                              </td>

                              {/* Cliente */}
                              <td className="py-5 px-6">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                                          <User size={14} />
                                      </div>
                                      <div>
                                          <p className="font-bold text-slate-800 text-sm">{quote.clientName}</p>
                                          <p className="text-[10px] text-slate-400">{quote.clientPhone}</p>
                                      </div>
                                  </div>
                              </td>

                              {/* Evento */}
                              <td className="py-5 px-6">
                                  <div className="flex flex-col gap-1">
                                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                          <FileText size={12} className="text-orange-500" /> {quote.eventType}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-slate-500">
                                          <Calendar size={12} /> {quote.eventDate}
                                      </div>
                                  </div>
                              </td>

                              {/* Valor */}
                              <td className="py-5 px-6">
                                  <span className="text-sm font-bold text-slate-700">
                                      ${quote.totalAmount.toLocaleString()}
                                  </span>
                              </td>

                              {/* Estado */}
                              <td className="py-5 px-6 text-center">
                                  <span className={`inline-block px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(quote.status)}`}>
                                      {quote.status}
                                  </span>
                              </td>

                              {/* Acciones */}
                              <td className="py-5 px-8">
                                  <div className="flex items-center justify-center gap-2">
                                      <ActionButton icon={Eye} onClick={() => onView(quote)} tooltip="Ver Detalle" />
                                      <ActionButton icon={Download} onClick={() => onDownload(quote.id)} tooltip="Descargar PDF" />

                                      {isActive && (
                                          <>
                                              <ActionButton icon={Edit2} onClick={() => onEdit(quote)} tooltip="Editar" />
                                              
                                              {userRole !== UserRole.CLIENTE && (
                                                  <ActionButton icon={CheckSquare} onClick={() => onConvert(quote.id, quote.totalAmount)} tooltip="Confirmar (Crear Reserva)" />
                                              )}
                                              
                                              <ActionButton icon={Ban} onClick={() => onCancel(quote.id)} tooltip="Anular" />
                                          </>
                                      )}
                                  </div>
                              </td>
                          </tr>
                      );
                  })}
              </tbody>
          </table>
      </div>
      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={quotations.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};
