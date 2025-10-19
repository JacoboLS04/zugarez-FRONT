import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Hook para hacer peticiones autenticadas
export const useAuthenticatedRequest = () => {
  const { logout } = useAuth();

  const makeRequest = async (url, options = {}) => {
    try {
      const method = (options.method || 'GET').toLowerCase();

      const axiosConfig = {
        url,
        method,
        headers: options.headers || {},
        data: options.body,
        params: options.params,
      };

      const response = await api.request(axiosConfig);
      return response.data;
    } catch (error) {
      // If backend indicates auth problems, log out
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        try { logout(); } catch (e) {}
      }

      // Normalize error message
      if (error?.response?.data) {
        const msg = error.response.data.message || error.response.data.error || error.response.statusText;
        throw new Error(msg || 'Error en la petición');
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
