import React, { useState } from 'react';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { formatters } from '../../utils/formatters';
import { EstadoNomina, type Nomina } from '../../types';

interface NominasListProps {
  nominas: Nomina[];
  loading: boolean;
  onView: (nomina: Nomina) => void;
  onCalcular: () => void;
}

export const NominasList: React.FC<NominasListProps> = ({
  nominas,
  loading,
  onView,
  onCalcular
}) => {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoNomina | ''>('');

  const filteredNominas = estadoFiltro
    ? nominas.filter(n => n.estado === estadoFiltro)
    : nominas;

  const columns = [
    {
      key: 'id',
      header: 'ID'
    },
    {
      key: 'empleadoNombre',
      header: 'Empleado'
    },
    {
      key: 'periodo',
      header: 'Período',
      render: (row: Nomina) => 
        `${formatters.fecha(row.periodoInicio)} - ${formatters.fecha(row.periodoFin)}`
    },
    {
      key: 'salarioNeto',
      header: 'Salario Neto',
      render: (row: Nomina) => formatters.moneda(row.salarioNeto)
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row: Nomina) => {
        const colors: Record<EstadoNomina, string> = {
          PENDIENTE: 'bg-gray-100 text-gray-800',
          CALCULADA: 'bg-blue-100 text-blue-800',
          APROBADA: 'bg-yellow-100 text-yellow-800',
          PAGADA: 'bg-green-100 text-green-800',
          CANCELADA: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[row.estado]}`}>
            {formatters.estadoNomina(row.estado)}
          </span>
        );
      }
    },
    {
      key: 'fechaPago',
      header: 'Fecha Pago',
      render: (row: Nomina) => row.fechaPago ? formatters.fecha(row.fechaPago) : '-'
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row: Nomina) => (
        <Button size="sm" onClick={() => onView(row)}>
          Ver Detalle
        </Button>
      )
    }
  ];

  const estadosOptions = Object.values(EstadoNomina).map(estado => ({
    value: estado,
    label: formatters.estadoNomina(estado)
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          value={estadoFiltro}
          onChange={e => setEstadoFiltro(e.target.value as EstadoNomina)}
          options={estadosOptions}
          className="max-w-xs"
        />
        <Button onClick={onCalcular}>+ Calcular Nueva Nómina</Button>
      </div>

      <Table
        data={filteredNominas}
        columns={columns}
        loading={loading}
        emptyMessage="No hay nóminas registradas"
      />
    </div>
  );
};
