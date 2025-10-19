import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    console.log('❌ Pago fallido - Orden:', orderId);
    
    // Limpiar datos locales
    localStorage.removeItem('currentOrderId');
    localStorage.removeItem('currentPreferenceId');
  }, [orderId]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-danger">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '6rem' }}></i>
              </div>
              
              <h1 className="text-danger mb-3">Pago Rechazado</h1>
              <p className="lead mb-4">
                Lo sentimos, no pudimos procesar tu pago.
              </p>
              
              {orderId && (
                <div className="alert alert-warning">
                  <p className="mb-0">
                    <strong>Orden #{orderId}</strong> fue cancelada
                  </p>
                </div>
              )}
              
              <div className="alert alert-danger mb-4">
                <h5 className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Posibles razones
                </h5>
                <ul className="text-start mb-0">
                  <li>Fondos insuficientes en tu cuenta</li>
                  <li>Datos de tarjeta incorrectos</li>
                  <li>Tarjeta bloqueada o expirada</li>
                  <li>Límite de compra excedido</li>
                  <li>Transacción cancelada manualmente</li>
                </ul>
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/client')}
                >
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Intentar Nuevamente
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/')}
