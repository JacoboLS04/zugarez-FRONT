import React from 'react';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/PaginaAdmin/Header/Header';
import CrudMongoApp from './components/CrudMongoApp/CrudMongoApp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/PaginaPrincipal/TopBar/TopBar';
import Carousel from './components/PaginaPrincipal/Carousel/Carousel';
import InfoSection from './components/PaginaPrincipal/InfoSection/InfoSection';
import PaginaPrincipal from './components/PaginaPrincipal/PaginaPrincipal';
import AuthPage from './components/auth/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/LoginPage/LoginPage';
import AccessibilityWidget from './components/Accesibility/AccessibilityWidget';
import ClientApp from './components/ClientApp/ClientApp';
import OrdersApp from './components/OrdersApp/OrdersApp';
import MenuPage from './components/PaginaPrincipal/Menu/Menu/MenuPage';
import ClientShopping from './components/ClientShopping/ClientShopping';

function App() {
  return (
      
      <React.StrictMode>
        <Router>
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<PaginaPrincipal/>} />

            {/* Login */}
            <Route path="/login" element={ <LoginPage/>} />

            {/* Menú */}
            <Route path="/menu" element={<MenuPage />} />

            {/* Cliente - Pedidos */}
            <Route path="/client" element={<ClientApp />} />

            {/* Cliente - Compras */}
            <Route path="/shop" element={<ClientShopping />} />

            {/* Gestión de Pedidos */}
            <Route path="/orders" element={<OrdersApp />} />
            
          </Routes>
        </Router>
        <AccessibilityWidget/>
      </React.StrictMode>
  
  );
}

export default App;
