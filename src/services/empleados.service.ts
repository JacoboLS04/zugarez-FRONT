import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import type { Empleado } from '../types';

class EmpleadosService {
  private endpoint = API_CONFIG.ENDPOINTS.EMPLEADOS;

  async getAll(): Promise<Empleado[]> {
    return apiService.get<Empleado[]>(this.endpoint);
  }

  async getById(id: number): Promise<Empleado> {
    return apiService.get<Empleado>(`${this.endpoint}/${id}`);
  }

  async create(empleado: Empleado): Promise<Empleado> {
    return apiService.post<Empleado>(this.endpoint, empleado);
  }

  async update(id: number, empleado: Partial<Empleado>): Promise<Empleado> {
    return apiService.put<Empleado>(`${this.endpoint}/${id}`, empleado);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

export const empleadosService = new EmpleadosService();
