import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import Swal from 'sweetalert2';
import { usePaymentNotifications } from '../../hooks/usePaymentNotifications';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Detectar pago exitoso
    if (searchParams.get('paymentSuccess') === 'true') {
      const orderId = searchParams.get('orderId');
      const status = searchParams.get('status');
      const total = searchParams.get('total');

      // Formatear total
      const formattedTotal = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(total);

      // Mostrar notificación de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Pago Exitoso!',
        html: `
          <div class="text-start">
            <p><strong>Orden:</strong> #${orderId}</p>
            <p><strong>Estado:</strong> ${status}</p>
            <p><strong>Total:</strong> ${formattedTotal}</p>
          </div>
          <hr>
          <p class="text-muted">Recibirás un correo de confirmación</p>
        `,
        confirmButtonText: 'Ver Mis Pedidos',
        showCancelButton: true,
        cancelButtonText: 'Continuar Comprando'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/orders');
        }
      });
      
      // Limpiar carrito
      clearCart();
      
      // Limpiar parámetros de la URL
      navigate('/', { replace: true });
    }

    // Detectar pago fallido
    if (searchParams.get('paymentFailed') === 'true') {
      Swal.fire({
        icon: 'error',
        title: 'Pago Rechazado',
        text: 'El pago fue rechazado. Por favor, intenta nuevamente.',
        confirmButtonText: 'Entendido'
      });
      
      navigate('/', { replace: true });
    }

    // Detectar pago pendiente
    if (searchParams.get('paymentPending') === 'true') {
      Swal.fire({
        icon: 'info',
        title: 'Pago Pendiente',
        html: `
          <p>Tu pago está pendiente de confirmación.</p>
          <p class="text-muted">Te notificaremos por correo cuando sea aprobado.</p>
        `,
        confirmButtonText: 'Entendido'
      });
      
      navigate('/', { replace: true });
    }

    // Detectar error general
    if (searchParams.get('paymentError') === 'true') {
      Swal.fire({
        icon: 'error',
        title: 'Error en el Pago',
        text: 'Hubo un error procesando el pago. Por favor, contacta con soporte.',
        confirmButtonText: 'Entendido'
      });
      
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate, clearCart]);

  // Detectar notificaciones de pago
  usePaymentNotifications();

  return (
    <div className="home">
      {/* ...existing code... */}
    </div>
  );
};

export default Home;