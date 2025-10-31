import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validaciones } from '../../utils/validations';
import type { Empleado, TipoContrato } from '../../types';

interface EmpleadoFormProps {
  empleado?: Empleado;
  onSubmit: (data: Empleado) => Promise<void>;
  onCancel: () => void;
}

export const EmpleadoForm: React.FC<EmpleadoFormProps> = ({
  empleado,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Empleado>>(
    empleado || {
      nombres: '',
      apellidos: '',
      dni: '',
      email: '',
      telefono: '',
      fechaContratacion: '',
      salarioBase: 0,
      tipoContrato: TipoContrato.TIEMPO_COMPLETO,
      cuentaBancaria: '',
      banco: '',
      puestoId: 0
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const dniError = validaciones.dni(formData.dni || '');
    if (dniError) newErrors.dni = dniError;

    const emailError = validaciones.email(formData.email || '');
    if (emailError) newErrors.email = emailError;

    const telefonoError = validaciones.telefono(formData.telefono || '');
    if (telefonoError) newErrors.telefono = telefonoError;

    const salarioError = validaciones.salarioBase(formData.salarioBase || 0);
    if (salarioError) newErrors.salarioBase = salarioError;

    const fechaError = validaciones.fechaNoFutura(formData.fechaContratacion || '');
    if (fechaError) newErrors.fechaContratacion = fechaError;

    const cuentaError = validaciones.cuentaBancaria(formData.cuentaBancaria || '');
    if (cuentaError) newErrors.cuentaBancaria = cuentaError;

    if (!formData.nombres?.trim()) newErrors.nombres = 'Nombres requeridos';
    if (!formData.apellidos?.trim()) newErrors.apellidos = 'Apellidos requeridos';
    if (!formData.banco?.trim()) newErrors.banco = 'Banco requerido';
    if (!formData.puestoId || formData.puestoId === 0) newErrors.puestoId = 'Puesto requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData as Empleado);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Empleado, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const tiposContrato = Object.values(TipoContrato).map(tipo => ({
    value: tipo,
    label: tipo.replace(/_/g, ' ')
  }));

  const bancos = [
    { value: 'BCP', label: 'BCP' },
    { value: 'Interbank', label: 'Interbank' },
    { value: 'BBVA', label: 'BBVA' },
    { value: 'Scotiabank', label: 'Scotiabank' },
    { value: 'BanBif', label: 'BanBif' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombres"
          value={formData.nombres}
          onChange={e => handleChange('nombres', e.target.value)}
          error={errors.nombres}
          required
        />

        <Input
          label="Apellidos"
          value={formData.apellidos}
          onChange={e => handleChange('apellidos', e.target.value)}
          error={errors.apellidos}
          required
        />

        <Input
          label="DNI"
          value={formData.dni}
          onChange={e => handleChange('dni', e.target.value)}
          error={errors.dni}
          disabled={!!empleado}
          maxLength={8}
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={e => handleChange('email', e.target.value)}
          error={errors.email}
          required
        />

        <Input
          label="Teléfono"
          value={formData.telefono}
          onChange={e => handleChange('telefono', e.target.value)}
          error={errors.telefono}
          maxLength={9}
          required
        />

        <Input
          label="Fecha de Contratación"
          type="date"
          value={formData.fechaContratacion}
          onChange={e => handleChange('fechaContratacion', e.target.value)}
          error={errors.fechaContratacion}
          required
        />

        <Input
          label="Salario Base (S/)"
          type="number"
          step="0.01"
          value={formData.salarioBase}
          onChange={e => handleChange('salarioBase', parseFloat(e.target.value) || 0)}
          error={errors.salarioBase}
          required
        />

        <Select
          label="Tipo de Contrato"
          value={formData.tipoContrato}
          onChange={e => handleChange('tipoContrato', e.target.value)}
          options={tiposContrato}
          error={errors.tipoContrato}
          required
        />

        <Input
          label="Cuenta Bancaria"
          value={formData.cuentaBancaria}
          onChange={e => handleChange('cuentaBancaria', e.target.value)}
          error={errors.cuentaBancaria}
          maxLength={14}
          required
        />

        <Select
          label="Banco"
          value={formData.banco}
          onChange={e => handleChange('banco', e.target.value)}
          options={bancos}
          error={errors.banco}
          required
        />

        <Input
          label="Puesto ID"
          type="number"
          value={formData.puestoId}
          onChange={e => handleChange('puestoId', parseInt(e.target.value) || 0)}
          error={errors.puestoId}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={loading}>
          {empleado ? 'Actualizar' : 'Crear'} Empleado
        </Button>
      </div>
    </form>
  );
};
