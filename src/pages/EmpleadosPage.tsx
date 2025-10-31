import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { EmpleadoForm } from '../components/empleados/EmpleadoForm';
import { EmpleadosList } from '../components/empleados/EmpleadosList';
import { useEmpleados } from '../hooks/useEmpleados';
import type { Empleado } from '../types';

export const EmpleadosPage: React.FC = () => {
  const { empleados, loading, createEmpleado, updateEmpleado, deleteEmpleado } = useEmpleados();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | undefined>();

  const handleAdd = () => {
    setSelectedEmpleado(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Empleado) => {
    try {
      if (selectedEmpleado?.id) {
        await updateEmpleado(selectedEmpleado.id, data);
      } else {
        await createEmpleado(data);
      }
      setIsModalOpen(false);
      setSelectedEmpleado(undefined);
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmpleado(id);
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Empleados</h1>
      
      <Card>
        <EmpleadosList
          empleados={empleados}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmpleado(undefined);
        }}
        title={selectedEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
        size="lg"
      >
        <EmpleadoForm
          empleado={selectedEmpleado}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedEmpleado(undefined);
          }}
        />
      </Modal>
    </div>
  );
};
