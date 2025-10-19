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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const orderId = localStorage.getItem('currentOrderId');
        const token = authService.getToken();
        
        if (orderId && token) {
          const order = await paymentService.getOrderById(orderId, token);
          setOrderDetails(order);
        }
        
        // Limpiar el carrito después de un pago exitoso
        clearCart();
        localStorage.removeItem('currentOrderId');
      } catch (error) {
        console.error('Error cargando detalles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [clearCart]);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

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
                  <p className="mb-0">Total pagado: ${orderDetails.total.toLocaleString('es-CO')}</p>
                  {paymentId && <p className="mb-0 small">ID de pago: {paymentId}</p>}
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
