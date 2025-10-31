import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CalcularNominaForm } from '../components/nomina/CalcularNominaForm';
import { NominaDetail } from '../components/nomina/NominaDetail';
import { NominasList } from '../components/nomina/NominasList';
import { useEmpleados } from '../hooks/useEmpleados';
import { useNomina } from '../hooks/useNomina';
import { EstadoNomina, type Nomina } from '../types';

export const NominaPage: React.FC = () => {
  const { empleados } = useEmpleados();
  const {
    loading,
    calcularNomina,
    aprobarNomina,
    registrarPago,
    getNominasByEstado,
    descargarComprobante
  } = useNomina();

  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [isCalcularModalOpen, setIsCalcularModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState<Nomina | null>(null);
  const [numeroTransaccion, setNumeroTransaccion] = useState('');

  useEffect(() => {
    loadNominas();
  }, []);

  const loadNominas = async () => {
    try {
      const calculadas = await getNominasByEstado(EstadoNomina.CALCULADA);
      const aprobadas = await getNominasByEstado(EstadoNomina.APROBADA);
      const pagadas = await getNominasByEstado(EstadoNomina.PAGADA);
      setNominas([...calculadas, ...aprobadas, ...pagadas]);
    } catch (error) {
      console.error('Error al cargar nóminas:', error);
    }
  };

  const handleCalcular = async (data: any) => {
    try {
      const nomina = await calcularNomina(data);
      setIsCalcularModalOpen(false);
      await loadNominas();
      setSelectedNomina(nomina);
      setIsDetailModalOpen(true);
    } catch (error) {
      // Error manejado en el hook
    }
  };

  const handleView = (nomina: Nomina) => {
    setSelectedNomina(nomina);
    setIsDetailModalOpen(true);
  };

  const handleAprobar = async () => {
    if (!selectedNomina?.id) return;
    try {
      const nominaActualizada = await aprobarNomina(selectedNomina.id);
      setSelectedNomina(nominaActualizada);
      await loadNominas();
    } catch (error) {
      // Error manejado en el hook
    }
  };

  const handleRegistrarPago = async () => {
    if (!selectedNomina?.id || !numeroTransaccion.trim()) {
      alert('Ingrese el número de transacción');
      return;
    }
    try {
      const nominaActualizada = await registrarPago(selectedNomina.id, numeroTransaccion);
      setSelectedNomina(nominaActualizada);
      setIsPagoModalOpen(false);
      setNumeroTransaccion('');
      setIsDetailModalOpen(false);
      await loadNominas();
    } catch (error) {
      // Error manejado en el hook
    }
  };

  const handleDescargar = async () => {
    if (!selectedNomina?.id) return;
    try {
      await descargarComprobante(selectedNomina.id);
    } catch (error) {
      // Error manejado en el hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Nómina</h1>
      
      <Card>
        <NominasList
          nominas={nominas}
          loading={loading}
          onView={handleView}
          onCalcular={() => setIsCalcularModalOpen(true)}
        />
      </Card>

      {/* Modal Calcular Nómina */}
      <Modal
        isOpen={isCalcularModalOpen}
        onClose={() => setIsCalcularModalOpen(false)}
        title="Calcular Nueva Nómina"
        size="md"
      >
        <CalcularNominaForm
          empleados={empleados}
          onSubmit={handleCalcular}
          onCancel={() => setIsCalcularModalOpen(false)}
        />
      </Modal>

      {/* Modal Detalle Nómina */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedNomina(null);
        }}
        title="Detalle de Nómina"
        size="lg"
      >
        {selectedNomina && (
          <NominaDetail
            nomina={selectedNomina}
            loading={loading}
            onAprobar={selectedNomina.estado === 'CALCULADA' ? handleAprobar : undefined}
            onRegistrarPago={
              selectedNomina.estado === 'APROBADA'
                ? () => setIsPagoModalOpen(true)
                : undefined
            }
            onDescargarComprobante={
              selectedNomina.estado === 'PAGADA' ? handleDescargar : undefined
            }
          />
        )}
      </Modal>

      {/* Modal Registrar Pago */}
      <Modal
        isOpen={isPagoModalOpen}
        onClose={() => {
          setIsPagoModalOpen(false);
          setNumeroTransaccion('');
        }}
        title="Registrar Pago"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Número de Transacción"
            value={numeroTransaccion}
            onChange={e => setNumeroTransaccion(e.target.value)}
            placeholder="TRX-20240120-001234"
            required
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsPagoModalOpen(false);
                setNumeroTransaccion('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleRegistrarPago} isLoading={loading}>
              Confirmar Pago
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
