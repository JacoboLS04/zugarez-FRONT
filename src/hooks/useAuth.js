import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

// Hook para hacer peticiones autenticadas
export const useAuthenticatedRequest = () => {
  const { logout } = useAuth();

  const makeRequest = async (url, options = {}) => {
    try {
      const response = await authService.authenticatedRequest(url, options);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la petición');
      }
      
      return await response.json();
    } catch (error) {
      if (error.message === 'Sesión expirada') {
        logout();
      }
      throw error;
    }
  };

  return { makeRequest };
};

// Hook para obtener datos con autenticación
export const useAuthenticatedData = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeRequest } = useAuthenticatedRequest();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await makeRequest(url);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url, ...dependencies]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await makeRequest(url);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch, setData };
};
