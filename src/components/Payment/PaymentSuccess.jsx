import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [countdown, setCountdown] = useState(5);

  // Obtener parámetros de la URL
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');
  const paymentId = searchParams.get('paymentId');
  const total = searchParams.get('total');

  useEffect(() => {
    // Limpiar carrito y datos locales
    clearCart();
    localStorage.removeItem('currentOrderId');
    localStorage.removeItem('currentPreferenceId');
    
    console.log('✅ Pago exitoso:', { orderId, status, paymentId, total });

    // Contador regresivo
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [clearCart, navigate, orderId, status, paymentId, total]);

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-success">
            <div className="card-body text-center p-5">
              {/* Animación de éxito */}
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success animate__animated animate__bounceIn" 
                   style={{ fontSize: '6rem' }}>
                </i>
              </div>
              
              <h1 className="text-success mb-3 animate__animated animate__fadeIn">
                ¡Pago Exitoso!
              </h1>
              <p className="lead mb-4">
                Tu pedido ha sido confirmado y procesado correctamente.
              </p>
              
              {/* Detalles del pedido */}
              <div className="alert alert-success mb-4">
                <h5 className="mb-3">
                  <i className="bi bi-box-seam me-2"></i>
                  Detalles del Pedido
                </h5>
                <div className="row text-start">
                  <div className="col-6">
                    <p className="mb-2"><strong>Número de Orden:</strong></p>
                    <p className="mb-2"><strong>Estado:</strong></p>
                    <p className="mb-2"><strong>ID de Pago:</strong></p>
                    <p className="mb-2"><strong>Total Pagado:</strong></p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2">#{orderId}</p>
                    <p className="mb-2">
                      <span className="badge bg-success">{status || 'APPROVED'}</span>
                    </p>
                    <p className="mb-2 text-truncate" title={paymentId}>
                      {paymentId}
                    </p>
                    <p className="mb-2 text-success fw-bold">
                      {formatCOP(total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Recibirás un correo de confirmación con los detalles de tu pedido
              </div>

              {/* Contador y botones */}
              <div className="mt-4">
                <p className="text-muted mb-3">
                  Redirigiendo a tus pedidos en <strong>{countdown}</strong> segundos...
                </p>
                
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={() => navigate('/orders')}
                  >
                    <i className="bi bi-box-seam me-2"></i>
                    Ver Mis Pedidos Ahora
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/client')}
                  >
                    <i className="bi bi-shop me-2"></i>
                    Seguir Comprando
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/')}
                  >
                    <i className="bi bi-house me-2"></i>
                    Volver al Inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
