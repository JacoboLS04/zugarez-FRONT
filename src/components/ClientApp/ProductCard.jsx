import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${product.name} se ha añadido al carrito`);
    setQuantity(1);
  };
  
  return (
    <div className="card h-100 product-card shadow-sm">
      <img 
        src={product.urlImage} 
        className="card-img-top product-image"
        alt={product.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted mb-1">Marca: {product.brand}</p>
        <p className="card-text small mb-2">{product.description}</p>
        <div className="mt-auto">
          <p className="card-text fw-bold text-primary fs-5">${parseFloat(product.price).toLocaleString()}</p>
          
          <div className="d-flex align-items-center mb-3">
            <label htmlFor={`quantity-${product.id}`} className="me-2">Cantidad:</label>
            <input
              type="number"
              className="form-control form-control-sm quantity-input"
              id={`quantity-${product.id}`}
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: '60px' }}
            />
          </div>
          
          <button 
            className="btn btn-primary w-100" 
            onClick={handleAddToCart}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
