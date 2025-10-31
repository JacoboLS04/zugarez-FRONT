import { useState, useEffect } from 'react';
import { empleadosService } from '../services/empleados.service';
import type { Empleado } from '../types';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpleados = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await empleadosService.getAll();
      setEmpleados(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const createEmpleado = async (empleado: Empleado) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await empleadosService.create(empleado);
      setEmpleados(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear empleado';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateEmpleado = async (id: number, empleado: Partial<Empleado>) => {
    setLoading(true);
    setError(null);
    try {
      const actualizado = await empleadosService.update(id, empleado);
      setEmpleados(prev => prev.map(e => e.id === id ? actualizado : e));
      return actualizado;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar empleado';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmpleado = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await empleadosService.delete(id);
      setEmpleados(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar empleado';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    empleados,
    loading,
    error,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    refetch: fetchEmpleados
  };
};
