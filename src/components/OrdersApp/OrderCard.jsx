import React from 'react';

const OrderCard = ({ order }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning';
      case 'PROCESSING': return 'bg-info';
      case 'PAID': return 'bg-success';
      case 'COMPLETED': return 'bg-success';
      case 'FAILED': return 'bg-danger';
      case 'CANCELLED': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendiente de Pago';
      case 'PROCESSING': return 'Procesando Pago';
      case 'PAID': return 'Pagado';
      case 'COMPLETED': return 'Completado';
      case 'FAILED': return 'Pago Fallido';
      case 'CANCELLED': return 'Cancelado';
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
          <h5 className="mb-0">Pedido #{order.id}</h5>
          <small className="text-muted">
            {new Date(order.createdAt).toLocaleString('es-CO')}
          </small>
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
