import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const usePaymentNotifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

    // ✅ PAGO EXITOSO
    if (searchParams.get('paymentSuccess') === 'true') {
      const orderId = searchParams.get('orderId');
      const status = searchParams.get('status');
      const total = searchParams.get('total');

      console.log('🎉 PAGO EXITOSO:', { orderId, status, total });

      // Limpiar carrito
      try {
        clearCart();
      } catch (e) {
        console.error('Error limpiando carrito:', e);
      }
      
      // Limpiar URL
      setSearchParams({});

      // Mostrar confirmación
      setTimeout(() => {
        const confirmar = window.confirm(
          `🎉 ¡PAGO EXITOSO!\n\n` +
          `Orden: #${orderId}\n` +
          `Estado: ${status}\n` +
          `Total: ${formatCOP(total)}\n\n` +
          `¿Quieres ver tus pedidos?`
        );

        if (confirmar) {
          navigate('/orders');
        } else {
          navigate('/client');
        }
      }, 100);
    }

    // ❌ PAGO FALLIDO
    if (searchParams.get('paymentFailed') === 'true') {
      console.log('❌ PAGO FALLIDO');
      setSearchParams({});
      alert('❌ Pago Rechazado\n\nIntenta nuevamente.');
      navigate('/client');
    }

    // ⏳ PAGO PENDIENTE
    if (searchParams.get('paymentPending') === 'true') {
      console.log('⏳ PAGO PENDIENTE');
      setSearchParams({});
      
      const confirmar = window.confirm(
        '⏳ Pago Pendiente\n\nTe notificaremos cuando sea confirmado.\n\n¿Ver pedidos?'
      );

      if (confirmar) {
        navigate('/orders');
      } else {
        navigate('/client');
      }
    }

    // ⚠️ ERROR
    if (searchParams.get('paymentError') === 'true') {
      console.error('⚠️ ERROR DE PAGO');
      setSearchParams({});
      alert('⚠️ Error\n\nVerifica tu historial de pedidos.');
      navigate('/client');
    }
  }, [searchParams, setSearchParams, clearCart, navigate]);
};
