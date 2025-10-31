# Zugarez - Cafetería Web

## 📋 Descripción del Proyecto

Zugarez es una aplicación web completa de un café desarrollada con React que permite la gestión de productos, pedidos, inventario y ventas. El sistema cuenta con dos tipos de usuarios principales: administradores y clientes, cada uno con funcionalidades específicas.

## 🎯 Características Principales

### Para Clientes
- 🛍️ Catálogo de productos con filtros y búsqueda
- 🛒 Carrito de compras interactivo
- 💳 Integración con Mercado Pago para pagos
- 📦 Seguimiento de pedidos en tiempo real
- 👤 Gestión de cuenta de usuario
- 🔔 Notificaciones de pago
- ♿ Widget de accesibilidad (tamaño de fuente, escala de grises)

### Para Administradores
- 📊 Panel de administración completo
- 📦 Gestión de productos (CRUD)
- 🏷️ Gestión de inventario y lotes
- 📋 Gestión de pedidos
- 👥 Administración de usuarios
- 📈 Control de movimientos de inventario
- 📄 Gestión de remisiones

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Librería principal
- **React Router DOM 7.8.0** - Navegación y ruteo
- **Axios 1.12.2** - Cliente HTTP para API REST
- **Bootstrap 5.3.7** - Framework CSS
- **Mercado Pago SDK React 1.0.6** - Integración de pagos
- **SweetAlert2 11.26.3** - Alertas y notificaciones
- **Lucide React** - Iconos modernos
- **Font Awesome 7.0.0** - Iconos adicionales

### Gestión de Estado
- **React Context API** - Estado global de autenticación y carrito
- **Custom Hooks** - Lógica reutilizable

## 📁 Estructura del Proyecto

```
zugarez-FRONT/
├── public/                          # Archivos públicos
│   ├── index.html                   # HTML principal
│   ├── manifest.json               # PWA manifest
│   └── robots.txt                  # SEO robots
│
├── src/
│   ├── App.jsx                     # Componente raíz
│   ├── index.js                    # Punto de entrada
│   │
│   ├── components/                 # Componentes React
│   │   ├── Accesibility/          # Widget de accesibilidad
│   │   ├── admin/                 # Componentes de administración
│   │   ├── auth/                  # Autenticación (Login/Register)
│   │   ├── ClientShopping/        # Tienda del cliente
│   │   ├── CrudMongoApp/          # CRUD de productos
│   │   ├── Inventario/            # Gestión de inventario
│   │   ├── OrdersApp/             # Gestión de pedidos
│   │   ├── PaginaAdmin/           # Panel de administrador
│   │   ├── PaginaPrincipal/       # Página principal/home
│   │   ├── Payment/               # Componentes de pago
│   │   ├── ProtectedRoute.jsx     # Rutas protegidas
│   │   └── ProtectedAdmin.jsx     # Rutas de admin
│   │
│   ├── contexts/                   # Contextos de React
│   │   ├── AuthContext.js         # Contexto de autenticación
│   │   └── CartContext.jsx        # Contexto del carrito
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.js             # Hook de autenticación
│   │   └── usePaymentNotifications.js
│   │
│   ├── services/                   # Servicios API
│   │   ├── api.js                 # Cliente API configurado
│   │   ├── authService.js         # Servicio de autenticación
│   │   └── paymentService.js      # Servicio de pagos
│   │
│   └── utils/                      # Utilidades
│
├── package.json                    # Dependencias
├── JWT_INTEGRATION.md             # Documentación JWT
├── MANUAL_DE_USUARIO.txt          # Manual de usuario
└── README.md                      # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- npm o yarn
- Backend de Spring Boot corriendo

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd zugarez-FRONT
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_BASE=https://better-billi-zugarez-sys-ed7b78de.koyeb.app
# o para desarrollo local:
# REACT_APP_API_BASE=http://localhost:8080
```

4. **Iniciar el servidor de desarrollo**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📜 Scripts Disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm test           # Ejecuta los tests
npm run build      # Compila para producción
npm run eject      # Expone la configuración de Webpack
```

## 🔐 Sistema de Autenticación

### Características JWT
- ✅ Login y registro de usuarios
- ✅ Gestión automática de tokens JWT
- ✅ Verificación de expiración de tokens
- ✅ Logout automático por inactividad (100 minutos)
- ✅ Protección de rutas por rol
- ✅ Interceptor de peticiones HTTP
- ✅ Manejo de cuentas desactivadas

### Roles de Usuario
- **ROLE_USER**: Cliente regular
- **ROLE_ADMIN**: Administrador del sistema

Para más detalles, consultar [JWT_INTEGRATION.md](JWT_INTEGRATION.md)

## 🛒 Sistema de Carrito de Compras

### Funcionalidades
- Agregar/eliminar productos
- Actualizar cantidades
- Persistencia en localStorage
- Validación de stock
- Integración con Mercado Pago
- Notificaciones de pago en tiempo real

## 📦 Módulo de Inventario

### Componentes
- **Inventario Real**: Vista del inventario actual
- **Lotes**: Gestión de lotes de productos
- **Movimientos**: Registro de entradas/salidas
- **Remisiones**: Gestión de documentos de envío

## 💳 Integración de Pagos

### Mercado Pago
- Flujo completo de pago
- Notificaciones de estado
- Manejo de errores
- Confirmación de pedidos
- Limpieza automática del carrito

### Estados de Pago
- ✅ **Aprobado**: Pago exitoso
- ⏳ **Pendiente**: En proceso
- ❌ **Rechazado**: Pago fallido

## 🎨 Accesibilidad

### Widget de Accesibilidad
- Aumento/disminución del tamaño de fuente
- Modo escala de grises
- Botón flotante siempre visible
- Configuración persistente

## 🔌 API y Endpoints

### Autenticación
```
POST /auth/login           # Iniciar sesión
POST /auth/create-user     # Registrar usuario
POST /auth/logout          # Cerrar sesión
```

### Productos
```
GET    /api/products       # Listar productos
POST   /api/products       # Crear producto
PUT    /api/products/{id}  # Actualizar producto
DELETE /api/products/{id}  # Eliminar producto
```

### Pedidos
```
GET    /api/orders         # Listar pedidos
POST   /api/orders         # Crear pedido
PUT    /api/orders/{id}    # Actualizar pedido
```

### Inventario
```
GET    /api/inventory      # Consultar inventario
POST   /api/lotes          # Crear lote
GET    /api/movimientos    # Listar movimientos
```

## 🧪 Testing

El proyecto incluye configuración para tests con Jest y React Testing Library:

```bash
npm test
```

## 🏗️ Build y Despliegue

### Compilar para Producción
```bash
npm run build
```

Esto crea una carpeta `build/` optimizada lista para desplegar.

### Despliegue
- Puede desplegarse en Vercel, Netlify, AWS S3, etc.
- Asegurar que las variables de entorno estén configuradas
- Configurar el backend CORS para aceptar el dominio de producción

## 🔧 Configuración Avanzada

### Proxy de Desarrollo
Si necesitas configurar un proxy para desarrollo, agrega en `package.json`:

```json
"proxy": "http://localhost:8080"
```

### Variables de Entorno
- `REACT_APP_API_BASE`: URL del backend
- Cualquier variable debe comenzar con `REACT_APP_`

## 📱 Responsive Design

El sistema está completamente optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🐛 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, verifica que el backend tenga configurado correctamente:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### Token Expirado
El sistema maneja automáticamente tokens expirados y redirige al login.

### Problemas con Mercado Pago
- Verifica las credenciales en el backend
- Asegura que el webhook esté configurado correctamente
- Revisa la consola del navegador para errores

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a Zugarez.

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo.

## 🔄 Changelog

### Versión 0.1.0 (Actual)
- ✅ Sistema de autenticación JWT completo
- ✅ CRUD de productos
- ✅ Carrito de compras
- ✅ Integración con Mercado Pago
- ✅ Gestión de inventario
- ✅ Panel de administración
- ✅ Widget de accesibilidad
- ✅ Sistema de notificaciones

## 🎓 Desarrollado por

Proyecto de Software III - Universidad 2025-2

# Sistema de Gestión de Nómina - Frontend

Frontend desarrollado con React + TypeScript + Vite + Tailwind CSS

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en modo desarrollo
npm run dev
```

## 📁 Estructura del Proyecto
