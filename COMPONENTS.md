# Guía de Componentes - Zugarez Frontend

## 📋 Índice de Componentes

Esta guía documenta todos los componentes principales del sistema Zugarez, su propósito, props, y uso.

---

## 🔐 Componentes de Autenticación

### AuthPage
**Ubicación:** `src/components/auth/AuthPage.jsx`

Componente principal que maneja login y registro con diseño glassmorphism.

**Características:**
- Alternancia entre login y registro
- Validación de formularios
- Integración con authService
- Manejo de errores visuales
- Redirección post-autenticación

**Estado:**
```javascript
const [isLogin, setIsLogin] = useState(true);
const [formData, setFormData] = useState({...});
const [error, setError] = useState('');
```

**Uso:**
```jsx
<Route path="/login" element={<AuthPage />} />
```

---

### ProtectedRoute
**Ubicación:** `src/components/ProtectedRoute.jsx`

HOC que protege rutas requiriendo autenticación.

**Props:**
- `children`: React.ReactNode - Componentes a proteger

**Comportamiento:**
- Verifica si el usuario está autenticado
- Redirige a `/login` si no está autenticado
- Renderiza children si está autenticado

**Uso:**
```jsx
<ProtectedRoute>
  <ClientShopping />
</ProtectedRoute>
```

---

### ProtectedAdmin
**Ubicación:** `src/components/ProtectedAdmin.jsx`

HOC que protege rutas de administrador.

**Props:**
- `children`: React.ReactNode

**Comportamiento:**
- Verifica autenticación Y rol de admin
- Redirige si no tiene permisos
- Muestra mensaje de acceso denegado

**Uso:**
```jsx
<ProtectedAdmin>
  <AdminPage />
</ProtectedAdmin>
```

---

## 🛍️ Componentes de Cliente

### ClientShopping
**Ubicación:** `src/components/ClientShopping/ClientShopping.jsx`

Página principal de compras del cliente.

**Características:**
- Catálogo de productos con filtros
- Carrito de compras toggle
- Integración con CartContext
- Notificaciones de pago
- Layout responsive

**Estado:**
```javascript
const [showCart, setShowCart] = useState(false);
```

**Estructura:**
```jsx
<ClientShopping>
  <TopBar />
  <ProductCatalog />
  {showCart && <ShoppingCart />}
  <Footer />
</ClientShopping>
```

---

### ProductCatalog
**Ubicación:** `src/components/ClientShopping/ProductCatalog.jsx`

Catálogo de productos con filtrado y búsqueda.

**Características:**
- Grid responsive de productos
- Filtrado por categoría y precio
- Búsqueda por nombre
- Carga de productos desde API
- Paginación

**Estado:**
```javascript
const [products, setProducts] = useState([]);
const [filters, setFilters] = useState({...});
const [loading, setLoading] = useState(true);
```

---

### ProductCard
**Ubicación:** `src/components/ClientShopping/ProductCard.jsx`

Card individual de producto.

**Props:**
- `product`: Object - Datos del producto
  - `id`: string
  - `name`: string
  - `price`: number
  - `image`: string
  - `description`: string
  - `stock`: number

**Características:**
- Botón "Agregar al carrito"
- Indicador de stock
- Formato de precio COP
- Imagen responsive
- Animaciones hover

**Uso:**
```jsx
<ProductCard product={productData} />
```

---

### ShoppingCart
**Ubicación:** `src/components/ClientShopping/ShoppingCart.jsx`

Carrito de compras lateral.

**Características:**
- Lista de items en carrito
- Actualizar cantidades
- Eliminar items
- Total calculado
- Botón de checkout
- Integración con Mercado Pago

**Funciones:**
- `handleCheckout()`: Inicia proceso de pago
- `updateQuantity(id, qty)`: Actualiza cantidad
- `removeItem(id)`: Elimina producto

---

### FilterPanel
**Ubicación:** `src/components/ClientShopping/FilterPanel.jsx`

Panel de filtros para productos.

**Props:**
- `filters`: Object - Filtros actuales
- `onFilterChange`: Function - Callback de cambio

**Filtros:**
- Categorías
- Rango de precio
- Disponibilidad
- Ordenamiento

---

## 📦 Componentes de Pedidos

### OrdersApp
**Ubicación:** `src/components/OrdersApp/OrdersApp.jsx`

Aplicación de gestión de pedidos.

**Características:**
- Vista diferenciada admin/cliente
- Lista de pedidos
- Filtros de estado
- Detalles de pedido

---

### OrdersList
**Ubicación:** `src/components/OrdersApp/OrdersList.jsx`

Lista de pedidos con filtrado.

**Características:**
- Fetch de pedidos desde API
- Filtrado por estado
- Ordenamiento por fecha
- Paginación

**Estado:**
```javascript
const [orders, setOrders] = useState([]);
const [filter, setFilter] = useState('all');
const [loading, setLoading] = useState(true);
```

---

### OrderCard
**Ubicación:** `src/components/OrdersApp/OrderCard.jsx`

Card de pedido individual.

**Props:**
- `order`: Object
  - `id`: string
  - `items`: Array
  - `total`: number
  - `status`: string
  - `createdAt`: Date

**Características:**
- Información del pedido
- Estado visual (badge)
- Lista de productos
- Total formateado
- Acciones según rol

---

### OrdersFilterPanel
**Ubicación:** `src/components/OrdersApp/OrdersFilterPanel.jsx`

Panel de filtros para pedidos.

**Props:**
- `currentFilter`: string
- `onFilterChange`: Function

**Filtros:**
- Todos
- Pendientes
- Aprobados
- Cancelados
- Por fecha

---

## 👨‍💼 Componentes de Administración

### AdminPage
**Ubicación:** `src/components/PaginaAdmin/AdminPage.jsx`

Página principal del panel de administración.

**Estructura:**
```jsx
<AdminPage>
  <Header />
  <AdminLayout>
    <SideBar />
    <MainContent />
  </AdminLayout>
  <Footer />
</AdminPage>
```

---

### AdminLayout
**Ubicación:** `src/components/PaginaAdmin/AdminLayout/AdminLayout.jsx`

Layout principal del admin con sidebar.

**Características:**
- Sidebar navegable
- Área de contenido dinámica
- Responsive (colapsa en móvil)
- Rutas internas

---

### CrudMongoApp
**Ubicación:** `src/components/CrudMongoApp/CrudMongoApp.jsx`

CRUD completo de productos.

**Características:**
- Crear productos
- Listar productos
- Editar productos
- Eliminar productos
- Formularios validados
- Subida de imágenes

**Componentes hijos:**
- `ProductList`: Lista de productos
- `ProductView`: Vista detallada
- `Formulario`: Form de crear/editar

---

### DeactivatedUsers
**Ubicación:** `src/components/admin/DeactivatedUsers.jsx`

Gestión de usuarios desactivados.

**Características:**
- Lista de usuarios desactivados
- Reactivar usuarios
- Ver historial
- Filtros y búsqueda

---

## 📊 Componentes de Inventario

### InventoryModule
**Ubicación:** `src/components/Inventario/InventoryModule.jsx`

Módulo principal de inventario con tabs.

**Tabs:**
- Inventario: Vista general
- Lotes: Gestión de lotes
- Movimientos: Registro de movimientos
- Remisiones: Documentos de envío

**Estado:**
```javascript
const [activeTab, setActiveTab] = useState('inventario');
```

---

### LotesModule
**Ubicación:** `src/components/Inventario/LotesModule.jsx`

Gestión de lotes de productos.

**Características:**
- Crear lotes
- Listar lotes
- Editar lotes
- Ver detalles
- Filtrado por producto

**Componentes:**
- `LoteForm`: Formulario de lote
- `LoteList`: Lista de lotes

---

### MovimientosModule
**Ubicación:** `src/components/Inventario/MovimientosModule.jsx`

Registro de movimientos de inventario.

**Tipos de movimientos:**
- Entrada
- Salida
- Ajuste
- Transferencia

**Componentes:**
- `MovimientoForm`: Crear movimiento
- Lista de movimientos

---

### RemisionesModule
**Ubicación:** `src/components/Inventario/RemisionesModule.jsx`

Gestión de remisiones.

**Características:**
- Crear remisiones
- Listar remisiones
- Imprimir PDF
- Asociar a pedidos

---

## 💳 Componentes de Pago

### PaymentSuccess
**Ubicación:** `src/components/Payment/PaymentSuccess.jsx`

Página de pago exitoso.

**Características:**
- Mensaje de confirmación
- Detalles del pedido
- Número de seguimiento
- Botón para ver pedidos

---

### PaymentPending
**Ubicación:** `src/components/Payment/PaymentPending.jsx`

Página de pago pendiente.

**Características:**
- Mensaje informativo
- Estado del pago
- Opciones de seguimiento

---

### PaymentError
**Ubicación:** `src/components/Payment/PaymentError.jsx`

Página de error de pago.

**Características:**
- Mensaje de error
- Razón del rechazo
- Opciones para reintentar

---

### PaymentNotification
**Ubicación:** `src/components/Payment/PaymentNotification.jsx`

Componente de notificaciones de pago.

**Características:**
- Toast notifications
- Updates en tiempo real
- Integración con webhooks

---

## 🏠 Componentes de Página Principal

### PaginaPrincipal
**Ubicación:** `src/components/PaginaPrincipal/PaginaPrincipal.jsx`

Landing page principal.

**Secciones:**
- TopBar: Barra superior
- Carousel: Slider de imágenes
- InfoSection: Información destacada
- PreMenuContainer: Menú de categorías
- ContactSocialMedia: Redes sociales
- Footer: Pie de página

---

### TopBar
**Ubicación:** `src/components/PaginaPrincipal/TopBar/TopBar.jsx`

Barra superior con navegación.

**Características:**
- Logo
- Menú de navegación
- Botones de auth/logout
- Carrito (si está autenticado)
- Responsive menu

---

### Carousel
**Ubicación:** `src/components/PaginaPrincipal/Carousel/Carousel.jsx`

Carrusel de imágenes promocionales.

**Props:**
- `images`: Array - URLs de imágenes
- `autoPlay`: boolean - Auto-deslizamiento
- `interval`: number - Tiempo entre slides

---

### InfoSection
**Ubicación:** `src/components/PaginaPrincipal/InfoSection/InfoSection.jsx`

Sección informativa con cards.

**Características:**
- Grid de información
- Iconos
- Descripción breve
- Llamadas a acción

---

### Footer
**Ubicación:** `src/components/PaginaPrincipal/Footer/Footer.jsx`

Pie de página con información.

**Contenido:**
- Links útiles
- Información de contacto
- Redes sociales
- Copyright

---

## ♿ Componentes de Accesibilidad

### AccessibilityWidget
**Ubicación:** `src/components/Accesibility/AccessibilityWidget.jsx`

Widget flotante de accesibilidad.

**Características:**
- Botón flotante con icono de ojo
- Aumento de fuente (+10% hasta 200%)
- Disminución de fuente (-10% hasta 50%)
- Toggle de escala de grises
- Reset a valores por defecto
- Persistencia en localStorage

**Estado:**
```javascript
const [isOpen, setIsOpen] = useState(false);
const [fontSize, setFontSize] = useState(100);
const [isGrayscale, setIsGrayscale] = useState(false);
```

**Funciones:**
- `increaseFont()`: Aumenta el tamaño
- `decreaseFont()`: Disminuye el tamaño
- `toggleGrayscale()`: Activa/desactiva escala de grises
- `resetAll()`: Restaura valores por defecto

**Uso:**
```jsx
// Se incluye globalmente en App.jsx
<AccessibilityWidget />
```

---

## 🎣 Custom Hooks

### useAuth
**Ubicación:** `src/hooks/useAuth.js`

Hook personalizado para autenticación.

**Retorna:**
```javascript
{
  user: Object | null,
  isAuthenticated: boolean,
  login: Function,
  logout: Function,
  loading: boolean
}
```

**Uso:**
```jsx
const { user, login, logout } = useAuth();
```

---

### usePaymentNotifications
**Ubicación:** `src/hooks/usePaymentNotifications.js`

Hook para manejar notificaciones de pago.

**Características:**
- Escucha eventos de pago
- Muestra notificaciones
- Actualiza estado del carrito
- Redirige según resultado

**Uso:**
```jsx
usePaymentNotifications(); // En componente raíz
```

---

## 🔌 Servicios

### authService
**Ubicación:** `src/services/authService.js`

Servicio de autenticación.

**Métodos:**
```javascript
authService.login(credentials)
authService.register(userData)
authService.logout()
authService.getUser()
authService.getToken()
authService.isTokenValid()
```

---

### api
**Ubicación:** `src/services/api.js`

Cliente API configurado con Axios.

**Características:**
- Base URL configurada
- Interceptor de request (token)
- Interceptor de response (errores)
- Manejo de 401/403

**Uso:**
```javascript
import api from '../services/api';

const response = await api.get('/products');
const data = await api.post('/orders', orderData);
```

---

### paymentService
**Ubicación:** `src/services/paymentService.js`

Servicio de integración con Mercado Pago.

**Métodos:**
```javascript
paymentService.createPreference(orderData)
paymentService.getPaymentStatus(paymentId)
paymentService.processWebhook(webhookData)
```

---

## 📱 Componentes Responsive

Todos los componentes implementan diseño responsive:

**Breakpoints:**
```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

**Clases Bootstrap utilizadas:**
- `container`, `container-fluid`
- `row`, `col-*`
- `d-none`, `d-md-block`
- `flex-column`, `flex-md-row`

---

## 🎨 Estilos

Cada componente tiene su archivo CSS correspondiente:
- Uso de CSS Modules (algunos)
- BEM naming convention
- Variables CSS para colores
- Animaciones con transitions

**Convención de nombres:**
```css
.component-name { }
.component-name__element { }
.component-name--modifier { }
```

---

## ⚡ Optimización de Rendimiento

**Técnicas aplicadas:**
- `React.memo` en componentes puros
- `useMemo` para cálculos costosos
- `useCallback` para funciones en deps
- Lazy loading de rutas
- Debouncing en búsquedas
- Throttling en scroll events

**Ejemplo:**
```javascript
const MemoizedProduct = React.memo(ProductCard);

const filteredProducts = useMemo(() => {
  return products.filter(p => p.name.includes(search));
}, [products, search]);
```

---

## 🧪 Testing de Componentes

**Estructura de tests:**
```javascript
describe('ComponentName', () => {
  it('should render correctly', () => { });
  it('should handle user interaction', () => { });
  it('should call API on mount', () => { });
});
```

**Herramientas:**
- Jest
- React Testing Library
- Mock de servicios API

---

## 📚 Convenciones de Código

1. **Nombres de componentes:** PascalCase
2. **Nombres de archivos:** PascalCase.jsx
3. **Nombres de funciones:** camelCase
4. **Nombres de constantes:** UPPER_SNAKE_CASE
5. **Props:** camelCase
6. **Event handlers:** handle + Action (handleClick)
7. **Boolean props:** is/has prefix (isLoading, hasError)

---

## 🔍 Debugging

**Tools útiles:**
- React DevTools
- Redux DevTools (si se implementa)
- Network tab para API calls
- Console.log estratégicos
- React Error Boundaries

---

Este documento cubre los componentes principales. Para componentes específicos adicionales, revisar el código fuente directamente.

