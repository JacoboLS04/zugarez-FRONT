# Arquitectura del Sistema Zugarez

## 📐 Visión General

Zugarez Frontend es una aplicación React de una sola página (SPA) que sigue el patrón de arquitectura **Component-Based Architecture** con gestión de estado centralizada mediante Context API.

## 🏗️ Capas de la Aplicación

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│              (Components & UI Elements)                  │
├─────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                     │
│           (Contexts, Hooks, Business Logic)              │
├─────────────────────────────────────────────────────────┤
│                     SERVICE LAYER                        │
│            (API Services, Data Fetching)                 │
├─────────────────────────────────────────────────────────┤
│                    INTEGRATION LAYER                     │
│          (External APIs: Backend, Mercado Pago)          │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Patrones de Diseño Implementados

### 1. **Context Provider Pattern**
Gestión de estado global sin prop drilling.

```javascript
// AuthContext.js
<AuthProvider>
  <App />
</AuthProvider>
```

**Contextos implementados:**
- `AuthContext`: Autenticación y usuario
- `CartContext`: Carrito de compras

### 2. **Custom Hooks Pattern**
Encapsulación de lógica reutilizable.

```javascript
// useAuth.js
const { user, login, logout } = useAuth();

// usePaymentNotifications.js
usePaymentNotifications(); // Hook para notificaciones
```

### 3. **Protected Routes Pattern**
Control de acceso basado en autenticación y roles.

```javascript
<ProtectedRoute>
  <ClientShopping />
</ProtectedRoute>

<ProtectedAdmin>
  <AdminPage />
</ProtectedAdmin>
```

### 4. **Service Layer Pattern**
Separación de lógica de negocio y acceso a datos.

```javascript
// authService.js
authService.login(credentials)
authService.logout()
authService.getUser()

// paymentService.js
paymentService.createPreference(orderData)
```

### 5. **Interceptor Pattern**
Manejo automático de tokens y errores.

```javascript
// api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 6. **Observer Pattern**
Para eventos de autenticación y notificaciones.

```javascript
window.addEventListener('auth-change', handleAuthChange);
window.addEventListener('payment-notification', handlePayment);
```

## 🧩 Estructura de Componentes

### Jerarquía de Componentes

```
App.jsx
├── Router
│   ├── PaginaPrincipal (/)
│   │   ├── TopBar
│   │   ├── Carousel
│   │   ├── InfoSection
│   │   ├── PreMenuContainer
│   │   ├── ContactSocialMedia
│   │   └── Footer
│   │
│   ├── AuthPage (/login, /register)
│   │   ├── Login
│   │   └── Register
│   │
│   ├── ClientShopping (/client) [Protected]
│   │   ├── Header
│   │   ├── ProductCatalog
│   │   │   ├── FilterPanel
│   │   │   └── ProductCard[]
│   │   └── ShoppingCart
│   │
│   ├── AdminPage (/admin) [ProtectedAdmin]
│   │   ├── Header
│   │   ├── SideBar
│   │   ├── AdminLayout
│   │   │   ├── CrudMongoApp (Productos)
│   │   │   ├── InventoryModule
│   │   │   │   ├── Inventario
│   │   │   │   ├── LotesModule
│   │   │   │   ├── MovimientosModule
│   │   │   │   └── RemisionesModule
│   │   │   ├── OrdersApp
│   │   │   └── DeactivatedUsers
│   │   └── Footer
│   │
│   ├── OrdersApp (/orders) [Protected]
│   │   ├── OrdersFilterPanel
│   │   ├── OrdersList
│   │   │   └── OrderCard[]
│   │   └── Footer
│   │
│   └── Payment (/payment/*)
│       ├── PaymentSuccess
│       ├── PaymentPending
│       ├── PaymentError
│       └── PaymentNotification
│
└── AccessibilityWidget (Global)
```

## 🔄 Flujo de Datos

### 1. Autenticación
```
User Input → Login Form → authService.login()
  → API Request → Backend validates
  → JWT Token returned → Store in localStorage
  → AuthContext updates → Components re-render
  → Redirect to protected route
```

### 2. Carrito de Compras
```
Add to Cart → CartContext.addToCart()
  → Validate stock → Update state
  → Save to localStorage → UI updates
  → Checkout → Create order
  → Mercado Pago → Payment flow
```

### 3. Gestión de Pedidos
```
Order Created → Backend webhook
  → PaymentService processes → Update order status
  → Notification sent → UI updates
  → User sees updated order
```

## 🗄️ Gestión de Estado

### Estado Local vs Global

**Estado Local (useState, useReducer):**
- Estados de formularios
- Estados de UI (modales, tabs, etc.)
- Estados temporales de componentes

**Estado Global (Context API):**
- Autenticación de usuario
- Carrito de compras
- Datos compartidos entre componentes

### Persistencia de Datos

**localStorage:**
- Token JWT
- Datos de usuario
- Carrito de compras
- Preferencias de accesibilidad

**sessionStorage:**
- Datos temporales de sesión
- Estados de formularios en progreso

## 🔐 Seguridad

### Medidas Implementadas

1. **JWT Authentication**
   - Tokens almacenados de forma segura
   - Verificación en cada petición
   - Expiración automática

2. **Protected Routes**
   - Verificación de autenticación
   - Control de acceso por roles
   - Redirección automática

3. **HTTPS Only**
   - Comunicación encriptada
   - Tokens enviados por headers seguros

4. **Input Validation**
   - Validación en frontend y backend
   - Sanitización de datos
   - Prevención de XSS

5. **CORS Configuration**
   - Orígenes permitidos configurados
   - Headers de seguridad

## 🚀 Rendimiento

### Optimizaciones Implementadas

1. **Code Splitting**
   - Lazy loading de rutas
   - Carga dinámica de componentes

2. **Memoization**
   - React.memo para componentes
   - useMemo para cálculos costosos
   - useCallback para funciones

3. **Caching**
   - LocalStorage para datos persistentes
   - Cache de API responses

4. **Bundle Optimization**
   - Minificación de código
   - Tree shaking
   - Compresión de assets

## 📱 Responsive Design Strategy

### Breakpoints

```css
/* Mobile First */
320px   - Base mobile
768px   - Tablet
1024px  - Desktop
1440px  - Large screens
```

### Enfoque

1. **Mobile First**: Diseño base para móviles
2. **Progressive Enhancement**: Mejoras para pantallas grandes
3. **Flexbox & Grid**: Layout moderno y flexible
4. **Bootstrap Utilities**: Classes responsive integradas

## 🧪 Testing Strategy

### Tipos de Tests

1. **Unit Tests**
   - Componentes individuales
   - Funciones utilitarias
   - Custom hooks

2. **Integration Tests**
   - Flujos de usuario
   - Interacción entre componentes
   - Context providers

3. **E2E Tests** (Recomendado implementar)
   - Flujo completo de compra
   - Login y registro
   - Gestión de pedidos

## 🔌 Integraciones Externas

### 1. Backend API (Spring Boot)
- REST API
- JWT Authentication
- CRUD Operations

### 2. Mercado Pago
- SDK de React
- Webhooks
- Payment processing

### 3. CDNs
- Bootstrap CSS
- Font Awesome
- Google Fonts (si aplica)

## 📊 Diagramas

### Diagrama de Flujo de Autenticación

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│  Login  │────▶│ Auth     │────▶│ Backend │────▶│  JWT     │
│  Form   │     │ Service  │     │  API    │     │  Token   │
└─────────┘     └──────────┘     └─────────┘     └──────────┘
                                                        │
                                                        ▼
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│  Protected    │ Auth     │◀────│ Local   │◀────│  Store   │
│  Routes │     │ Context  │     │ Storage │     │  Token   │
└─────────┘     └──────────┘     └─────────┘     └──────────┘
```

### Diagrama de Flujo de Compra

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│ Browse  │────▶│ Add to   │────▶│ Cart    │────▶│ Checkout │
│ Products│     │ Cart     │     │ Context │     │          │
└─────────┘     └──────────┘     └─────────┘     └──────────┘
                                                        │
                                                        ▼
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│ Order   │◀────│ Payment  │◀────│ Mercado │◀────│  Create  │
│ Confirmed    │ Webhook  │     │  Pago   │     │  Order   │
└─────────┘     └──────────┘     └─────────┘     └──────────┘
```

## 🎯 Mejores Prácticas Seguidas

1. **Separation of Concerns**: Cada componente tiene una responsabilidad única
2. **DRY (Don't Repeat Yourself)**: Código reutilizable mediante hooks y servicios
3. **SOLID Principles**: Aplicados en la medida de lo posible
4. **Component Composition**: Componentes pequeños y componibles
5. **Prop Drilling Avoided**: Uso de Context API
6. **Consistent Naming**: Convenciones claras de nomenclatura
7. **Error Handling**: Manejo robusto de errores en toda la aplicación
8. **Accessibility**: Widget de accesibilidad y mejores prácticas ARIA

## 🔮 Escalabilidad

### Consideraciones Futuras

1. **State Management**: Migrar a Redux o Zustand si crece la complejidad
2. **Micro-frontends**: Dividir en aplicaciones más pequeñas
3. **PWA**: Convertir en Progressive Web App
4. **SSR**: Server-Side Rendering con Next.js
5. **GraphQL**: Reemplazar REST API si es necesario
6. **TypeScript**: Migrar para mayor type-safety

## 📚 Referencias

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Mercado Pago Developers](https://www.mercadopago.com.mx/developers)
- [Bootstrap Documentation](https://getbootstrap.com)

