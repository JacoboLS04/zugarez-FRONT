import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import type { ReportePeriodo } from '../types';

class ReportesService {
  private endpoint = API_CONFIG.ENDPOINTS.REPORTES;

  async getReportePeriodo(inicio: string, fin: string): Promise<ReportePeriodo> {
    return apiService.get<ReportePeriodo>(
      `${this.endpoint}/nomina/periodo?inicio=${inicio}&fin=${fin}`
    );
  }
}

export const reportesService = new ReportesService();
