import React from 'react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import Footer from '../PaginaPrincipal/Footer/Footer';
import OrdersList from './OrdersList';
import './OrdersApp.css';

const OrdersAppContent = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <div className="orders-app">
      <div className="orders-content container py-5">
        <h1 className="text-center mb-5">
          <i className="bi bi-box-seam me-3"></i>
          {isAdmin ? 'Gestión de Pedidos (Admin)' : 'Mis Pedidos'}
        </h1>
        <OrdersList />
      </div>
      
      <Footer />
    </div>
  );
};

const OrdersApp = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <OrdersAppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default OrdersApp;
