import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatters } from '../../utils/formatters';
import type { Nomina, EstadoNomina } from '../../types';

interface NominaDetailProps {
  nomina: Nomina;
  onAprobar?: () => void;
  onRegistrarPago?: () => void;
  onDescargarComprobante?: () => void;
  loading?: boolean;
}

export const NominaDetail: React.FC<NominaDetailProps> = ({
  nomina,
  onAprobar,
  onRegistrarPago,
  onDescargarComprobante,
  loading = false
}) => {
  const getEstadoColor = (estado: EstadoNomina) => {
    const colors = {
      PENDIENTE: 'bg-gray-100 text-gray-800',
      CALCULADA: 'bg-blue-100 text-blue-800',
      APROBADA: 'bg-yellow-100 text-yellow-800',
      PAGADA: 'bg-green-100 text-green-800',
      CANCELADA: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {nomina.empleadoNombre}
            </h2>
            <p className="text-gray-600">
              Período: {formatters.fecha(nomina.periodoInicio)} - {formatters.fecha(nomina.periodoFin)}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getEstadoColor(nomina.estado)}`}>
            {formatters.estadoNomina(nomina.estado)}
          </span>
        </div>

        {/* Datos Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Información Laboral</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Salario Base:</span>
                <span className="font-semibold">{formatters.moneda(nomina.salarioBase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horas Trabajadas:</span>
                <span className="font-semibold">{formatters.horas(nomina.horasTrabajadas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horas Extras:</span>
                <span className="font-semibold">{formatters.horas(nomina.horasExtras)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Conceptos Adicionales</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Pago Horas Extras:</span>
                <span className="font-semibold">{formatters.moneda(nomina.pagoHorasExtras)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Comisiones:</span>
                <span className="font-semibold">{formatters.moneda(nomina.comisiones)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonificaciones:</span>
                <span className="font-semibold">{formatters.moneda(nomina.bonificaciones)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen Financiero */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-4">Resumen Financiero</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Total Ingresos:</span>
              <span className="font-semibold text-green-600">
                {formatters.moneda(nomina.totalIngresos)}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Total Deducciones:</span>
              <span className="font-semibold text-red-600">
                -{formatters.moneda(nomina.totalDeducciones)}
              </span>
            </div>
            <div className="border-t-2 border-gray-300 pt-3">
              <div className="flex justify-between text-2xl">
                <span className="font-bold text-gray-900">Salario Neto:</span>
                <span className="font-bold text-blue-600">
                  {formatters.moneda(nomina.salarioNeto)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Pago */}
        {nomina.fechaPago && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Fecha de Pago:</span>
              <span className="font-semibold text-green-700">
                {formatters.fecha(nomina.fechaPago)}
              </span>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t">
          {nomina.estado === 'CALCULADA' && onAprobar && (
            <Button onClick={onAprobar} isLoading={loading} variant="success">
              Aprobar Nómina
            </Button>
          )}
          
          {nomina.estado === 'APROBADA' && onRegistrarPago && (
            <Button onClick={onRegistrarPago} isLoading={loading} variant="primary">
              Registrar Pago
            </Button>
          )}
          
          {nomina.estado === 'PAGADA' && onDescargarComprobante && (
            <Button onClick={onDescargarComprobante} isLoading={loading}>
              📄 Descargar Comprobante
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
