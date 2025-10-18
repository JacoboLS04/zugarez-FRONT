import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 99) setQuantity(value);
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    Swal.fire({
      title: '¡Agregado!',
      text: `${product.name} se ha añadido al carrito`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
    setQuantity(1);
  };
  
  return (
    <div className="card h-100 product-card shadow-sm">
      <div className="card-img-container">
        <img 
          src={product.urlImage} 
          className="card-img-top product-image"
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200/e9ecef/6c757d?text=Sin+Imagen';
          }}
        />
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={product.name}>
          {product.name}
        </h5>
        
        <div className="mb-2">
          <span className="badge bg-secondary mb-2">
            <i className="bi bi-tag me-1"></i>{product.brand}
          </span>
        </div>
        
        {product.description && (
          <p className="card-text text-muted small mb-3" 
             style={{ 
               display: '-webkit-box',
               WebkitLineClamp: 2,
               WebkitBoxOrient: 'vertical',
               overflow: 'hidden'
             }}>
            {product.description}
          </p>
        )}
        
        <div className="mt-auto">
          <div className="price-section mb-3">
            <span className="h4 fw-bold text-success mb-0">
              {formatCOP(parseFloat(product.price))}
            </span>
          </div>
          
          <div className="d-flex align-items-center mb-3">
            <label htmlFor={`quantity-${product.id}`} className="form-label mb-0 me-2">
              <i className="bi bi-123 me-1"></i>Cantidad:
            </label>
            <div className="input-group" style={{ width: '100px' }}>
              <button 
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </button>
              <input
                type="number"
                className="form-control form-control-sm text-center"
                id={`quantity-${product.id}`}
                min="1"
                max="99"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button 
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={() => quantity < 99 && setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <button 
            className="btn btn-primary w-100" 
            onClick={handleAddToCart}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
