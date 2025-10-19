import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { authService } from '../../services/authService';
import Swal from 'sweetalert2';

const ShoppingCart = () => {
  const { cart, totalItems, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const handleQuantityChange = (productId, event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(productId, newQuantity);
    }
  };
  
  const handleRemoveItem = (productId, productName) => {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de eliminar "${productName}" del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productId);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado del carrito',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };
  
  const handleClearCart = () => {
    if (cart.length === 0) return;
    
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos del carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          title: '¡Carrito vaciado!',
          text: 'Todos los productos han sido eliminados',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };
  
  const handleCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'Agrega productos antes de continuar con la compra',
        icon: 'info'
      });
      return;
    }

    const token = authService.getToken();
    const user = authService.getUser();
    
    console.log('=== 🔍 DEBUGGING CHECKOUT ===');
    console.log('🔑 Token completo:', token);
    console.log('👤 Usuario completo:', user);
    console.log('📧 Email:', user?.email);
    console.log('👤 Username:', user?.username);
    console.log('🆔 User ID:', user?.id);
    console.log('🎭 Roles:', user?.roles);
    console.log('✅ isAuthenticated():', authService.isAuthenticated());
    
    if (!token || !authService.isAuthenticated()) {
      Swal.fire({
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para realizar un pedido',
        icon: 'warning',
        confirmButtonText: 'Ir a Login'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }

    try {
      setLoading(true);
      
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const API_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      };
      
      console.log('📡 === REQUEST DETAILS ===');
      console.log('URL:', `${API_URL}/payment/checkout`);
      console.log('Method:', requestOptions.method);
      console.log('Headers:', requestOptions.headers);
      console.log('Body:', requestOptions.body);
      console.log('Items count:', items.length);
      
      const response = await fetch(`${API_URL}/payment/checkout`, requestOptions);

      console.log('📡 === RESPONSE DETAILS ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries([...response.headers.entries()]));

      if (response.status === 401 || response.status === 403) {
        const errorText = await response.text();
        console.error('❌ === ERROR 401/403 ===');
        console.error('Response Text:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error('Error Data:', errorData);
        } catch (e) {
          console.error('No se pudo parsear como JSON');
        }
        
        authService.clearAuthData();
        Swal.fire({
          title: 'Error de Autenticación',
          html: `
            <p>El servidor rechazó tu sesión.</p>
            <small class="text-muted">Detalles técnicos: ${response.status} ${response.statusText}</small>
          `,
          icon: 'error',
          confirmButtonText: 'Ir a Login'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/login';
          }
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error:', errorData);
        throw new Error(errorData.error || 'Error al procesar el pago');
      }

      const data = await response.json();
      console.log('✅ === SUCCESS ===');
      console.log('Order ID:', data.orderId);
      console.log('Preference ID:', data.preferenceId);
      console.log('Total:', data.total);

      localStorage.setItem('currentOrderId', data.orderId);

      const mercadoPagoUrl = `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${data.preferenceId}`;
      console.log('🚀 Redirigiendo a:', mercadoPagoUrl);

      window.location.href = mercadoPagoUrl;
      
    } catch (error) {
      console.error('💥 === EXCEPTION ===');
      console.error('Error:', error);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      setLoading(false);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo procesar el pago: ' + error.message,
        icon: 'error'
      });
    }
  };
  
  return (
    <div className="shopping-cart card shadow sticky-top" style={{ top: '1rem' }}>
      <div className="card-header bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-cart3 me-2" ></i>Mi Carrito
          </h5>
          <span className="badge bg-light text-dark fs-6">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>
      
      <div className="card-body p-0">
        <div className="cart-items" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {cart.length > 0 ? (
            cart.map(item => (
              <div key={item.id} className="cart-item p-3 border-bottom">
                <div className="d-flex">
                  <img 
                    src={item.urlImage} 
                    alt={item.name}
                    className="cart-item-image me-3" 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/60x60/e9ecef/6c757d?text=?';
                    }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                      {item.name}
                    </h6>
                    <p className="mb-2 text-muted small">
                      <i className="bi bi-tag me-1"></i>{item.brand}
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="input-group" style={{ width: '90px' }}>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e)}
                          style={{ fontSize: '0.85rem' }}
                        />
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => item.quantity < 99 && updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        title="Eliminar producto"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <div className="mt-2 text-end">
                      <span className="fw-bold text-success">
                        {formatCOP(parseFloat(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-cart-x text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-muted">Tu carrito está vacío</p>
              <small className="text-muted">Agrega productos para comenzar</small>
            </div>
          )}
        </div>
      </div>
      
      {cart.length > 0 && (
        <div className="card-footer">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">Subtotal:</span>
            <span className="h6 fw-bold text-success mb-0">
              {formatCOP(totalAmount)}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">Impuestos:</span>
            <span className="h6 fw-bold text-success mb-0">
              {formatCOP(totalAmount*0.05)}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">Total:</span>
            <span className="h2 fw-bold text-success mb-0">
              {formatCOP(totalAmount + (totalAmount*0.05))}
            </span>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              className="btn btn-success" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
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
              className="btn btn-outline-danger btn-sm"
              onClick={handleClearCart}
              disabled={loading}
            >
              <i className="bi bi-trash me-2"></i>
              Vaciar Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
