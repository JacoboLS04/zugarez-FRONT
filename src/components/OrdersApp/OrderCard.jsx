import React from 'react';

const OrderCard = ({ order, isAdmin = false }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'PROCESSING': return 'bg-info text-white';
      case 'APPROVED': return 'bg-success text-white';
      case 'PAID': return 'bg-success text-white';
      case 'COMPLETED': return 'bg-primary text-white';
      case 'FAILED': return 'bg-danger text-white';
      case 'CANCELLED': return 'bg-secondary text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return '⏳ Pendiente de Pago';
      case 'PROCESSING': return '🔄 Procesando Pago';
      case 'APPROVED': return '✅ Aprobado';
      case 'PAID': return '💳 Pagado';
      case 'COMPLETED': return '📦 Completado';
      case 'FAILED': return '❌ Pago Fallido';
      case 'CANCELLED': return '🚫 Cancelado';
      default: return status;
    }
  };

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card order-card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            Pedido #{order.id}
          </h5>
          <small className="text-muted">
            {new Date(order.createdAt).toLocaleString('es-CO')}
          </small>
          {isAdmin && order.user && (
            <div className="mt-2">
              <span className="badge bg-info me-2">
                <i className="bi bi-person me-1"></i>
                {order.user.username}
              </span>
              {order.user.email && (
                <span className="badge bg-secondary">
                  <i className="bi bi-envelope me-1"></i>
                  {order.user.email}
                </span>
              )}
            </div>
          )}
        </div>
        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>
      
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <h6>Productos:</h6>
            <div className="products-list">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="product-item d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <span className="fw-medium">{item.product.name}</span>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">Cantidad: {item.quantity}</div>
                    <div className="fw-bold">{formatCOP(item.subtotal)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="order-details">
              <div className="mb-2">
                <strong>Subtotal:</strong>
                <span className="ms-2">{formatCOP(order.subtotal)}</span>
              </div>
              <div className="mb-2">
                <strong>Impuestos:</strong>
                <span className="ms-2">{formatCOP(order.tax)}</span>
              </div>
              <div className="mb-2 border-top pt-2">
                <strong>Total:</strong>
                <span className="fs-5 fw-bold text-primary ms-2">
                  {formatCOP(order.total)}
                </span>
              </div>
              {order.mercadopagoPaymentId && (
                <div className="mb-2">
                  <small className="text-muted">
                    ID Pago: {order.mercadopagoPaymentId}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
