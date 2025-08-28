import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Si el token no es válido, limpiar datos
          authService.clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        authService.clearAuthData();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.loginInit(credentials.username, credentials.password);
      // Si el backend responde con código enviado, espera el código en el componente Login
      if (response.message === 'Código enviado al correo') {
        return response;
      }
      // Si el backend responde con usuario y token, guardar datos
      const userData = response.user || response;
      setUser(userData);
      setIsAuthenticated(true);
      console.log('Usuario autenticado:', userData); 
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar datos del usuario
  const updateUser = (userData) => {
    setUser(userData);
    authService.saveAuthData(authService.getToken(), userData);
  };

  // Función para verificar el código de login
  const loginVerifyCode = async (username, code) => {
    try {
      setLoading(true);
      const response = await authService.verifyCode(username, code);
      if (response.token) {
        setUser(response.user || { username });
        setIsAuthenticated(true);
        authService.saveAuthData(response.token, response.user || { username });
      }
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateUser,
    loginVerifyCode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
