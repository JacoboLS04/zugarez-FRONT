// ...existing code...
const API_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app/auth';

export const authService = {
  async verifyCodeFlexible(identifier, code, key) {
    const body = {
      code: code
    };
    // Agregar el campo correcto según el tipo
    if (key === 'email') {
      body.email = identifier;
      body.username = null;
    } else {
      body.username = identifier;
      body.email = null;
    }
    console.log('Enviando verificación de código:', JSON.stringify(body));
    
    const response = await fetch(`${API_URL}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    console.log('Respuesta verificación:', response.status);
    const data = await response.json();
    console.log('Data verificación COMPLETA:', data);
    console.log('¿Tiene token?', !!data.token);
    console.log('Token:', data.token);
    
    // Si hay error, lanzar excepción con el mensaje del backend
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }
    
    return data;
  },
  // ...existing code...
  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Obtener datos del usuario del localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Verificar si el token no ha expirado
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Dar un margen de 5 minutos antes de que expire
      return payload.exp > (currentTime + 300);
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  },

  // Verificar si el token está próximo a expirar (menos de 10 minutos)
  isTokenNearExpiry() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Verificar si expira en los próximos 10 minutos
      return payload.exp < (currentTime + 600);
    } catch (error) {
      return false;
    }
  },

  // Guardar datos de autenticación
  saveAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Emitir evento personalizado para notificar cambios de autenticación
    window.dispatchEvent(new CustomEvent('authChange', { 
      detail: { authenticated: true, user } 
    }));
  },

  // Limpiar datos de autenticación
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Emitir evento personalizado
    window.dispatchEvent(new CustomEvent('authChange', { 
      detail: { authenticated: false, user: null } 
    }));
  },

  // Logout - alias para clearAuthData
  logout() {
    this.clearAuthData();
  },

  async loginInitFlexible(identifier, password, key) {
    const body = {
      password: password
    };
    // Agregar el campo correcto según el tipo
    if (key === 'email') {
      body.email = identifier;
      body.username = null;
    } else {
      body.username = identifier;
      body.email = null;
    }
    console.log('Enviando login init:', JSON.stringify(body));
    const response = await fetch(`${API_URL}/login/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    console.log('Respuesta login init:', response.status);
    const data = await response.json();
    console.log('Data login init:', JSON.stringify(data));
    
    // Si hay error, lanzar excepción con el mensaje del backend
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }
    
    return data;
  },

  async verifyCode(email, code) {
    const response = await fetch(`https://better-billi-zugarez-sys-ed7b78de.koyeb.app/auth/login/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    return response.json();
  },

  async register(registerData) {
    const response = await fetch(`${API_URL}/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar');
    }
    
    return data;
  },

  // Logout
  logout() {
    // Opcional: notificar al backend sobre el logout
    try {
      const token = this.getToken();
      if (token) {
        fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => {
          // Ignorar errores del logout en el backend
        });
      }
    } catch (error) {
      console.log('Error en logout del backend:', error);
    }
    
    this.clearAuthData();
    // Recargar la página para resetear el estado de la aplicación
    setTimeout(() => {
      window.location.reload();
    }, 100);
  },

  // Hacer petición autenticada (con token en el header)
  async authenticatedRequest(url, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Verificar si el token sigue siendo válido
    if (!this.isAuthenticated()) {
      this.clearAuthData();
      throw new Error('Sesión expirada');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Si el token ha expirado, limpiar datos y lanzar error
    if (response.status === 401 || response.status === 403) {
      this.clearAuthData();
      throw new Error('Sesión expirada');
    }

    return response;
  },

  // Renovar token (si tu backend lo soporta)
  async refreshToken() {
    try {
      const response = await this.authenticatedRequest(`${API_URL}/refresh-token`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          this.saveAuthData(data.token, this.getUser());
          return data.token;
        }
      }
    } catch (error) {
      console.error('Error renovando token:', error);
      this.logout();
    }
    return null;
  },

  // Verificar y renovar token automáticamente si es necesario
  async checkAndRefreshToken() {
    if (this.isTokenNearExpiry()) {
      console.log('Token próximo a expirar, intentando renovar...');
      return await this.refreshToken();
    }
    return this.getToken();
  }
};
