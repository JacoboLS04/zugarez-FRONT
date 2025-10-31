import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useEmpleados } from '../hooks/useEmpleados';
import { useNomina } from '../hooks/useNomina';
import { reportesService } from '../services/reportes.service';
import { formatters } from '../utils/formatters';
import { EstadoNomina, type ReportePeriodo } from '../types';

export const DashboardPage: React.FC = () => {
  const { empleados } = useEmpleados();
  const { getNominasByEstado } = useNomina();
  
  const [reporte, setReporte] = useState<ReportePeriodo | null>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [nominasPendientes, setNominasPendientes] = useState(0);

  useEffect(() => {
    loadNominasPendientes();
    // Cargar reporte del mes actual por defecto
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), 1);
    const fin = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setFechaInicio(inicio.toISOString().split('T')[0]);
    setFechaFin(fin.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      loadReporte();
    }
  }, [fechaInicio, fechaFin]);

  const loadNominasPendientes = async () => {
    try {
      const calculadas = await getNominasByEstado(EstadoNomina.CALCULADA);
      const aprobadas = await getNominasByEstado(EstadoNomina.APROBADA);
      setNominasPendientes(calculadas.length + aprobadas.length);
    } catch (error) {
      console.error('Error al cargar nóminas pendientes:', error);
    }
  };

  const loadReporte = async () => {
    if (!fechaInicio || !fechaFin) return;
    
    setLoading(true);
    try {
      const data = await reportesService.getReportePeriodo(fechaInicio, fechaFin);
      setReporte(data);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Empleados Activos</p>
            <p className="text-4xl font-bold mt-2">{empleados.length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Nóminas Pendientes</p>
            <p className="text-4xl font-bold mt-2">{nominasPendientes}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Total Salarios (Mes)</p>
            <p className="text-2xl font-bold mt-2">
              {reporte ? formatters.moneda(reporte.totalSalarios) : '-'}
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Horas Extras (Mes)</p>
            <p className="text-4xl font-bold mt-2">
              {reporte ? reporte.totalHorasExtras.toFixed(1) : '-'}
            </p>
          </div>
        </Card>
      </div>

      {/* Reporte del Período */}
      <Card title="Reporte del Período">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
            />
            <Input
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
            />
            <div className="flex items-end">
              <Button onClick={loadReporte} isLoading={loading} className="w-full">
                Actualizar Reporte
              </Button>
            </div>
          </div>

          {reporte && !loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-4">Resumen Financiero</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Empleados:</span>
                      <span className="font-semibold">{reporte.totalEmpleados}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Salarios:</span>
                      <span className="font-semibold text-green-600">
                        {formatters.moneda(reporte.totalSalarios)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Deducciones:</span>
                      <span className="font-semibold text-red-600">
                        {formatters.moneda(reporte.totalDeducciones)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-900 font-bold">Neto a Pagar:</span>
                      <span className="font-bold text-blue-600">
                        {formatters.moneda(reporte.totalSalarios - reporte.totalDeducciones)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-4">Estado de Nóminas</h3>
                  <div className="space-y-3">
                    {Object.entries(reporte.estadisticasPorEstado).map(([estado, cantidad]) => (
                      <div key={estado} className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {formatters.estadoNomina(estado as EstadoNomina)}:
                        </span>
                        <span className="font-semibold">{cantidad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
