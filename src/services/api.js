import axios from 'axios';

const DEFAULT_BASE = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
const baseURL = process.env.REACT_APP_API_BASE || DEFAULT_BASE;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Añadir token dinámicamente en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de respuesta: detectar 403 por cuenta desactivada
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const res = error?.response;
    try {
      if (res) {
        // Log details to help debugging backend issues (will appear in browser console)
        console.error('[api] response error:', {
          url: res.config?.url,
          status: res.status,
          data: res.data,
          headers: res.headers
        });

        // Special handling for 403 (deactivated account)
        if (res.status === 403) {
          const data = res.data || {};
          if (data.error === "Tu cuenta ha sido desactivada" || data.deactivatedAt) {
            try { localStorage.removeItem('token'); } catch(e) {}
            try { localStorage.removeItem('user'); } catch(e) {}
            try { sessionStorage.clear(); } catch(e) {}
            if (typeof window !== 'undefined') {
              window.location.href = '/login?deactivated=true';
            }
          }
        }
      } else {
        console.error('[api] network or CORS error', error);
      }
    } catch (e) {
      console.error('[api] error while logging response', e);
    }

    return Promise.reject(error);
  }
);

export default api;
