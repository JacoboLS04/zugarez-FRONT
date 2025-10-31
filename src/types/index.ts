export enum TipoContrato {
  TIEMPO_COMPLETO = 'TIEMPO_COMPLETO',
  MEDIO_TIEMPO = 'MEDIO_TIEMPO',
  POR_HORAS = 'POR_HORAS',
  TEMPORAL = 'TEMPORAL',
  PRACTICAS = 'PRACTICAS'
}

export enum Turno {
  MANANA = 'MANANA',
  TARDE = 'TARDE',
  NOCHE = 'NOCHE',
  COMPLETO = 'COMPLETO'
}

export enum EstadoNomina {
  PENDIENTE = 'PENDIENTE',
  CALCULADA = 'CALCULADA',
  APROBADA = 'APROBADA',
  PAGADA = 'PAGADA',
  CANCELADA = 'CANCELADA'
}

export interface Empleado {
  id?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  fechaContratacion: string;
  salarioBase: number;
  tipoContrato: TipoContrato;
  cuentaBancaria: string;
  banco: string;
  activo?: boolean;
  puestoId: number;
  puestoNombre?: string;
}

export interface Asistencia {
  id?: number;
  empleadoId: number;
  empleadoNombre?: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string | null;
  turno: Turno;
  horasTrabajadas: number | null;
  horasExtras: number | null;
  observaciones: string | null;
}

export interface Nomina {
  id?: number;
  empleadoId: number;
  empleadoNombre?: string;
  periodoInicio: string;
  periodoFin: string;
  salarioBase: number;
  horasTrabajadas: number;
  horasExtras: number;
  pagoHorasExtras: number;
  comisiones: number;
  bonificaciones: number;
  totalIngresos: number;
  totalDeducciones: number;
  salarioNeto: number;
  estado: EstadoNomina;
  fechaPago: string | null;
}

export interface ReportePeriodo {
  periodoInicio: string;
  periodoFin: string;
  totalEmpleados: number;
  totalSalarios: number;
  totalDeducciones: number;
  totalHorasExtras: number;
  estadisticasPorEstado: Record<EstadoNomina, number>;
}

export interface ApiError {
  message: string;
}
