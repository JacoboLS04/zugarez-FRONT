import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Swal from 'sweetalert2';

export const usePaymentNotifications = () => {
  const [searchParams] = useSearchParams();
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

    // Detectar pago exitoso
    if (searchParams.get('paymentSuccess') === 'true') {
      const orderId = searchParams.get('orderId');
      const status = searchParams.get('status');
      const total = searchParams.get('total');

      Swal.fire({
        icon: 'success',
        title: '🎉 ¡Pago Exitoso!',
        html: `
          <div class="text-start p-3">
            <div class="mb-3">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              <strong>Orden #${orderId}</strong>
            </div>
            <div class="mb-2">
              <span class="badge bg-success">${status}</span>
            </div>
            <div class="mb-3">
              <h4 class="text-success">${formatCOP(total)}</h4>
            </div>
            <hr>
            <p class="text-muted mb-0">
              <i class="bi bi-envelope me-2"></i>
              Recibirás un correo de confirmación
            </p>
          </div>
        `,
        confirmButtonText: 'Ver Mis Compras',
        showCancelButton: true,
        cancelButtonText: 'Seguir Comprando',
        confirmButtonColor: '#198754',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/orders');
        }
      });
      
      clearCart();
      navigate('/', { replace: true });
    }

    // Detectar pago fallido
    if (searchParams.get('paymentFailed') === 'true') {
      Swal.fire({
        icon: 'error',
        title: '❌ Pago Rechazado',
        text: 'El pago fue rechazado o cancelado. Por favor, intenta nuevamente.',
        confirmButtonText: 'Reintentar',
        confirmButtonColor: '#dc3545'
      }).then(() => {
        navigate('/client');
      });
      
      navigate('/', { replace: true });
    }

    // Detectar pago pendiente
    if (searchParams.get('paymentPending') === 'true') {
      Swal.fire({
        icon: 'warning',
        title: '⏳ Pago Pendiente',
        html: `
          <p>Tu pago está pendiente de confirmación.</p>
          <hr>
          <p class="text-muted">
            <i class="bi bi-clock me-2"></i>
            Te notificaremos por correo cuando sea aprobado
          </p>
        `,
        confirmButtonText: 'Ver Mis Compras',
        confirmButtonColor: '#ffc107'
      }).then(() => {
        navigate('/orders');
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
};
