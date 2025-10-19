import { useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const usePaymentNotifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Ejecutar en TODAS las rutas principales
    const allowedPaths = ['/', '/client', '/products', '/orders'];
    if (!allowedPaths.includes(location.pathname)) {
      return;
    }

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
      clearCart();
      
      // Limpiar URL
      setSearchParams({});

      // Mostrar alert nativo
      const mensaje = `🎉 ¡Pago Exitoso!\n\nOrden: #${orderId}\nEstado: ${status}\nTotal: ${formatCOP(total)}\n\n✅ Recibirás un correo de confirmación`;

      if (window.confirm(mensaje + '\n\n¿Quieres ver tus pedidos?')) {
        navigate('/orders');
      } else {
        // Redirigir a /client para seguir comprando
        navigate('/client', { replace: true });
      }
    }

    // ❌ Detectar pago fallido
    if (searchParams.get('paymentFailed') === 'true') {
      console.log('❌ Pago fallido detectado');
      setSearchParams({});
      alert('❌ Pago Rechazado\n\nEl pago fue rechazado o cancelado.');
      navigate('/client', { replace: true });
    }

    // ⏳ Detectar pago pendiente
    if (searchParams.get('paymentPending') === 'true') {
      console.log('⏳ Pago pendiente detectado');
      setSearchParams({});
      
      const mensaje = '⏳ Pago Pendiente\n\nTu pago está pendiente de confirmación.\nTe notificaremos por correo cuando sea aprobado.';
      
      if (window.confirm(mensaje + '\n\n¿Quieres ver tus pedidos?')) {
        navigate('/orders');
      } else {
        navigate('/client', { replace: true });
      }
    }

    // ⚠️ Error general
    if (searchParams.get('paymentError') === 'true') {
      console.error('⚠️ Error de pago detectado');
      setSearchParams({});
      
      alert('⚠️ Error Procesando el Pago\n\nHubo un error al procesar tu pago.\nVerifica tu historial de pedidos.');
      navigate('/client', { replace: true });
    }
  }, [searchParams, setSearchParams, clearCart, location.pathname, navigate]);
};
