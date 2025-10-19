import React, { useState } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import TopBar from '../PaginaPrincipal/TopBar/TopBar';
import Footer from '../PaginaPrincipal/Footer/Footer';
import OrdersList from './OrdersList';
import './OrdersApp.css';

const OrdersApp = () => {
  return (
    <AuthProvider>
      <div className="orders-app">
        
        
        <div className="orders-content container py-5">
          <h1 className="text-center mb-5">Gestión de Pedidos Admin</h1>
          <OrdersList />
        </div>
        
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default OrdersApp;
