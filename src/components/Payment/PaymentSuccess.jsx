import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { authService } from '../../services/authService';
import { useCart } from '../../contexts/CartContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = localStorage.getItem('currentOrderId');
        const token = authService.getToken();
        
        if (orderId && token) {
          // Verificar estado del pago
          const status = await paymentService.checkPaymentStatus(orderId, token);
          setPaymentStatus(status);
          
          // Obtener detalles de la orden
          const order = await paymentService.getOrderById(orderId, token);
          setOrderDetails(order);
        }
        
        // Limpiar el carrito después de un pago exitoso
        clearCart();
        localStorage.removeItem('currentOrderId');
        localStorage.removeItem('currentPreferenceId');
      } catch (error) {
        console.error('Error verificando pago:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [clearCart]);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

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
          <div className="card shadow-lg">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
              </div>
              
              <h1 className="text-success mb-3">¡Pago Exitoso!</h1>
              <p className="lead mb-4">Tu pedido ha sido confirmado y procesado correctamente.</p>
              
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : orderDetails ? (
                <div className="alert alert-info">
                  <h5>Detalles del Pedido #{orderDetails.id}</h5>
                  <p className="mb-1">Subtotal: {formatCOP(orderDetails.subtotal)}</p>
                  <p className="mb-1">Impuestos: {formatCOP(orderDetails.tax)}</p>
                  <p className="mb-2"><strong>Total pagado: {formatCOP(orderDetails.total)}</strong></p>
                  {paymentId && <p className="mb-0 small text-muted">ID de pago: {paymentId}</p>}
                  {paymentStatus && (
                    <p className="mb-0 small">Estado: <strong>{paymentStatus.status}</strong></p>
                  )}
                </div>
              ) : (
                paymentId && (
                  <div className="alert alert-info">
                    <p className="mb-0">ID de pago: {paymentId}</p>
                    <p className="mb-0">Estado: {status}</p>
                  </div>
                )
              )}
              
              <div className="d-grid gap-2 mt-4">
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

export default PaymentSuccess;
