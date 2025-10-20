# Guía de Desarrollo - Zugarez Frontend

## 🚀 Primeros Pasos

Esta guía está diseñada para desarrolladores que trabajarán en el proyecto Zugarez.

## 📋 Configuración del Entorno de Desarrollo

### 1. Requisitos Previos

```bash
# Verificar versiones
node --version    # v14+ requerido
npm --version     # v6+ requerido
git --version     # Cualquier versión reciente
```

### 2. Clonar y Configurar

```bash
# Clonar repositorio
git clone <repository-url>
cd zugarez-FRONT

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

### 3. Archivo .env

Crear `.env` en la raíz:

```env
# API Backend
REACT_APP_API_BASE=https://better-billi-zugarez-sys-ed7b78de.koyeb.app

# Para desarrollo local
# REACT_APP_API_BASE=http://localhost:8080

# Mercado Pago (si aplica)
REACT_APP_MP_PUBLIC_KEY=tu_public_key_aqui
```

### 4. Ejecutar el Proyecto

```bash
# Modo desarrollo
npm start
# Abre http://localhost:3000

# Ejecutar tests
npm test

# Build de producción
npm run build
```

## 🏗️ Estructura de Carpetas Detallada

```
src/
├── components/              # Componentes React
│   ├── auth/               # Login, Register, Verificación
│   ├── ClientShopping/     # Tienda del cliente
│   ├── PaginaAdmin/        # Panel de administración
│   ├── OrdersApp/          # Gestión de pedidos
│   ├── Inventario/         # Módulo de inventario
│   ├── Payment/            # Flujos de pago
│   ├── PaginaPrincipal/    # Landing page
│   └── Accesibility/       # Widget de accesibilidad
│
├── contexts/               # React Contexts
│   ├── AuthContext.js      # Estado de autenticación
│   └── CartContext.jsx     # Estado del carrito
│
├── hooks/                  # Custom Hooks
│   ├── useAuth.js          # Hook de autenticación
│   └── usePaymentNotifications.js
│
├── services/               # Servicios y API
│   ├── api.js              # Cliente Axios configurado
│   ├── authService.js      # Servicio de auth
│   └── paymentService.js   # Servicio de pagos
│
├── utils/                  # Funciones utilitarias
│
├── App.jsx                 # Componente raíz
├── index.js                # Entry point
└── index.css               # Estilos globales
```

## 🎯 Flujos de Trabajo Comunes

### Crear un Nuevo Componente

```bash
# 1. Crear carpeta y archivos
src/components/MiComponente/
├── MiComponente.jsx
└── MiComponente.css
```

```jsx
// MiComponente.jsx
import React, { useState, useEffect } from 'react';
import './MiComponente.css';

const MiComponente = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Lógica de montaje
  }, []);

  return (
    <div className="mi-componente">
      {/* JSX aquí */}
    </div>
  );
};

export default MiComponente;
```

### Agregar una Nueva Ruta

```jsx
// En App.jsx o router configuration
import MiComponente from './components/MiComponente/MiComponente';

<Route path="/mi-ruta" element={<MiComponente />} />

// Para ruta protegida
<Route 
  path="/mi-ruta-protegida" 
  element={
    <ProtectedRoute>
      <MiComponente />
    </ProtectedRoute>
  } 
/>
```

### Hacer Llamadas a la API

```jsx
import api from '../services/api';
import { useEffect, useState } from 'react';

const MiComponente = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/endpoint');
        setData(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### Usar Context API

```jsx
// 1. Importar el context
import { useAuth } from '../../contexts/AuthContext';

// 2. Usar en el componente
const MiComponente = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Hola, {user.username}!</p>
      ) : (
        <button onClick={() => login(credentials)}>Login</button>
      )}
    </div>
  );
};
```

### Agregar al Carrito

```jsx
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Agregar al Carrito
    </button>
  );
};
```

## 🎨 Guía de Estilos

### Convenciones CSS

```css
/* 1. Clase base del componente */
.mi-componente {
  display: flex;
  flex-direction: column;
}

/* 2. Elementos hijos con BEM */
.mi-componente__titulo {
  font-size: 24px;
  font-weight: bold;
}

.mi-componente__contenido {
  padding: 20px;
}

/* 3. Modificadores */
.mi-componente--destacado {
  background-color: #ffeb3b;
}

/* 4. Estados */
.mi-componente.is-loading {
  opacity: 0.5;
  pointer-events: none;
}

/* 5. Responsive */
@media (max-width: 768px) {
  .mi-componente {
    flex-direction: column;
  }
}
```

### Usar Bootstrap

```jsx
// Clases de Bootstrap ya están disponibles
<div className="container">
  <div className="row">
    <div className="col-md-6">
      <button className="btn btn-primary">Click</button>
    </div>
  </div>
</div>
```

### Variables CSS Globales

```css
/* Definir en index.css */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --font-family: 'Roboto', sans-serif;
}

/* Usar en componentes */
.mi-componente {
  color: var(--primary-color);
  font-family: var(--font-family);
}
```

## 🔧 Patrones de Código

### State Management

```jsx
// Estado simple
const [count, setCount] = useState(0);

// Estado complejo - objeto
const [form, setForm] = useState({
  name: '',
  email: '',
  password: ''
});

// Actualizar campo específico
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

// useReducer para estado complejo
const [state, dispatch] = useReducer(reducer, initialState);
```

### Manejo de Formularios

```jsx
const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nombre requerido';
    if (!formData.email) newErrors.email = 'Email requerido';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post('/api/endpoint', formData);
      // Éxito
    } catch (error) {
      // Error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({
          ...formData,
          name: e.target.value
        })}
      />
      {errors.name && <span>{errors.name}</span>}
      <button type="submit">Enviar</button>
    </form>
  );
};
```

### Custom Hooks

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Uso
const MiComponente = () => {
  const { data, loading, error } = useFetch('/api/products');
  
  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
};
```

## 🧪 Testing

### Test de Componente Básico

```jsx
// MiComponente.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import MiComponente from './MiComponente';

describe('MiComponente', () => {
  it('renders correctly', () => {
    render(<MiComponente />);
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });

  it('handles click event', () => {
    const handleClick = jest.fn();
    render(<MiComponente onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('fetches data on mount', async () => {
    render(<MiComponente />);
    
    const data = await screen.findByText('Loaded data');
    expect(data).toBeInTheDocument();
  });
});
```

### Mock de API

```jsx
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Product 1' }
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 🐛 Debugging

### React DevTools

```jsx
// Instalar extensión de navegador
// Chrome: React Developer Tools

// Inspeccionar componentes
// Ver props y state
// Profiler para performance
```

### Console Logging Efectivo

```jsx
// Desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Logs con estilo
console.log('%c Mi mensaje', 'color: blue; font-size: 20px');

// Tabla para arrays
console.table(arrayData);

// Tiempo de ejecución
console.time('fetch');
await fetchData();
console.timeEnd('fetch');
```

### Error Boundaries

```jsx
// ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal.</h1>;
    }
    return this.props.children;
  }
}

// Uso
<ErrorBoundary>
  <MiComponente />
</ErrorBoundary>
```

## 📦 Gestión de Dependencias

### Instalar Nuevas Librerías

```bash
# Dependencia de producción
npm install nombre-libreria

# Dependencia de desarrollo
npm install --save-dev nombre-libreria

# Versión específica
npm install nombre-libreria@1.2.3
```

### Actualizar Dependencias

```bash
# Ver outdated
npm outdated

# Actualizar a latest
npm update

# Actualizar major versions
npm install nombre-libreria@latest
```

## 🚀 Deployment

### Build de Producción

```bash
# Crear build optimizado
npm run build

# La carpeta build/ contiene los archivos estáticos
# Listos para desplegar
```

### Variables de Entorno en Producción

```bash
# En Vercel/Netlify, configurar:
REACT_APP_API_BASE=https://api.produccion.com
```

### Deploy en Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Deploy en Netlify

```bash
# Instalar CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy a producción
netlify deploy --prod
```

## 🔒 Seguridad

### Mejores Prácticas

```jsx
// 1. No almacenar datos sensibles en código
// ❌ MAL
const API_KEY = 'mi-api-key-secreta';

// ✅ BIEN
const API_KEY = process.env.REACT_APP_API_KEY;

// 2. Sanitizar inputs
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyInput);

// 3. Validar en frontend Y backend
const isValid = validateEmail(email);

// 4. Usar HTTPS siempre en producción
```

## 📚 Recursos Útiles

### Documentación Oficial
- [React](https://react.dev)
- [React Router](https://reactrouter.com)
- [Bootstrap](https://getbootstrap.com)
- [Axios](https://axios-http.com)

### Tools Recomendados
- VS Code + extensiones (ES7 React snippets, Prettier)
- React DevTools
- Redux DevTools (si se implementa)
- Postman para testing de API

### Snippets Útiles

```jsx
// Snippet de componente funcional (rafce)
import React from 'react'

const ComponentName = () => {
  return (
    <div>ComponentName</div>
  )
}

export default ComponentName

// Snippet de useEffect (uef)
useEffect(() => {
  
}, [])

// Snippet de useState (us)
const [state, setState] = useState(initialState)
```

## 🎓 Convenciones del Equipo

1. **Commits**: Usar conventional commits
   - `feat: agregar nueva funcionalidad`
   - `fix: corregir bug`
   - `docs: actualizar documentación`
   - `style: cambios de formato`
   - `refactor: refactorización de código`

2. **Branches**: 
   - `main`: producción
   - `develop`: desarrollo
   - `feature/nombre-feature`: nuevas características
   - `fix/nombre-bug`: correcciones

3. **Pull Requests**: 
   - Descripción clara
   - Screenshots si es UI
   - Tests pasando
   - Review de al menos 1 persona

4. **Code Review Checklist**:
   - ✅ Código limpio y legible
   - ✅ Sin console.logs innecesarios
   - ✅ Responsive design
   - ✅ Manejo de errores
   - ✅ Comentarios donde sea necesario
   - ✅ Tests actualizados

## 🔄 Workflow Git

```bash
# 1. Crear nueva rama
git checkout -b feature/mi-feature

# 2. Hacer cambios y commits
git add .
git commit -m "feat: agregar mi feature"

# 3. Push a remoto
git push origin feature/mi-feature

# 4. Crear Pull Request en GitHub

# 5. Después del merge, actualizar main
git checkout main
git pull origin main
```

---

¡Happy Coding! 🚀

