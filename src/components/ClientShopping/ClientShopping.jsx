import React, { useState } from 'react';
import { CartProvider } from '../../contexts/CartContext';
import { AuthProvider } from '../../contexts/AuthContext';
import TopBar from '../PaginaPrincipal/TopBar/TopBar';
import Footer from '../PaginaPrincipal/Footer/Footer';
import ProductCatalog from './ProductCatalog';
import ShoppingCart from './ShoppingCart';
import './ClientShopping.css';

const ClientShopping = () => {
  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="client-shopping">
          <TopBar />
          
          <div className="shopping-content container py-5">
            <h1 className="text-center mb-5">Catálogo de Productos</h1>
            
            <div className="row">
              <div className={`col-lg-${showCart ? '8' : '12'}`}>
                <ProductCatalog />
              </div>
              
              {showCart && (
                <div className="col-lg-4">
                  <ShoppingCart />
                </div>
              )}
            </div>
            
            <div className="cart-toggle">
              <button 
                className="btn btn-primary cart-toggle-btn shadow" 
                onClick={toggleCart}
              >
                <i className="bi bi-cart3"></i>
                {showCart ? ' Ocultar Carrito' : ' Ver Carrito'}
              </button>
            </div>
          </div>
          
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default ClientShopping;
