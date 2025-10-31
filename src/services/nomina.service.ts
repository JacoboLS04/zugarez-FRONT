import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import type { Nomina, EstadoNomina } from '../types';

interface CalcularNominaDTO {
  empleadoId: number;
  periodoInicio: string;
  periodoFin: string;
  comisiones?: number;
  bonificaciones?: number;
}

interface RegistrarPagoDTO {
  numeroTransaccion: string;
}

class NominaService {
  private endpoint = API_CONFIG.ENDPOINTS.NOMINA;

  async calcular(data: CalcularNominaDTO): Promise<Nomina> {
    return apiService.post<Nomina>(`${this.endpoint}/calcular`, data);
  }

  async aprobar(id: number): Promise<Nomina> {
    return apiService.put<Nomina>(`${this.endpoint}/${id}/aprobar`);
  }

  async registrarPago(id: number, data: RegistrarPagoDTO): Promise<Nomina> {
    return apiService.put<Nomina>(
      `${this.endpoint}/${id}/registrar-pago`,
      data
    );
  }

  async getById(id: number): Promise<Nomina> {
    return apiService.get<Nomina>(`${this.endpoint}/${id}`);
  }

  async getByEmpleado(empleadoId: number): Promise<Nomina[]> {
    return apiService.get<Nomina[]>(`${this.endpoint}/empleado/${empleadoId}`);
  }

  async getByEstado(estado: EstadoNomina): Promise<Nomina[]> {
    return apiService.get<Nomina[]>(`${this.endpoint}/estado/${estado}`);
  }

  async descargarComprobante(nominaId: number): Promise<void> {
    const blob = await apiService.downloadBlob(
      `${API_CONFIG.ENDPOINTS.COMPROBANTES}/nomina/${nominaId}/pdf`
    );
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante_${nominaId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const nominaService = new NominaService();
