import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { authService } from '../../services/authService';
import OrderCard from './OrderCard';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = authService.getToken();
      
      if (!token) {
        setError('Debes iniciar sesión para ver tus pedidos');
        setLoading(false);
        return;
      }

      const data = await paymentService.getMyOrders(token);
      console.log('✅ Pedidos cargados:', data);
      setOrders(data);
    } catch (err) {
      console.error('❌ Error cargando pedidos:', err);
      setError('No se pudieron cargar los pedidos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
        {error.includes('sesión') && (
          <div className="mt-3">
            <a href="/login" className="btn btn-primary">
              Ir a Login
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="orders-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Pedidos</h2>
        <button className="btn btn-primary" onClick={loadOrders}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="row g-4">
          {orders.map(order => (
            <div key={order.id} className="col-12">
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <p className="mt-3 text-muted">No tienes pedidos todavía</p>
          <p className="text-muted">Los pedidos que realices aparecerán aquí</p>
          <a href="/client" className="btn btn-primary mt-3">
            <i className="bi bi-shop me-2"></i>
            Ir a la Tienda
          </a>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
