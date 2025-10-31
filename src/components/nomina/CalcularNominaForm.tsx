import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validaciones } from '../../utils/validations';
import type { Empleado } from '../../types';

interface CalcularNominaFormProps {
  empleados: Empleado[];
  onSubmit: (data: {
    empleadoId: number;
    periodoInicio: string;
    periodoFin: string;
    comisiones: number;
    bonificaciones: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export const CalcularNominaForm: React.FC<CalcularNominaFormProps> = ({
  empleados,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    empleadoId: 0,
    periodoInicio: '',
    periodoFin: '',
    comisiones: 0,
    bonificaciones: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.empleadoId || formData.empleadoId === 0) {
      newErrors.empleadoId = 'Seleccione un empleado';
    }

    if (!formData.periodoInicio) {
      newErrors.periodoInicio = 'Fecha de inicio requerida';
    }

    if (!formData.periodoFin) {
      newErrors.periodoFin = 'Fecha de fin requerida';
    }

    if (formData.periodoInicio && formData.periodoFin) {
      const rangoError = validaciones.rangoFechas(formData.periodoInicio, formData.periodoFin);
      if (rangoError) {
        newErrors.periodoFin = rangoError;
      }
    }

    if (formData.comisiones < 0) {
      newErrors.comisiones = 'No puede ser negativo';
    }

    if (formData.bonificaciones < 0) {
      newErrors.bonificaciones = 'No puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al calcular:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const empleadosOptions = empleados.map(emp => ({
    value: emp.id!,
    label: `${emp.nombres} ${emp.apellidos} - ${emp.dni}`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Empleado"
        value={formData.empleadoId}
        onChange={e => handleChange('empleadoId', parseInt(e.target.value))}
        options={empleadosOptions}
        error={errors.empleadoId}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Período Inicio"
          type="date"
          value={formData.periodoInicio}
          onChange={e => handleChange('periodoInicio', e.target.value)}
          error={errors.periodoInicio}
          required
        />

        <Input
          label="Período Fin"
          type="date"
          value={formData.periodoFin}
          onChange={e => handleChange('periodoFin', e.target.value)}
          error={errors.periodoFin}
          required
        />

        <Input
          label="Comisiones (S/)"
          type="number"
          step="0.01"
          min="0"
          value={formData.comisiones}
          onChange={e => handleChange('comisiones', parseFloat(e.target.value) || 0)}
          error={errors.comisiones}
        />

        <Input
          label="Bonificaciones (S/)"
          type="number"
          step="0.01"
          min="0"
          value={formData.bonificaciones}
          onChange={e => handleChange('bonificaciones', parseFloat(e.target.value) || 0)}
          error={errors.bonificaciones}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={loading}>
          Calcular Nómina
        </Button>
      </div>
    </form>
  );
};
