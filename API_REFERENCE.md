# API Reference - Zugarez Frontend

## 📡 Descripción General

Esta documentación describe todas las llamadas API que el frontend realiza al backend de Spring Boot.

## 🔧 Configuración Base

```javascript
// src/services/api.js
const DEFAULT_BASE = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app';
const baseURL = process.env.REACT_APP_API_BASE || DEFAULT_BASE;
```

**Headers por defecto:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}' // Agregado automáticamente
}
```

---

## 🔐 Autenticación

### POST /auth/login
Iniciar sesión de usuario.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response exitoso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "roles": ["ROLE_USER"]
  }
}
```

**Errores:**
- `401`: Credenciales inválidas
- `403`: Cuenta desactivada

**Ejemplo de uso:**
```javascript
import { authService } from '../services/authService';

const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    console.log('Login exitoso:', response.user);
  } catch (error) {
    console.error('Error en login:', error);
  }
};
```

---

### POST /auth/create-user
Registrar nuevo usuario.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Response exitoso (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

**Errores:**
- `400`: Datos inválidos
- `409`: Usuario o email ya existe

---

### POST /auth/logout
Cerrar sesión (opcional, puede ser solo frontend).

**Request:**
```json
{
  "token": "string"
}
```

**Response exitoso (200):**
```json
{
  "message": "Logout exitoso"
}
```

---

## 📦 Productos

### GET /api/products
Obtener lista de productos.

**Query Parameters:**
- `page` (optional): Número de página (default: 0)
- `size` (optional): Tamaño de página (default: 20)
- `search` (optional): Búsqueda por nombre
- `category` (optional): Filtrar por categoría
- `minPrice` (optional): Precio mínimo
- `maxPrice` (optional): Precio máximo

**Response exitoso (200):**
```json
{
  "content": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 0,
      "stock": 0,
      "category": "string",
      "imageUrl": "string",
      "active": true,
      "createdAt": "2025-10-19T00:00:00Z"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0
}
```

**Ejemplo de uso:**
```javascript
import api from '../services/api';

const fetchProducts = async (filters) => {
  try {
    const response = await api.get('/api/products', {
      params: {
        search: filters.search,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
```

---

### GET /api/products/{id}
Obtener detalles de un producto específico.

**Response exitoso (200):**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 0,
  "stock": 0,
  "category": "string",
  "imageUrl": "string",
  "active": true,
  "lotes": [
    {
      "id": "string",
      "cantidad": 0,
      "fechaVencimiento": "2025-12-31"
    }
  ]
}
```

**Errores:**
- `404`: Producto no encontrado

---

### POST /api/products
Crear nuevo producto (Admin).

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "stock": 0,
  "category": "string",
  "imageUrl": "string"
}
```

**Response exitoso (201):**
```json
{
  "id": "string",
  "name": "string",
  "message": "Producto creado exitosamente"
}
```

**Errores:**
- `400`: Datos inválidos
- `403`: Sin permisos de admin

---

### PUT /api/products/{id}
Actualizar producto existente (Admin).

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "stock": 0,
  "category": "string",
  "imageUrl": "string"
}
```

**Response exitoso (200):**
```json
{
  "message": "Producto actualizado exitosamente"
}
```

---

### DELETE /api/products/{id}
Eliminar producto (Admin).

**Response exitoso (200):**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

---

## 🛒 Pedidos

### GET /api/orders
Obtener pedidos del usuario.

**Query Parameters:**
- `status` (optional): Filtrar por estado (pending, approved, cancelled)
- `page` (optional): Número de página
- `size` (optional): Tamaño de página

**Response exitoso (200):**
```json
{
  "content": [
    {
      "id": "string",
      "userId": "string",
      "items": [
        {
          "productId": "string",
          "productName": "string",
          "quantity": 0,
          "price": 0,
          "subtotal": 0
        }
      ],
      "total": 0,
      "status": "pending",
      "paymentId": "string",
      "createdAt": "2025-10-19T00:00:00Z",
      "updatedAt": "2025-10-19T00:00:00Z"
    }
  ],
  "totalElements": 10,
  "totalPages": 1
}
```

**Ejemplo de uso:**
```javascript
const fetchOrders = async (filters = {}) => {
  const response = await api.get('/api/orders', {
    params: filters
  });
  return response.data;
};
```

---

### GET /api/orders/{id}
Obtener detalles de un pedido específico.

**Response exitoso (200):**
```json
{
  "id": "string",
  "userId": "string",
  "userName": "string",
  "userEmail": "string",
  "items": [...],
  "total": 0,
  "status": "approved",
  "paymentId": "string",
  "paymentStatus": "approved",
  "createdAt": "2025-10-19T00:00:00Z"
}
```

---

### POST /api/orders
Crear nuevo pedido.

**Request:**
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": 0
    }
  ],
  "paymentMethod": "mercadopago"
}
```

**Response exitoso (201):**
```json
{
  "orderId": "string",
  "preferenceId": "string",
  "initPoint": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=...",
  "message": "Pedido creado exitosamente"
}
```

**Errores:**
- `400`: Items inválidos o sin stock
- `401`: No autenticado

---

### PUT /api/orders/{id}
Actualizar estado del pedido (Admin).

**Request:**
```json
{
  "status": "approved" // pending, approved, cancelled, delivered
}
```

**Response exitoso (200):**
```json
{
  "message": "Pedido actualizado exitosamente"
}
```

---

## 💳 Pagos (Mercado Pago)

### POST /api/payments/create-preference
Crear preferencia de pago para Mercado Pago.

**Request:**
```json
{
  "orderId": "string",
  "items": [
    {
      "title": "string",
      "quantity": 0,
      "unit_price": 0
    }
  ],
  "payer": {
    "email": "string"
  }
}
```

**Response exitoso (200):**
```json
{
  "preferenceId": "string",
  "initPoint": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com/checkout/v1/redirect?pref_id=..."
}
```

---

### POST /api/payments/webhook
Webhook de Mercado Pago (llamado por MP, no por frontend).

**Request (de Mercado Pago):**
```json
{
  "action": "payment.updated",
  "data": {
    "id": "payment_id"
  }
}
```

---

### GET /api/payments/{paymentId}/status
Consultar estado de un pago.

**Response exitoso (200):**
```json
{
  "id": "string",
  "status": "approved",
  "statusDetail": "accredited",
  "orderId": "string",
  "amount": 0,
  "dateApproved": "2025-10-19T00:00:00Z"
}
```

---

## 📊 Inventario

### GET /api/inventory
Obtener inventario completo (Admin).

**Response exitoso (200):**
```json
[
  {
    "productId": "string",
    "productName": "string",
    "stockTotal": 0,
    "lotes": [
      {
        "id": "string",
        "cantidad": 0,
        "fechaVencimiento": "2025-12-31",
        "fechaIngreso": "2025-01-01"
      }
    ]
  }
]
```

---

### GET /api/lotes
Obtener lista de lotes (Admin).

**Response exitoso (200):**
```json
[
  {
    "id": "string",
    "productId": "string",
    "productName": "string",
    "cantidad": 0,
    "fechaVencimiento": "2025-12-31",
    "fechaIngreso": "2025-01-01",
    "proveedor": "string"
  }
]
```

---

### POST /api/lotes
Crear nuevo lote (Admin).

**Request:**
```json
{
  "productId": "string",
  "cantidad": 0,
  "fechaVencimiento": "2025-12-31",
  "proveedor": "string",
  "costoUnitario": 0
}
```

**Response exitoso (201):**
```json
{
  "id": "string",
  "message": "Lote creado exitosamente"
}
```

---

### GET /api/movimientos
Obtener movimientos de inventario (Admin).

**Query Parameters:**
- `tipo` (optional): ENTRADA, SALIDA, AJUSTE
- `startDate` (optional): Fecha inicio
- `endDate` (optional): Fecha fin

**Response exitoso (200):**
```json
[
  {
    "id": "string",
    "productId": "string",
    "productName": "string",
    "tipo": "ENTRADA",
    "cantidad": 0,
    "fecha": "2025-10-19T00:00:00Z",
    "descripcion": "string",
    "usuario": "string"
  }
]
```

---

### POST /api/movimientos
Registrar movimiento de inventario (Admin).

**Request:**
```json
{
  "productId": "string",
  "tipo": "ENTRADA",
  "cantidad": 0,
  "descripcion": "string"
}
```

**Response exitoso (201):**
```json
{
  "id": "string",
  "message": "Movimiento registrado exitosamente"
}
```

---

## 👥 Usuarios (Admin)

### GET /api/users
Obtener lista de usuarios (Admin).

**Query Parameters:**
- `active` (optional): true/false
- `role` (optional): ROLE_USER, ROLE_ADMIN

**Response exitoso (200):**
```json
[
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "roles": ["ROLE_USER"],
    "active": true,
    "createdAt": "2025-10-19T00:00:00Z"
  }
]
```

---

### PUT /api/users/{id}/deactivate
Desactivar usuario (Admin).

**Response exitoso (200):**
```json
{
  "message": "Usuario desactivado exitosamente"
}
```

---

### PUT /api/users/{id}/activate
Reactivar usuario (Admin).

**Response exitoso (200):**
```json
{
  "message": "Usuario activado exitosamente"
}
```

---

## 📄 Remisiones

### GET /api/remisiones
Obtener remisiones (Admin).

**Response exitoso (200):**
```json
[
  {
    "id": "string",
    "orderId": "string",
    "numeroRemision": "REM-001",
    "fecha": "2025-10-19",
    "items": [...],
    "destinatario": "string",
    "direccion": "string"
  }
]
```

---

### POST /api/remisiones
Crear remisión (Admin).

**Request:**
```json
{
  "orderId": "string",
  "destinatario": "string",
  "direccion": "string",
  "ciudad": "string",
  "telefono": "string"
}
```

**Response exitoso (201):**
```json
{
  "id": "string",
  "numeroRemision": "REM-001",
  "message": "Remisión creada exitosamente"
}
```

---

## 🔒 Interceptores y Manejo de Errores

### Request Interceptor

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    
    if (status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    if (status === 403) {
      // Sin permisos o cuenta desactivada
      const data = error.response.data;
      if (data.deactivatedAt) {
        window.location.href = '/login?deactivated=true';
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## 📝 Códigos de Estado HTTP

### Exitosos (2xx)
- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado
- `204 No Content`: Exitoso sin contenido

### Errores de Cliente (4xx)
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (ej: usuario ya existe)

### Errores de Servidor (5xx)
- `500 Internal Server Error`: Error del servidor
- `503 Service Unavailable`: Servicio no disponible

---

## 🧪 Testing de APIs

### Ejemplo con Jest y Mock

```javascript
import api from '../services/api';

jest.mock('../services/api');

describe('API Tests', () => {
  it('should fetch products', async () => {
    const mockData = { content: [{ id: '1', name: 'Product' }] };
    api.get.mockResolvedValue({ data: mockData });
    
    const response = await api.get('/api/products');
    expect(response.data).toEqual(mockData);
  });
});
```

---

## 📚 Notas Adicionales

### Formato de Fechas
Las fechas se envían y reciben en formato ISO 8601:
```
2025-10-19T14:30:00Z
```

### Formato de Moneda
Los precios se manejan como números (centavos o unidades básicas):
```javascript
// Backend envía: 50000 (representando $50,000 COP)
// Frontend formatea:
const formatted = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP'
}).format(50000);
// Resultado: "$50.000"
```

### Paginación
Todas las respuestas paginadas siguen este formato:
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0,
  "size": 10
}
```

---

Esta documentación cubre los endpoints principales. Para endpoints específicos adicionales, consultar el código del backend o la documentación Swagger si está disponible.

