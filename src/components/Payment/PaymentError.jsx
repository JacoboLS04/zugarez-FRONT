import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentError = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-danger">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-exclamation-triangle-fill text-danger" 
                   style={{ fontSize: '6rem' }}>
                </i>
              </div>
              
              <h1 className="text-danger mb-3">Error en el Proceso de Pago</h1>
              <p className="lead mb-4">
                Ocurrió un error inesperado durante el procesamiento de tu pago.
              </p>
              
              <div className="alert alert-danger">
                <p className="mb-0">
                  Por favor, intenta nuevamente o contacta con nuestro soporte si el problema persiste.
                </p>
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
  );
};

export default PaymentError;
