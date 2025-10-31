import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import type { Asistencia, Turno } from '../types';

interface RegistroEntradaDTO {
  empleadoId: number;
  turno: Turno;
}

class AsistenciaService {
  private endpoint = API_CONFIG.ENDPOINTS.ASISTENCIA;

  async registrarEntrada(data: RegistroEntradaDTO): Promise<Asistencia> {
    return apiService.post<Asistencia>(`${this.endpoint}/entrada`, data);
  }

  async registrarSalida(id: number): Promise<Asistencia> {
    return apiService.put<Asistencia>(`${this.endpoint}/${id}/salida`);
  }

  async getByEmpleado(
    empleadoId: number,
    inicio: string,
    fin: string
  ): Promise<Asistencia[]> {
    return apiService.get<Asistencia[]>(
      `${this.endpoint}/empleado/${empleadoId}?inicio=${inicio}&fin=${fin}`
    );
  }
}

export const asistenciaService = new AsistenciaService();
