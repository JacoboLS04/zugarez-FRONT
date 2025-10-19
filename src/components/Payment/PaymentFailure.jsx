import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
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
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
              </div>
              
              <h1 className="text-danger mb-3">Pago Rechazado</h1>
              <p className="lead mb-4">
                Lo sentimos, no pudimos procesar tu pago.
              </p>
              
              {paymentId && (
                <div className="alert alert-warning">
                  <p className="mb-0">ID de pago: {paymentId}</p>
                  <p className="mb-0">Estado: {status}</p>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-muted">Posibles razones:</p>
                <ul className="text-start text-muted">
                  <li>Fondos insuficientes</li>
                  <li>Datos de tarjeta incorrectos</li>
                  <li>Tarjeta bloqueada o expirada</li>
                  <li>Límite de compra excedido</li>
                </ul>
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/client')}
                >
                  Intentar Nuevamente
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/orders')}
                >
                  Ver Mis Pedidos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
