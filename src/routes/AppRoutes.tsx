import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../components/auth/LoginPage';
import { Layout } from '../components/layout/Layout';
import { PrivateRoute } from '../components/layout/PrivateRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { EmpleadosPage } from '../pages/EmpleadosPage';
import { AsistenciaPage } from '../pages/AsistenciaPage';
import { NominaPage } from '../pages/NominaPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Navigate to="/dashboard" replace />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute requiredRole="RRHH">
            <Layout>
              <DashboardPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/empleados"
        element={
          <PrivateRoute requiredRole="RRHH">
            <Layout>
              <EmpleadosPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/asistencia"
        element={
          <PrivateRoute>
            <Layout>
              <AsistenciaPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/nomina"
        element={
          <PrivateRoute requiredRole="RRHH">
            <Layout>
              <NominaPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
