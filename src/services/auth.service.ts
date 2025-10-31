import { API_CONFIG } from '../config/api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  rol: string;
}

class AuthService {
  private baseUrl = API_CONFIG.BASE_URL;

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    
    // Guardar token y datos de usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('rol', data.rol);
    
    return data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    return {
      username: localStorage.getItem('username'),
      rol: localStorage.getItem('rol')
    };
  }

  hasRole(role: string): boolean {
    return localStorage.getItem('rol') === role;
  }
}

export const authService = new AuthService();
