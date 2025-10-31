export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    EMPLEADOS: '/api/empleados',
    ASISTENCIA: '/api/asistencia',
    NOMINA: '/api/nomina',
    COMPROBANTES: '/api/comprobantes',
    REPORTES: '/api/reportes'
  }
};

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
