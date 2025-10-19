import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    console.log('⏳ Pago pendiente - Orden:', orderId);
  }, [orderId]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-warning">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-clock-fill text-warning animate__animated animate__pulse animate__infinite" 
                   style={{ fontSize: '6rem' }}>
                </i>
              </div>
              
              <h1 className="text-warning mb-3">Pago Pendiente</h1>
              <p className="lead mb-4">
                Tu pago está siendo procesado.
              </p>
              
              {orderId && (
                <div className="alert alert-info mb-4">
                  <p className="mb-0">
                    <strong>Orden #{orderId}</strong> en proceso de verificación
                  </p>
                </div>
              )}
              
              <div className="alert alert-warning mb-4">
                <h5 className="mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  ¿Qué significa esto?
                </h5>
                <p className="mb-2">
                  Tu transacción está en proceso de verificación. 
                  Esto puede ocurrir cuando:
                </p>
                <ul className="text-start mb-0">
                  <li>El pago se realizó con transferencia bancaria</li>
                  <li>La entidad bancaria está verificando la transacción</li>
                  <li>Se requiere confirmación adicional del banco</li>
                  <li>El pago está en proceso de acreditación</li>
                </ul>
              </div>
              
              <div className="alert alert-success">
                <h6 className="mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  Te mantendremos informado
                </h6>
                <p className="mb-0">
                  <strong>Recibirás un correo electrónico</strong> cuando el pago sea confirmado.
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
                  className="btn btn-outline-primary"
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
