import React, { useState } from 'react';
import { CartProvider } from '../../contexts/CartContext';
import TopBar from '../ClientShopping/Header/Header';
import ProductCatalog from './ProductCatalog';
import Cart from './Cart';
import './ClientApp.css';

const ClientApp = () => {
  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <CartProvider>
      <div className="client-app">
        <TopBar />
        
        <div className="client-content container py-5">
          <h1 className="text-center mb-5">Nuestros Productos</h1>
          
          <div className="row">
            <div className={`col-lg-${showCart ? '8' : '12'}`}>
              <ProductCatalog />
            </div>
            
            {showCart && (
              <div className="col-lg-4">
                <Cart />
              </div>
            )}
          </div>
          
          <div className="cart-toggle">
            <button 
              className="btn btn-primary cart-toggle-btn" 
              onClick={toggleCart}
            >
              {showCart ? 'Ocultar Carrito' : 'Ver Carrito'}
            </button>
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

export default ClientApp;
