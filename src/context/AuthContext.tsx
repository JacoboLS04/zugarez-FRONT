import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  rol: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión activa
    if (authService.isAuthenticated()) {
      const user = authService.getUser();
      setIsAuthenticated(true);
      setUsername(user.username);
      setRol(user.rol);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const data = await authService.login({ username, password });
    setIsAuthenticated(true);
    setUsername(data.username);
    setRol(data.rol);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername(null);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, rol, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
