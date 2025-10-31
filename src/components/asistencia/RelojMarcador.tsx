import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { asistenciaService } from '../../services/asistencia.service';
import type { Empleado, Turno } from '../../types';

interface RelojMarcadorProps {
  empleados: Empleado[];
  onSuccess: () => void;
}

export const RelojMarcador: React.FC<RelojMarcadorProps> = ({
  empleados,
  onSuccess
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [empleadoId, setEmpleadoId] = useState<number>(0);
  const [turno, setTurno] = useState<Turno | ''>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEntrada = async () => {
    if (!empleadoId || !turno) {
      setMessage({ type: 'error', text: 'Seleccione empleado y turno' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await asistenciaService.registrarEntrada({ empleadoId, turno: turno as Turno });
      setMessage({ type: 'success', text: 'Entrada registrada exitosamente' });
      setEmpleadoId(0);
      setTurno('');
      onSuccess();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al registrar entrada'
      });
    } finally {
      setLoading(false);
    }
  };

  const empleadosOptions = empleados.map(emp => ({
    value: emp.id!,
    label: `${emp.nombres} ${emp.apellidos} - ${emp.dni}`
  }));

  const turnosOptions = [
    { value: 'MANANA', label: 'Mañana (6:00 AM - 2:00 PM)' },
    { value: 'TARDE', label: 'Tarde (2:00 PM - 10:00 PM)' },
    { value: 'NOCHE', label: 'Noche (10:00 PM - 6:00 AM)' },
    { value: 'COMPLETO', label: 'Completo (8+ horas)' }
  ];

  return (
    <Card title="Reloj Marcador">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-800">
          {currentTime.toLocaleTimeString('es-PE')}
        </div>
        <div className="text-lg text-gray-600 mt-2">
          {currentTime.toLocaleDateString('es-PE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Select
          label="Empleado"
          value={empleadoId}
          onChange={e => setEmpleadoId(parseInt(e.target.value))}
          options={empleadosOptions}
          required
        />

        <Select
          label="Turno"
          value={turno}
          onChange={e => setTurno(e.target.value as Turno)}
          options={turnosOptions}
          required
        />

        <Button
          onClick={handleEntrada}
          isLoading={loading}
          className="w-full"
          size="lg"
        >
          Registrar Entrada
        </Button>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </Card>
  );
};
