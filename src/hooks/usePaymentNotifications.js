import { useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const usePaymentNotifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Solo ejecutar en rutas de productos/cliente
    const allowedPaths = ['/products', '/client', '/', '/orders'];
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

      // Limpiar carrito PRIMERO
      clearCart();
      
      // Limpiar parámetros
      setSearchParams({});

      // Mostrar alerta nativa (más confiable que SweetAlert)
      const mensaje = `
🎉 ¡Pago Exitoso!

Orden: #${orderId}
Estado: ${status}
Total: ${formatCOP(total)}

✅ Recibirás un correo de confirmación
      `;

      if (window.confirm(mensaje + '\n\n¿Quieres ver tus pedidos?')) {
        navigate('/orders');
      } else {
        // Se queda en /products para seguir comprando
        navigate('/products', { replace: true });
      }
    }

    // ❌ Detectar pago fallido
    if (searchParams.get('paymentFailed') === 'true') {
      console.log('❌ Pago fallido detectado');
      
      setSearchParams({});
      
      alert('❌ Pago Rechazado\n\nEl pago fue rechazado o cancelado.\nVerifica tus datos e intenta nuevamente.');
    }

    // ⏳ Detectar pago pendiente
    if (searchParams.get('paymentPending') === 'true') {
      console.log('⏳ Pago pendiente detectado');
      
      setSearchParams({});
      
      const mensaje = `
⏳ Pago Pendiente

Tu pago está pendiente de confirmación.
Te notificaremos por correo cuando sea aprobado.

Esto puede tomar de algunos minutos a 48 horas hábiles.
      `;

      if (window.confirm(mensaje + '\n\n¿Quieres ver tus pedidos?')) {
        navigate('/orders');
      }
    }

    // ⚠️ Error general
    if (searchParams.get('paymentError') === 'true') {
      console.error('⚠️ Error de pago detectado');
      console.error('URL completa:', window.location.href);
      
      setSearchParams({});
      
      const mensaje = `
⚠️ Error Procesando el Pago

Hubo un error al procesar tu pago en el servidor.

Posibles causas:
• Error de comunicación con MercadoPago
• Error al actualizar la orden en la base de datos
• Problema de configuración del servidor

¿Qué hacer?
1. Verifica tu historial de pedidos
2. Si el pago fue descontado pero no aparece la orden, contacta a soporte
3. NO intentes pagar nuevamente sin verificar
      `;

      if (window.confirm(mensaje + '\n\n¿Quieres ver tus pedidos?')) {
        navigate('/orders');
      } else {
        navigate('/products', { replace: true });
      }
    }
  }, [searchParams, setSearchParams, clearCart, location.pathname, navigate]);
};
