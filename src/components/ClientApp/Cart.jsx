import React from 'react';
import { useCart } from '../../contexts/CartContext';

const Cart = () => {
  const { cart, totalItems, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const handleQuantityChange = (productId, event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };
  
  const handleRemoveItem = (productId) => {
    if (window.confirm('¿Quieres eliminar este producto del carrito?')) {
      removeFromCart(productId);
    }
  };
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Agrega productos antes de continuar');
      return;
    }
    
    if (window.confirm(`Total a pagar: $${totalAmount.toLocaleString()}\n¿Deseas proceder al pago?`)) {
      // Here would go the checkout logic
      alert('¡Pedido realizado con éxito!');
      clearCart();
    }
  };
  
  return (
    <div className="cart card shadow">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Carrito de Compras</h5>
        <span className="badge bg-light text-dark">{totalItems} items</span>
      </div>
      
      <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {cart.length > 0 ? (
          <>
            {cart.map(item => (
              <div key={item.id} className="cart-item mb-3 border-bottom pb-2">
                <div className="d-flex">
                  <img 
                    src={item.urlImage} 
                    alt={item.name}
                    className="cart-item-image me-2" 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                    }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{item.name}</h6>
                    <p className="mb-1 text-muted small">${parseFloat(item.price).toLocaleString()}</p>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        className="form-control form-control-sm me-2"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e)}
                        style={{ width: '60px' }}
                      />
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="text-end ms-2">
                    <span className="fw-bold">
                      ${(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">Tu carrito está vacío</p>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <div className="d-flex justify-content-between mb-2">
          <span>Total:</span>
          <span className="fw-bold">${totalAmount.toLocaleString()}</span>
        </div>
        
        <button 
          className="btn btn-success w-100 mb-2" 
          onClick={handleCheckout}
          disabled={cart.length === 0}
        >
          Proceder al Pago
        </button>
        
        <button 
          className="btn btn-outline-secondary w-100"
          onClick={clearCart}
          disabled={cart.length === 0}
        >
          Vaciar Carrito
        </button>
      </div>
    </div>
  );
};

export default Cart;
