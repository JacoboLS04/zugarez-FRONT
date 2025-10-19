import React from 'react';

const OrderCard = ({ order, onUpdateStatus }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-warning';
      case 'En Proceso': return 'bg-info';
      case 'Completado': return 'bg-success';
      case 'Cancelado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus !== order.status) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  return (
    <div className="card order-card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">Pedido #{order.id}</h5>
          <small className="text-muted">Cliente: {order.customerName}</small>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
          <select 
            className="form-select form-select-sm"
            value={order.status}
            onChange={handleStatusChange}
            style={{ width: '140px' }}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>
      
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <h6>Productos:</h6>
            <div className="products-list">
              {order.products.map((product, index) => (
                <div key={index} className="product-item d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <span className="fw-medium">{product.name}</span>
                    <small className="text-muted ms-2">({product.category})</small>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">Cantidad: {product.quantity}</div>
                    <div className="fw-bold">{formatCOP(product.price * product.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="order-details">
              <div className="mb-2">
                <strong>Fecha:</strong> {new Date(order.date).toLocaleDateString('es-CO')}
              </div>
              <div className="mb-2">
                <strong>Hora:</strong> {order.time}
              </div>
              <div className="mb-2">
                <strong>Total:</strong>
                <span className="fs-5 fw-bold text-primary ms-2">
                  {formatCOP(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {order.products.length} producto(s) en este pedido
          </small>
          
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
