import React, { useState } from 'react';
import { RelojMarcador } from '../components/asistencia/RelojMarcador';
import { AsistenciasList } from '../components/asistencia/AsistenciasList';
import { useEmpleados } from '../hooks/useEmpleados';

export const AsistenciaPage: React.FC = () => {
  const { empleados } = useEmpleados();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Control de Asistencia</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <RelojMarcador empleados={empleados} onSuccess={handleSuccess} />
        </div>
        <div className="lg:col-span-2">
          <AsistenciasList empleados={empleados} key={refreshKey} />
        </div>
      </div>
    </div>
  );
};
