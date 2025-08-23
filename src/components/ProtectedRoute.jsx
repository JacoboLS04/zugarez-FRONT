import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './auth/AuthPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-lg">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return children;
};

export default ProtectedRoute;
