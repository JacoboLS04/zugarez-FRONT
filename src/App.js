import React from 'react';

import ProtectedAdmin from './components/ProtectedAdmin';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import AccessibilityWidget from './components/Accesibility/AccessibilityWidget';
import ClientApp from './components/ClientApp/ClientApp';
import OrdersApp from './components/OrdersApp/OrdersApp';
import MenuPage from './components/PaginaPrincipal/Menu/Menu/MenuPage';
import ClientShopping from './components/ClientShopping/ClientShopping';
import ClientePage from './components/ClientShopping/ClientePage'; // <-- nuevo wrapper con sidebar
import DeactivatedUsers from './components/admin/DeactivatedUsers';

function App() {
  return (
      
      <React.StrictMode>
        <AuthProvider>
        <Router>
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<PaginaPrincipal/>} />

            {/* Login */}
            <Route path="/login/*" element={ <LoginPage/>} />

            {/* Menú */}
            <Route path="/menu" element={<MenuPage />} />

            {/* Cliente - Pedidos */}
            <Route path="/client" element={<ClientApp />} />

            {/* Cliente - Compras: ahora en /cliente */}
            <Route path="/cliente" element={<ClientePage />} />

            {/* Mantener compatibilidad: redirigir /shop a /cliente */}
            <Route path="/shop" element={<Navigate to="/cliente" replace />} />

            {/* Gestión de Pedidos */}
            <Route path="/orders" element={<OrdersApp />} />
            {/* Admin: usuarios desactivados */}
            <Route path="/admin/deactivated-users" element={<ProtectedAdmin><DeactivatedUsers/></ProtectedAdmin>} />
            
          </Routes>
        </Router>
        </AuthProvider>
        <AccessibilityWidget/>
      </React.StrictMode>
  
  );
}

export default App;
