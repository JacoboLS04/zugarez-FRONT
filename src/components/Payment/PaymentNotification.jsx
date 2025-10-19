import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const PaymentNotification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');
  const total = searchParams.get('total');

  useEffect(() => {
    // Limpiar carrito
    clearCart();
    
    // Auto-redirigir después de 5 segundos
    const timer = setTimeout(() => {
      navigate('/products');
    }, 5000);

    return () => clearTimeout(timer);
  }, [clearCart, navigate]);

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
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" 
                   style={{ fontSize: '6rem' }}>
                </i>
              </div>
              
              <h1 className="text-success mb-3">¡Pago Exitoso!</h1>
              <p className="lead mb-4">
                Tu pedido ha sido confirmado y procesado correctamente.
              </p>
              
              <div className="alert alert-success mb-4">
                <h5 className="mb-3">Detalles del Pedido</h5>
                <div className="row text-start">
                  <div className="col-6">
                    <p className="mb-2"><strong>Orden:</strong></p>
                    <p className="mb-2"><strong>Estado:</strong></p>
                    <p className="mb-2"><strong>Total:</strong></p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2">#{orderId}</p>
                    <p className="mb-2">
                      <span className="badge bg-success">{status}</span>
                    </p>
                    <p className="mb-2 text-success fw-bold">
                      {formatCOP(total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Recibirás un correo de confirmación
              </div>

              <div className="d-grid gap-2 mt-4">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => navigate('/orders')}
                >
                  <i className="bi bi-box-seam me-2"></i>
                  Ver Mis Pedidos
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/products')}
                >
                  <i className="bi bi-shop me-2"></i>
                  Seguir Comprando
                </button>
              </div>

              <p className="text-muted mt-3 small">
                Redirigiendo automáticamente en 5 segundos...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentNotification;
