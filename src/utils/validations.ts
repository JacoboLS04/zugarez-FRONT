export const validaciones = {
  dni: (value: string): string | null => {
    if (!/^\d{8}$/.test(value)) {
      return 'El DNI debe tener exactamente 8 dígitos';
    }
    return null;
  },

  email: (value: string): string | null => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      return 'Email inválido';
    }
    return null;
  },

  telefono: (value: string): string | null => {
    if (!/^9\d{8}$/.test(value)) {
      return 'El teléfono debe tener 9 dígitos y comenzar con 9';
    }
    return null;
  },

  salarioBase: (value: number): string | null => {
    if (value <= 0) {
      return 'El salario debe ser mayor a 0';
    }
    return null;
  },

  cuentaBancaria: (value: string): string | null => {
    if (!/^\d{14}$/.test(value)) {
      return 'La cuenta bancaria debe tener 14 dígitos';
    }
    return null;
  },

  fechaNoFutura: (value: string): string | null => {
    const fecha = new Date(value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fecha > hoy) {
      return 'La fecha no puede ser futura';
    }
    return null;
  },

  rangoFechas: (inicio: string, fin: string): string | null => {
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    
    if (fechaInicio >= fechaFin) {
      return 'La fecha de inicio debe ser menor que la fecha de fin';
    }
    
    const diffDays = Math.ceil(
      (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays > 31) {
      return 'El período no puede exceder 31 días';
    }
    
    return null;
  }
};
