import { useState } from 'react';
import { nominaService } from '../services/nomina.service';
import type { EstadoNomina } from '../types';

interface CalcularNominaParams {
  empleadoId: number;
  periodoInicio: string;
  periodoFin: string;
  comisiones?: number;
  bonificaciones?: number;
}

export const useNomina = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcularNomina = async (params: CalcularNominaParams) => {
    setLoading(true);
    setError(null);
    try {
      const nomina = await nominaService.calcular(params);
      return nomina;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al calcular nómina';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const aprobarNomina = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const nomina = await nominaService.aprobar(id);
      return nomina;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al aprobar nómina';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const registrarPago = async (id: number, numeroTransaccion: string) => {
    setLoading(true);
    setError(null);
    try {
      const nomina = await nominaService.registrarPago(id, { numeroTransaccion });
      return nomina;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar pago';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getNominasByEstado = async (estado: EstadoNomina) => {
    setLoading(true);
    setError(null);
    try {
      const nominas = await nominaService.getByEstado(estado);
      return nominas;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener nóminas';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const descargarComprobante = async (nominaId: number) => {
    setLoading(true);
    setError(null);
    try {
      await nominaService.descargarComprobante(nominaId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al descargar comprobante';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    calcularNomina,
    aprobarNomina,
    registrarPago,
    getNominasByEstado,
    descargarComprobante
  };
};
