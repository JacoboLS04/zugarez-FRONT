const DEFAULT_BASE = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
const API_URL = process.env.REACT_APP_API_BASE || DEFAULT_BASE;

export const paymentService = {
  async checkout(items, token) {
    console.log('📦 Enviando checkout:', { items });
    
    const response = await fetch(`${API_URL}/payment/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    });

    console.log('📡 Respuesta checkout:', response.status);
    
    if (response.status === 403) {
      const data = await response.json();
      throw new Error(data.error || 'Tu cuenta ha sido desactivada');
    }
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error en checkout:', error);
      throw new Error(error.error || error.message || 'Error al procesar el pago');
    }

    const data = await response.json();
    console.log('✅ Checkout exitoso:', data);
    return data;
  },

  async checkPaymentStatus(orderId, token) {
    console.log(`🔍 Verificando estado del pago para orden #${orderId}`);
    
    const response = await fetch(`${API_URL}/payment/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 403) {
      const data = await response.json();
      throw new Error(data.error || 'Tu cuenta ha sido desactivada');
    }

    if (!response.ok) {
      throw new Error('Error al verificar el estado del pago');
    }

    const data = await response.json();
    console.log('📊 Estado del pago:', data);
    return data;
  },

  async getMyOrders(token) {
    console.log('📦 Cargando mis pedidos...');
    
    const response = await fetch(`${API_URL}/payment/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 403) {
      const data = await response.json();
      throw new Error(data.error || 'Tu cuenta ha sido desactivada');
    }

    if (!response.ok) {
      throw new Error('Error al obtener pedidos');
    }

    const data = await response.json();
    console.log(`✅ ${data.length} pedidos cargados`);
    return data;
  },

  // Obtener TODAS las órdenes (solo admin)
  async getAllOrders(token) {
    console.log('📦 [ADMIN] Cargando todas las órdenes del sistema...');
    console.log('🔑 Token:', token ? 'Presente' : 'Ausente');
    
    try {
      // Intentar endpoint específico de admin primero
      let response = await fetch(`${API_URL}/payment/admin/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Si no existe ese endpoint (404), intentar con parámetro
      if (response.status === 404) {
        console.log('⚠️ Endpoint /admin/orders no existe, probando con parámetro...');
        response = await fetch(`${API_URL}/payment/orders?all=true`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      console.log('📡 Response status:', response.status);

      if (response.status === 403) {
        const data = await response.json();
        console.error('❌ Acceso denegado:', data);
        throw new Error(data.error || 'Acceso denegado - Verificar permisos de admin');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        
        // Si sigue sin funcionar, mostrar mensaje claro
        throw new Error(
          'El backend no está devolviendo todas las órdenes para admin. ' +
          'Por favor, contacta al desarrollador del backend para que modifique ' +
          'el endpoint /payment/orders para que devuelva todas las órdenes cuando el usuario es admin.'
        );
      }

      const data = await response.json();
      console.log('✅ [ADMIN] Respuesta del servidor:', {
        cantidadOrdenes: Array.isArray(data) ? data.length : 'No es array',
        tipoData: typeof data,
        primerosElementos: Array.isArray(data) ? data.slice(0, 2) : data
      });
      
      if (!Array.isArray(data)) {
        console.error('❌ La respuesta no es un array:', data);
        throw new Error('Formato de respuesta inválido del servidor');
      }
      
      console.log(`✅ [ADMIN] ${data.length} órdenes cargadas correctamente`);
      return data;
    } catch (error) {
      console.error('❌ Error en getAllOrders:', {
        mensaje: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  async getOrderById(orderId, token) {
    const response = await fetch(`${API_URL}/payment/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 403) {
      const data = await response.json();
      throw new Error(data.error || 'Tu cuenta ha sido desactivada');
    }

    if (!response.ok) {
      throw new Error('Error al obtener el pedido');
    }

    return response.json();
  }
};
