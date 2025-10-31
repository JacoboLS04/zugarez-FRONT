export const formatters = {
  moneda: (value: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  },

  fecha: (value: string): string => {
    return new Date(value).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  fechaHora: (value: string): string => {
    return new Date(value).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  horas: (value: number): string => {
    return `${value.toFixed(2)} hrs`;
  },

  tipoContrato: (value: string): string => {
    const tipos: Record<string, string> = {
      TIEMPO_COMPLETO: 'Tiempo Completo',
      MEDIO_TIEMPO: 'Medio Tiempo',
      POR_HORAS: 'Por Horas',
      TEMPORAL: 'Temporal',
      PRACTICAS: 'Prácticas'
    };
    return tipos[value] || value;
  },

  turno: (value: string): string => {
    const turnos: Record<string, string> = {
      MANANA: 'Mañana',
      TARDE: 'Tarde',
      NOCHE: 'Noche',
      COMPLETO: 'Completo'
    };
    return turnos[value] || value;
  },

  estadoNomina: (value: string): string => {
    const estados: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      CALCULADA: 'Calculada',
      APROBADA: 'Aprobada',
      PAGADA: 'Pagada',
      CANCELADA: 'Cancelada'
    };
    return estados[value] || value;
  }
};
