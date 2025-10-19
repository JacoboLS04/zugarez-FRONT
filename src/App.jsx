import React, { useEffect } from 'react';
import { BrowserRouter as Router, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import Footer from '../PaginaPrincipal/Footer/Footer';
import OrdersList from './OrdersList';
import './OrdersApp.css';
import { usePaymentNotifications } from './hooks/usePaymentNotifications';
import { CartProvider } from './contexts/CartContext';

function PaymentHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('paymentSuccess') === 'true') {
      const orderId = searchParams.get('orderId');
      const status = searchParams.get('status');
      const total = searchParams.get('total');

      console.log('🎉 PAGO EXITOSO');

      localStorage.removeItem('cart');
      localStorage.removeItem('currentOrderId');
      localStorage.removeItem('currentPreferenceId');

      setSearchParams({});

      const formatCOP = (amount) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(amount);
      };

      if (window.confirm(`🎉 ¡PAGO EXITOSO!\n\nOrden: #${orderId}\nTotal: ${formatCOP(total)}\n\n¿Ver pedidos?`)) {
        navigate('/orders');
      } else {
        navigate('/client');
      }
    }
  }, [searchParams, setSearchParams, navigate]);

  return null;
}

function AppContent() {
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
}

function App() {
  // Detectar notificaciones de pago
  usePaymentNotifications();

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <PaymentHandler />
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;