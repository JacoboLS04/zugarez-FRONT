import { API_CONFIG, getAuthHeader } from '../config/api';
import type { ApiError } from '../types';

class ApiService {
  private baseUrl = API_CONFIG.BASE_URL;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          message: 'Error en la petición'
        }));
        throw new Error(error.message);
      }

      // Para respuestas 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async downloadBlob(endpoint: string): Promise<Blob> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Error al descargar el archivo');
    }

    return await response.blob();
  }
}

export const apiService = new ApiService();
