
import { Payment, Reservation } from '../../../types';
import { reservaService } from '../../reservas/services/reservaService';
import { ventaService } from '../../ventas/services/ventaService';

// Extendemos Payment para incluir datos visuales en la tabla (Cliente, Reserva ID)
export interface EnrichedPayment extends Payment {
    reservationId: string;
    clientName: string;
    reservationTotal: number;
}

// Mock inicial basado en las reservas existentes
let mockPayments: EnrichedPayment[] = [
    { 
        id: 'p1', 
        amount: 400000, 
        date: '2024-05-02T10:00:00.000Z', 
        type: 'Abono Inicial', 
        method: 'Transferencia', 
        reservationId: '1', 
        clientName: 'Juan Pérez', 
        reservationTotal: 800000,
        notes: 'Anticipo 50%' 
    },
    { 
        id: 'p2', 
        amount: 600000, 
        date: '2023-11-02T10:00:00.000Z', 
        type: 'Abono Inicial', 
        method: 'Transferencia', 
        reservationId: '3', 
        clientName: 'Empresa Tech', 
        reservationTotal: 1200000 
    },
    { 
        id: 'p3', 
        amount: 600000, 
        date: '2023-12-01T16:00:00.000Z', 
        type: 'Saldo Final', 
        method: 'Efectivo', 
        reservationId: '3', 
        clientName: 'Empresa Tech', 
        reservationTotal: 1200000 
    }
];

export const abonoService = {
  // Obtener todos los abonos enriquecidos con datos del cliente
  getAbonos: async (): Promise<EnrichedPayment[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockPayments]), 600));
  },

  // Obtener reservas activas para el dropdown del formulario
  getPayableReservations: async (): Promise<Reservation[]> => {
      const all = await reservaService.getReservations();
      // Solo mostramos reservas que no estén anuladas ni pagadas al 100%
      return all.filter(r => r.status !== 'Anulado' && r.paidAmount < r.totalAmount);
  },

  // Registrar nuevo abono
  createAbono: async (data: { reservationId: string, amount: number, date: string, method: string, notes?: string }): Promise<EnrichedPayment> => {
      
      const methodCast = data.method as any; 

      // 1. Actualizar la reserva real (Saldo y Estado)
      const updatedReserva = await reservaService.addPayment(data.reservationId, {
          amount: data.amount,
          method: methodCast,
          date: new Date().toISOString(),
          type: 'Abono Parcial',
          notes: data.notes
      });

      // 2. Crear el objeto de pago local (Abonos)
      const newPayment: EnrichedPayment = {
          id: Math.random().toString(36).substr(2, 9),
          amount: data.amount,
          date: data.date, 
          method: methodCast,
          type: 'Abono Parcial',
          notes: data.notes,
          reservationId: updatedReserva.id,
          clientName: updatedReserva.clientName,
          reservationTotal: updatedReserva.totalAmount
      };
      mockPayments = [newPayment, ...mockPayments];

      // 3. SINCRONIZACIÓN: Registrar también en el módulo de Ventas
      await ventaService.registerExternalSale({
          date: data.date,
          type: 'Por Reserva',
          clientName: updatedReserva.clientName,
          concept: `Abono a Reserva #${updatedReserva.id} (${updatedReserva.eventType})`,
          method: data.method,
          amount: data.amount,
          reservationId: updatedReserva.id
      });
      
      return new Promise((resolve) => setTimeout(() => resolve(newPayment), 600));
  },

  // Simular descarga de PDF
  downloadComprobante: async (paymentId: string): Promise<boolean> => {
      return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
  }
};
