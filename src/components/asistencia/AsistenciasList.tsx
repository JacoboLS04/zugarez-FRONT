import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { asistenciaService } from '../../services/asistencia.service';
import { formatters } from '../../utils/formatters';
import type { Asistencia, Empleado } from '../../types';

interface AsistenciasListProps {
  empleados: Empleado[];
}

export const AsistenciasList: React.FC<AsistenciasListProps> = ({ empleados }) => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [empleadoId, setEmpleadoId] = useState<number>(0);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchAsistencias = async () => {
    if (!empleadoId || !fechaInicio || !fechaFin) return;

    setLoading(true);
    try {
      const data = await asistenciaService.getByEmpleado(empleadoId, fechaInicio, fechaFin);
      setAsistencias(data);
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarSalida = async (id: number) => {
    try {
      await asistenciaService.registrarSalida(id);
      fetchAsistencias();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al registrar salida');
    }
  };

  const columns = [
    {
      key: 'fecha',
      header: 'Fecha',
      render: (row: Asistencia) => formatters.fecha(row.fecha)
    },
    {
      key: 'horaEntrada',
      header: 'Hora Entrada',
      render: (row: Asistencia) => formatters.fechaHora(row.horaEntrada)
    },
    {
      key: 'horaSalida',
      header: 'Hora Salida',
      render: (row: Asistencia) =>
        row.horaSalida ? formatters.fechaHora(row.horaSalida) : '-'
    },
    {
      key: 'turno',
      header: 'Turno',
      render: (row: Asistencia) => formatters.turno(row.turno)
    },
    {
      key: 'horasTrabajadas',
      header: 'Horas Trabajadas',
      render: (row: Asistencia) =>
        row.horasTrabajadas ? formatters.horas(row.horasTrabajadas) : '-'
    },
    {
      key: 'horasExtras',
      header: 'Horas Extras',
      render: (row: Asistencia) =>
        row.horasExtras ? formatters.horas(row.horasExtras) : '-'
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row: Asistencia) =>
        !row.horaSalida ? (
          <Button size="sm" onClick={() => handleRegistrarSalida(row.id!)}>
            Registrar Salida
          </Button>
        ) : null
    }
  ];

  const empleadosOptions = empleados.map(emp => ({
    value: emp.id!,
    label: `${emp.nombres} ${emp.apellidos}`
  }));

  return (
    <Card title="Consultar Asistencias">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Empleado"
            value={empleadoId}
            onChange={e => setEmpleadoId(parseInt(e.target.value))}
            options={empleadosOptions}
          />
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
        </div>

        <Button onClick={fetchAsistencias}>Consultar</Button>

        <Table
          data={asistencias}
          columns={columns}
          loading={loading}
          emptyMessage="Seleccione un empleado y rango de fechas"
        />
      </div>
    </Card>
  );
};
