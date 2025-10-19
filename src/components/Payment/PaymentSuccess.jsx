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
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Obtener parámetros de MercadoPago
        const collectionId = searchParams.get('collection_id');
        const collectionStatus = searchParams.get('collection_status');
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const externalReference = searchParams.get('external_reference');
        const preferenceId = searchParams.get('preference_id');

        console.log('✅ Parámetros de MercadoPago:', {
          collectionId,
          collectionStatus,
          paymentId,
          status,
          externalReference,
          preferenceId
        });

        // Llamar al backend para confirmar el pago
        const API_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
        const confirmUrl = `${API_URL}/payment/success?collection_id=${collectionId}&collection_status=${collectionStatus}&payment_id=${paymentId}&status=${status}&external_reference=${externalReference}&preference_id=${preferenceId}`;
        
        console.log('📡 Confirmando pago en:', confirmUrl);

        const response = await fetch(confirmUrl);
        const data = await response.json();

        console.log('✅ Respuesta del backend:', data);

        if (data.success) {
          setOrderDetails(data);
          
          // Limpiar carrito y datos locales
          clearCart();
          localStorage.removeItem('currentOrderId');
          localStorage.removeItem('currentPreferenceId');
          
          console.log('✅ Pago confirmado exitosamente');
        } else {
          throw new Error(data.error || 'Error al confirmar el pago');
        }

      } catch (error) {
        console.error('❌ Error procesando pago:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, clearCart]);

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg">
              <div className="card-body text-center p-5">
                <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h3>Procesando tu pago...</h3>
                <p className="text-muted">Por favor espera mientras confirmamos tu transacción</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-warning">
              <div className="card-body text-center p-5">
                <i className="bi bi-exclamation-triangle-fill text-warning mb-4" style={{ fontSize: '5rem' }}></i>
                <h2 className="text-warning mb-3">Advertencia</h2>
                <p className="lead mb-4">{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/client')}
                >
                  Volver a la Tienda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-success">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
              </div>
              
              <h1 className="text-success mb-3">¡Pago Exitoso!</h1>
              <p className="lead mb-4">Tu pedido ha sido confirmado y procesado correctamente.</p>
              
              {orderDetails && (
                <div className="alert alert-success">
                  <h5 className="mb-3">Detalles del Pedido #{orderDetails.orderId}</h5>
                  <div className="row text-start">
                    <div className="col-6">
                      <p className="mb-2"><strong>ID de Pago:</strong></p>
                      <p className="mb-2"><strong>Estado:</strong></p>
                      <p className="mb-2"><strong>Total:</strong></p>
                    </div>
                    <div className="col-6">
                      <p className="mb-2">{orderDetails.paymentId}</p>
                      <p className="mb-2">
                        <span className="badge bg-success">{orderDetails.status}</span>
                      </p>
                      <p className="mb-2 text-success fw-bold">{formatCOP(orderDetails.total)}</p>
                    </div>
                  </div>
                  <hr />
                  <p className="mb-0 small text-muted">{orderDetails.message}</p>
                </div>
              )}
              
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
                  onClick={() => navigate('/client')}
                >
                  <i className="bi bi-shop me-2"></i>
                  Seguir Comprando
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
