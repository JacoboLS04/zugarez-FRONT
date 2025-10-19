import { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Swal from 'sweetalert2';

export const usePaymentNotifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
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
        confirmButtonText: '🛒 Seguir Comprando',
        showCancelButton: true,
        cancelButtonText: '📦 Ver Mi Pedido',
        confirmButtonColor: '#198754',
        cancelButtonColor: '#6c757d',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Usuario quiere seguir comprando - redirige a productos
          window.location.href = '/products';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Usuario quiere ver su pedido
          window.location.href = '/orders';
        }
      });
      
      clearCart();
      setSearchParams({});
    }

    // ❌ Detectar pago fallido
    if (searchParams.get('paymentFailed') === 'true') {
      console.log('❌ Pago fallido detectado');

      Swal.fire({
        icon: 'error',
        title: '❌ Pago Rechazado',
        html: `
          <p>El pago fue rechazado o cancelado.</p>
          <hr>
          <p class="text-muted">Verifica tus datos e intenta nuevamente</p>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc3545'
      }).then(() => {
        // Después de cerrar, se queda en /products
        setSearchParams({});
      });
    }

    // ⏳ Detectar pago pendiente
    if (searchParams.get('paymentPending') === 'true') {
      console.log('⏳ Pago pendiente detectado');

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
        confirmButtonText: 'Ver Mis Pedidos',
        showCancelButton: true,
        cancelButtonText: 'Seguir Comprando',
        confirmButtonColor: '#ffc107'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/orders';
        } else {
          window.location.href = '/products';
        }
      });
      
      setSearchParams({});
    }

    // ⚠️ Error general
    if (searchParams.get('paymentError') === 'true') {
      console.error('⚠️ Error de pago detectado');
      console.error('URL completa:', window.location.href);
      console.error('Todos los parámetros:', Object.fromEntries(searchParams));

      Swal.fire({
        icon: 'error',
        title: '⚠️ Error Procesando el Pago',
        html: `
          <div class="text-start">
            <p><strong>Hubo un error al procesar tu pago en el servidor.</strong></p>
            <hr>
            <p class="text-muted">Posibles causas:</p>
            <ul class="text-muted small">
              <li>Error de comunicación con MercadoPago</li>
              <li>Error al actualizar la orden en la base de datos</li>
              <li>Problema de configuración del servidor</li>
            </ul>
            <hr>
            <p class="mb-0">
              <i class="bi bi-info-circle me-2"></i>
              <strong>¿Qué hacer?</strong>
            </p>
            <p class="text-muted small mb-0">
              1. Verifica tu historial de pedidos<br>
              2. Si el pago fue descontado pero no aparece la orden, contacta a soporte<br>
              3. NO intentes pagar nuevamente sin verificar
            </p>
          </div>
        `,
        confirmButtonText: 'Ver Mis Pedidos',
        showCancelButton: true,
        cancelButtonText: 'Volver a Productos',
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/orders';
        } else {
          window.location.href = '/products';
        }
      });
      
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, clearCart, location.pathname]);
};
