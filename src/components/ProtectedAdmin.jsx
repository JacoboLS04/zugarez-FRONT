import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedAdmin({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return <Navigate to="/login" replace />;

  const roles = user.roles || user.role || [];
  const isAdmin = Array.isArray(roles) ? roles.includes('ADMIN') || roles.includes('ROLE_ADMIN') : (roles === 'ADMIN' || roles === 'ROLE_ADMIN');

  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
