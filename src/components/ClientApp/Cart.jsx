import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { authService } from '../../services/authService';

const Cart = () => {
  const { cart, totalItems, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
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
  
  const handleCheckout = async (e) => {
    // PREVENIR CUALQUIER COMPORTAMIENTO POR DEFECTO
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validaciones silenciosas
    if (cart.length === 0) return;

    const token = authService.getToken();
    if (!token) {
      alert('Debes iniciar sesión para realizar un pedido');
      return;
    }

    setLoading(true);
    document.body.style.overflow = 'hidden';

    // Usar setTimeout para asegurar que no hay interferencias
    setTimeout(async () => {
      try {
        console.log('🛒 CHECKOUT INICIADO');
        
        const items = cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }));

        const API_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
        
        console.log('📡 Enviando request a:', `${API_URL}/payment/checkout`);
        console.log('📦 Items:', JSON.stringify(items));
        
        const response = await fetch(`${API_URL}/payment/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ items })
        });

        console.log('✅ Status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Error:', errorData);
          throw new Error(errorData.error || 'Error al procesar el pago');
        }

        const data = await response.json();
        console.log('📋 Data recibida:', data);
        console.log('🔑 PreferenceId:', data.preferenceId);

        localStorage.setItem('currentOrderId', data.orderId);

        const mercadoPagoUrl = `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${data.preferenceId}`;
        console.log('🚀 REDIRIGIENDO A:', mercadoPagoUrl);

        // FORZAR REDIRECCIÓN COMPLETA
        window.location.href = mercadoPagoUrl;
        
      } catch (error) {
        console.error('💥 ERROR COMPLETO:', error);
        document.body.style.overflow = 'auto';
        setLoading(false);
        alert('Error: ' + error.message);
      }
    }, 100);
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
          <span>Subtotal:</span>
          <span className="fw-bold">${totalAmount.toLocaleString()}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Impuestos (5%):</span>
          <span className="fw-bold">${(totalAmount * 0.05).toLocaleString()}</span>
        </div>
        <div className="d-flex justify-content-between mb-3 border-top pt-2">
          <span className="fw-bold">Total:</span>
          <span className="fw-bold text-primary">${(totalAmount * 1.05).toLocaleString()}</span>
        </div>
        
        <button 
          type="button"
          className="btn btn-success w-100 mb-2" 
          onClick={handleCheckout}
          disabled={cart.length === 0 || loading}
          style={{ pointerEvents: loading ? 'none' : 'auto' }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Conectando con MercadoPago...
            </>
          ) : (
            <>
              <i className="bi bi-credit-card me-2"></i>
              Pagar con MercadoPago
            </>
          )}
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
