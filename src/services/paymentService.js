const DEFAULT_BASE = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
const API_URL = process.env.REACT_APP_API_BASE || DEFAULT_BASE;

export const paymentService = {
  async checkout(items, token) {
    const response = await fetch(`${API_URL}/payment/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al procesar el pago');
    }

    return response.json();
  },

  async getMyOrders(token) {
    const response = await fetch(`${API_URL}/payment/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener pedidos');
    }

    return response.json();
  },

  async getOrderById(orderId, token) {
    const response = await fetch(`${API_URL}/payment/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener el pedido');
    }

    return response.json();
  }
};
