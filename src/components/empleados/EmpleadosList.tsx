import React, { useState } from 'react';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatters } from '../../utils/formatters';
import type { Empleado } from '../../types';

interface EmpleadosListProps {
  empleados: Empleado[];
  loading: boolean;
  onEdit: (empleado: Empleado) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export const EmpleadosList: React.FC<EmpleadosListProps> = ({
  empleados,
  loading,
  onEdit,
  onDelete,
  onAdd
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmpleados = empleados.filter(emp =>
    emp.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.dni.includes(searchTerm)
  );

  const columns = [
    {
      key: 'dni',
      header: 'DNI'
    },
    {
      key: 'nombreCompleto',
      header: 'Nombre Completo',
      render: (row: Empleado) => `${row.nombres} ${row.apellidos}`
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'telefono',
      header: 'Teléfono'
    },
    {
      key: 'puestoNombre',
      header: 'Puesto'
    },
    {
      key: 'salarioBase',
      header: 'Salario Base',
      render: (row: Empleado) => formatters.moneda(row.salarioBase)
    },
    {
      key: 'tipoContrato',
      header: 'Tipo Contrato',
      render: (row: Empleado) => formatters.tipoContrato(row.tipoContrato)
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row: Empleado) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(row)}>
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              if (window.confirm('¿Está seguro de desactivar este empleado?')) {
                onDelete(row.id!);
              }
            }}
          >
            Desactivar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar por nombre, apellido o DNI..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={onAdd}>+ Nuevo Empleado</Button>
      </div>

      <Table
        data={filteredEmpleados}
        columns={columns}
        loading={loading}
        emptyMessage="No hay empleados registrados"
      />
    </div>
  );
};
