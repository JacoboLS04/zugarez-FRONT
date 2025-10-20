import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import OrderCard from './OrderCard';

const OrdersList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Detectar si es admin
  const isAdmin = user?.roles?.some(role => 
    role === 'ROLE_ADMIN' || role.toLowerCase().includes('admin')
  ) || false;

  useEffect(() => {
    loadOrders();
  }, [isAdmin]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = authService.getToken();
      
      if (!token) {
        setError('Debes iniciar sesión para ver los pedidos');
        setLoading(false);
        return;
      }

      console.log('👤 Usuario:', user);
      console.log('🔐 Es admin:', isAdmin);
      console.log('📦 Cargando órdenes...');

      let data;
      
      // Intentar cargar según rol
      if (isAdmin) {
        try {
          console.log('🔑 Intentando cargar TODAS las órdenes (modo admin)...');
          data = await paymentService.getAllOrders(token);
        } catch (adminError) {
          console.warn('⚠️ No se pudieron cargar todas las órdenes:', adminError.message);
          console.log('🔄 Cargando solo órdenes del usuario...');
          data = await paymentService.getMyOrders(token);
        }
      } else {
        data = await paymentService.getMyOrders(token);
      }
      
      console.log(`✅ ${data.length} órdenes cargadas`);
      setOrders(data || []);
    } catch (err) {
      console.error('❌ Error cargando órdenes:', err);
      setError('Error al cargar pedidos: ' + err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar órdenes
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesSearch = !searchTerm || 
      order.id.toString().includes(searchTerm) ||
      (order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Estadísticas
  const stats = {
    total: orders.length,
    approved: orders.filter(o => o.status === 'APPROVED').length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    failed: orders.filter(o => o.status === 'FAILED').length,
    totalRevenue: orders
      .filter(o => o.status === 'APPROVED')
      .reduce((sum, o) => sum + (o.total || 0), 0)
  };

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
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
      </div>
    );
  }

  return (
    <div className="orders-list">
      {/* Header con badge de admin */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {isAdmin && (
            <div className="alert alert-info mb-3">
              <i className="bi bi-shield-check me-2"></i>
              <strong>Modo Administrador:</strong> Viendo todas las órdenes del sistema
            </div>
          )}
          <p className="text-muted mb-0">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </p>
        </div>
        <button className="btn btn-primary" onClick={loadOrders}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center bg-light">
            <div className="card-body">
              <h3 className="text-primary mb-0">{stats.total}</h3>
              <small className="text-muted">Total Órdenes</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-success-subtle">
            <div className="card-body">
              <h3 className="text-success mb-0">{stats.approved}</h3>
              <small className="text-muted">Aprobadas</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-warning-subtle">
            <div className="card-body">
              <h3 className="text-warning mb-0">{stats.pending}</h3>
              <small className="text-muted">Pendientes</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-primary-subtle">
            <div className="card-body">
              <h4 className="text-primary mb-0" style={{ fontSize: '1.5rem' }}>
                {formatCOP(stats.totalRevenue)}
              </h4>
              <small className="text-muted">Ingresos Totales</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={isAdmin ? "🔍 Buscar por ID, usuario o email..." : "🔍 Buscar por ID..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">📋 Todos los estados ({orders.length})</option>
            <option value="APPROVED">✅ Aprobadas ({stats.approved})</option>
            <option value="PENDING">⏳ Pendientes ({stats.pending})</option>
            <option value="FAILED">❌ Fallidas ({stats.failed})</option>
            <option value="CANCELLED">🚫 Canceladas</option>
          </select>
        </div>
      </div>

      {/* Lista de órdenes */}
      {filteredOrders.length > 0 ? (
        <div className="row g-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="col-12">
              <OrderCard order={order} isAdmin={isAdmin} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <p className="mt-3 text-muted">No hay órdenes que coincidan con tu búsqueda</p>
          {searchTerm && (
            <button 
              className="btn btn-secondary"
              onClick={() => setSearchTerm('')}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
