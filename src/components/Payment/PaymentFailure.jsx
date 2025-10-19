import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processFailure = async () => {
      try {
        const externalReference = searchParams.get('external_reference');
        const preferenceId = searchParams.get('preference_id');

        console.log('❌ Pago fallido:', { externalReference, preferenceId });

        // Notificar al backend del fallo
        const API_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
        const failureUrl = `${API_URL}/payment/failure?external_reference=${externalReference}&preference_id=${preferenceId}`;
        
        await fetch(failureUrl);

        // Limpiar datos locales
        localStorage.removeItem('currentOrderId');
        localStorage.removeItem('currentPreferenceId');

      } catch (error) {
        console.error('Error procesando fallo:', error);
      } finally {
        setLoading(false);
      }
    };

    processFailure();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
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
          <div className="card shadow-lg border-danger">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
              </div>
              
              <h1 className="text-danger mb-3">Pago Rechazado</h1>
              <p className="lead mb-4">
                Lo sentimos, no pudimos procesar tu pago.
              </p>
              
              <div className="alert alert-warning">
                <h5 className="mb-3">Posibles razones:</h5>
                <ul className="text-start mb-0">
                  <li>Fondos insuficientes en tu cuenta</li>
                  <li>Datos de tarjeta incorrectos</li>
                  <li>Tarjeta bloqueada o expirada</li>
                  <li>Límite de compra excedido</li>
                  <li>Transacción cancelada por el usuario</li>
                </ul>
              </div>
              
              <div className="d-grid gap-2 mt-4">
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
