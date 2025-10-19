import { useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const usePaymentNotifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const formatCOP = (amount) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(amount);
    };

    // ✅ Detectar pago exitoso
    if (searchParams.get('paymentSuccess') === 'true') {
      const orderId = searchParams.get('orderId');
      const status = searchParams.get('status');
      const total = searchParams.get('total');

      console.log('🎉 Pago exitoso detectado:', { orderId, status, total });

      // Limpiar carrito
      try {
        clearCart();
      } catch (error) {
        console.error('Error limpiando carrito:', error);
      }
      
      // Limpiar URL
      setSearchParams({});

      // Mostrar alert
      const confirmar = window.confirm(
        `🎉 ¡Pago Exitoso!\n\n` +
        `Orden: #${orderId}\n` +
        `Estado: ${status}\n` +
        `Total: ${formatCOP(total)}\n\n` +
        `✅ Recibirás un correo de confirmación\n\n` +
        `¿Quieres ver tus pedidos?`
      );

      if (confirmar) {
        navigate('/orders');
      } else {
        navigate('/client');
      }
    }

    // ❌ Detectar pago fallido
    if (searchParams.get('paymentFailed') === 'true') {
      console.log('❌ Pago fallido');
      setSearchParams({});
      alert('❌ Pago Rechazado\n\nEl pago fue rechazado o cancelado.');
      navigate('/client');
    }

    // ⏳ Detectar pago pendiente
    if (searchParams.get('paymentPending') === 'true') {
      console.log('⏳ Pago pendiente');
      setSearchParams({});
      
      const confirmar = window.confirm(
        '⏳ Pago Pendiente\n\n' +
        'Tu pago está pendiente de confirmación.\n' +
        'Te notificaremos por correo.\n\n' +
        '¿Quieres ver tus pedidos?'
      );

      if (confirmar) {
        navigate('/orders');
      } else {
        navigate('/client');
      }
    }

    // ⚠️ Error general
    if (searchParams.get('paymentError') === 'true') {
      console.error('⚠️ Error de pago');
      setSearchParams({});
      alert('⚠️ Error Procesando el Pago\n\nVerifica tu historial de pedidos.');
      navigate('/client');
    }
  }, [searchParams, setSearchParams, clearCart, navigate]);
};
