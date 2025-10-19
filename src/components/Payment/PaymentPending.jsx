import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPending = async () => {
      try {
        const externalReference = searchParams.get('external_reference');
        const preferenceId = searchParams.get('preference_id');

        console.log('⏳ Pago pendiente:', { externalReference, preferenceId });

        // Notificar al backend del estado pendiente
        const API_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
        const pendingUrl = `${API_URL}/payment/pending?external_reference=${externalReference}&preference_id=${preferenceId}`;
        
        await fetch(pendingUrl);

      } catch (error) {
        console.error('Error procesando pendiente:', error);
      } finally {
        setLoading(false);
      }
    };

    processPending();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-warning">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-clock-fill text-warning" style={{ fontSize: '5rem' }}></i>
              </div>
              
              <h1 className="text-warning mb-3">Pago Pendiente</h1>
              <p className="lead mb-4">
                Tu pago está siendo procesado.
              </p>
              
              <div className="alert alert-info">
                <h5 className="mb-3">¿Qué significa esto?</h5>
                <p className="mb-2">
                  Tu transacción está en proceso de verificación. Esto puede ocurrir cuando:
                </p>
                <ul className="text-start mb-0">
                  <li>El pago se realizó con transferencia bancaria</li>
                  <li>La entidad bancaria está verificando la transacción</li>
                  <li>Se requiere confirmación adicional</li>
                </ul>
              </div>
              
              <div className="alert alert-warning">
                <p className="mb-0">
                  <strong>Te notificaremos por correo electrónico</strong> cuando el pago sea confirmado.
                  Esto puede tomar de algunos minutos a 48 horas hábiles.
                </p>
              </div>
              
              <div className="d-grid gap-2 mt-4">
                <button 
                  className="btn btn-warning btn-lg text-white"
                  onClick={() => navigate('/orders')}
                >
                  <i className="bi bi-box-seam me-2"></i>
                  Ver Mis Pedidos
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/client')}
                >
                  <i className="bi bi-shop me-2"></i>
                  Volver a la Tienda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
