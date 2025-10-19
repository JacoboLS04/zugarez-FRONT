import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-clock-fill text-warning" style={{ fontSize: '5rem' }}></i>
              </div>
              
              <h1 className="text-warning mb-3">Pago Pendiente</h1>
              <p className="lead mb-4">
                Tu pago está siendo procesado.
              </p>
              
              {paymentId && (
                <div className="alert alert-info">
                  <p className="mb-0">ID de pago: {paymentId}</p>
                  <p className="mb-0">Estado: {status}</p>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-muted">
                  Esto puede tomar algunos minutos. Te notificaremos por correo electrónico 
                  cuando el pago sea confirmado.
                </p>
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/orders')}
                >
                  Ver Mis Pedidos
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/client')}
                >
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
