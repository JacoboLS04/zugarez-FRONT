# Sistema de Autenticación JWT

## Descripción
Este frontend incluye un sistema completo de autenticación JWT que se integra con tu backend de Spring Boot. El sistema maneja automáticamente tokens, sesiones, logout y protección de rutas.

## Características Implementadas

### 🔐 Autenticación Completa
- **Login y Registro** con formularios modernos y glassmorphism
- **Gestión automática de tokens JWT**
- **Verificación de expiración de tokens**
- **Renovación automática de tokens** (si tu backend lo soporta)
- **Logout seguro** con limpieza de datos

### 🛡️ Protección de Rutas
- **Rutas protegidas** que requieren autenticación
- **Redirección automática** al login si no está autenticado
- **Verificación continua** del estado de autenticación

### 📡 Peticiones Autenticadas
- **Header Authorization automático** en todas las peticiones
- **Manejo de errores 401/403** con logout automático
- **Interceptor de peticiones** para incluir tokens
- **Fallback a datos locales** si el backend no está disponible

### 💾 Gestión de Estado
- **Contexto global de autenticación** con React Context
- **Persistencia en localStorage** de tokens y datos de usuario
- **Estado reactivo** que se actualiza automáticamente
- **Eventos personalizados** para cambios de autenticación

## Estructura de Archivos

```
src/
├── contexts/
│   └── AuthContext.js          # Contexto global de autenticación
├── services/
│   └── authService.js          # Servicio de autenticación y JWT
├── hooks/
│   └── useAuth.js              # Hooks personalizados para peticiones
├── components/
│   ├── auth/
│   │   ├── AuthPage.jsx        # Componente de login/registro
│   │   └── AuthPage.css        # Estilos glassmorphism
│   ├── Header.jsx              # Header con info de usuario y logout
│   ├── Header.css              # Estilos del header
│   └── ProtectedRoute.jsx      # Componente de ruta protegida
└── App.js                      # App principal con contexto
```

## Configuración del Backend

El frontend está configurado para trabajar con estos endpoints en tu backend:

### Endpoints de Autenticación
- `POST /auth/login` - Login de usuario
- `POST /auth/create-user` - Registro de usuario
- `POST /auth/logout` - Logout (opcional)
- `POST /auth/refresh-token` - Renovar token (opcional)

### Endpoints de Productos (ejemplo)
- `GET /api/products` - Listar productos (requiere auth)
- `POST /api/products` - Crear producto (requiere auth)
- `PUT /api/products/{id}` - Actualizar producto (requiere auth)
- `DELETE /api/products/{id}` - Eliminar producto (requiere auth)

## Uso en Componentes

### 1. Usar el contexto de autenticación
```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Hola, {user.username}!</p>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
};
```

### 2. Hacer peticiones autenticadas
```jsx
import { useAuthenticatedRequest } from '../hooks/useAuth';

const MyComponent = () => {
  const { makeRequest } = useAuthenticatedRequest();
  
  const fetchData = async () => {
    try {
      const data = await makeRequest('/api/my-endpoint');
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return <button onClick={fetchData}>Cargar datos</button>;
};
```

### 3. Proteger rutas
```jsx
import ProtectedRoute from '../components/ProtectedRoute';

const App = () => (
  <ProtectedRoute>
    <MyPrivateComponent />
  </ProtectedRoute>
);
```

## Configuración Personalizable

### URLs del Backend
Puedes cambiar las URLs en `authService.js`:
```javascript
const API_URL = 'http://localhost:8080/auth';
const PRODUCTS_URL = 'http://localhost:8080/api/products';
```

### Tiempo de Expiración de Token
El sistema verifica automáticamente si el token está próximo a expirar (10 minutos) y intenta renovarlo.

### Datos de Usuario
El sistema guarda automáticamente los datos del usuario que retorna tu backend en el login.

## Seguridad

### Almacenamiento Seguro
- Los tokens se almacenan en `localStorage`
- Se limpian automáticamente al logout o expiración
- Verificación continua de validez

### Validación de Tokens
- Decodificación automática del payload JWT
- Verificación de fecha de expiración
- Margen de seguridad antes de la expiración

### Manejo de Errores
- Logout automático en errores 401/403
- Limpieza de datos en tokens inválidos
- Fallback a datos locales si es necesario

## Testing

Para probar el sistema:

1. **Sin Backend**: El sistema funciona con datos de ejemplo
2. **Con Backend**: Configura las URLs correctas en `authService.js`
3. **Token Válido**: El sistema mantiene la sesión automáticamente
4. **Token Expirado**: Redirección automática al login

## Personalización

### Estilos
- Los componentes usan CSS moderno con glassmorphism
- Fácilmente personalizable en los archivos `.css`
- Responsive design incluido

### Funcionalidad
- Hooks reutilizables para peticiones autenticadas
- Contexto global fácil de extender
- Componentes modulares y reutilizables

## Integración con tu Backend Spring Boot

El sistema está diseñado para funcionar perfectamente con tu implementación de JWT en Spring Boot. Solo necesitas:

1. **Asegurar que el backend retorne el token** en el formato esperado
2. **Configurar CORS** para permitir peticiones desde el frontend
3. **Implementar los endpoints** de autenticación mencionados
4. **Opcional**: Endpoint de refresh token para renovación automática

¡El frontend está listo para trabajar con tu sistema JWT! 🚀
