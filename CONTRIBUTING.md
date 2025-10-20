# Guía de Contribución - Zugarez Frontend

## 🤝 Bienvenido

¡Gracias por tu interés en contribuir a Zugarez! Este documento proporciona guías y mejores prácticas para contribuir al proyecto.

---

## 📋 Código de Conducta

### Nuestros Estándares

- ✅ Ser respetuoso y constructivo
- ✅ Aceptar críticas constructivas
- ✅ Enfocarse en lo mejor para la comunidad
- ✅ Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable

- ❌ Lenguaje ofensivo o discriminatorio
- ❌ Ataques personales
- ❌ Acoso público o privado
- ❌ Spam o autopromoción excesiva

---

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork

git clone https://github.com/TU_USUARIO/zugarez-FRONT.git
cd zugarez-FRONT
```

### 2. Configurar Upstream

```bash
git remote add upstream https://github.com/REPO_ORIGINAL/zugarez-FRONT.git
git fetch upstream
```

### 3. Crear una Rama

```bash
# Siempre crear una nueva rama desde main actualizado
git checkout main
git pull upstream main
git checkout -b feature/nombre-de-tu-feature
```

### Convención de Nombres de Ramas

- `feature/descripcion` - Nueva funcionalidad
- `fix/descripcion` - Corrección de bug
- `docs/descripcion` - Documentación
- `refactor/descripcion` - Refactorización
- `test/descripcion` - Tests
- `style/descripcion` - Cambios de estilo/formato

**Ejemplos:**
- `feature/add-product-reviews`
- `fix/cart-total-calculation`
- `docs/update-api-reference`

---

## 💻 Desarrollo

### Setup del Entorno

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar desarrollo
npm start
```

### Estándares de Código

#### JavaScript/React

```javascript
// ✅ BIEN: Componente funcional con hooks
import React, { useState, useEffect } from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Lógica de efecto
  }, []);

  const handleClick = () => {
    // Manejador de eventos
  };

  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

```javascript
// ❌ MAL: Variables no descriptivas
const x = data.map(d => d.n);

// ✅ BIEN: Variables descriptivas
const productNames = products.map(product => product.name);
```

#### Nomenclatura

```javascript
// Componentes: PascalCase
const ProductCard = () => {};

// Funciones: camelCase
const calculateTotal = () => {};

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Booleanos: is/has prefix
const [isLoading, setIsLoading] = useState(false);
const hasPermission = user?.roles?.includes('ROLE_ADMIN');
```

#### Estructura de Archivos

```
components/
├── MiComponente/
│   ├── MiComponente.jsx          # Componente principal
│   ├── MiComponente.css          # Estilos
│   ├── MiComponente.test.js      # Tests
│   └── index.js                  # Export
```

### ESLint y Prettier

```bash
# Verificar errores
npm run lint

# Formatear código (si está configurado)
npm run format
```

### Tests

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage
```

**Escribir tests para:**
- Nuevas funcionalidades
- Bugs corregidos
- Componentes críticos
- Lógica de negocio

**Ejemplo de test:**

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 1000
  };

  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('calls addToCart when button is clicked', () => {
    const handleAdd = jest.fn();
    render(<ProductCard product={mockProduct} onAdd={handleAdd} />);
    
    fireEvent.click(screen.getByText('Agregar'));
    expect(handleAdd).toHaveBeenCalledWith(mockProduct);
  });
});
```

---

## 📝 Commits

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensajes consistentes.

**Formato:**
```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos:**
- `feat` - Nueva funcionalidad
- `fix` - Corrección de bug
- `docs` - Cambios en documentación
- `style` - Formato, punto y coma faltante, etc.
- `refactor` - Refactorización de código
- `test` - Agregar tests
- `chore` - Mantenimiento, dependencias, etc.
- `perf` - Mejoras de performance

**Ejemplos:**

```bash
# Feature
git commit -m "feat: add product review system"
git commit -m "feat(cart): add coupon code validation"

# Bug fix
git commit -m "fix: resolve cart total calculation error"
git commit -m "fix(auth): handle expired token correctly"

# Documentación
git commit -m "docs: update API reference with new endpoints"

# Refactor
git commit -m "refactor: simplify product filtering logic"

# Test
git commit -m "test: add unit tests for cart context"

# Style
git commit -m "style: format code with prettier"

# Breaking change
git commit -m "feat!: change API response structure

BREAKING CHANGE: products endpoint now returns paginated data"
```

### Commits Atómicos

Cada commit debe:
- ✅ Hacer UNA cosa específica
- ✅ Ser independiente y funcional
- ✅ Tener un mensaje descriptivo
- ❌ No mezclar múltiples cambios no relacionados

---

## 🔄 Pull Requests

### Antes de Crear el PR

```bash
# 1. Asegurar que está actualizado con main
git checkout main
git pull upstream main
git checkout tu-rama
git rebase main

# 2. Ejecutar tests
npm test

# 3. Verificar build
npm run build

# 4. Push a tu fork
git push origin tu-rama
```

### Plantilla de PR

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha probado?
Describe cómo probaste los cambios.

## Checklist
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código donde es necesario
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente
- [ ] He actualizado el CHANGELOG (si aplica)

## Screenshots (si aplica)
Agrega screenshots de cambios visuales.

## Notas adicionales
Cualquier información adicional relevante.
```

### Revisión de Código

#### Para el Autor

- Revisa tu propio código primero
- Responde a comentarios constructivamente
- Haz cambios solicitados prontamente
- Marca conversaciones como resueltas

#### Para el Revisor

- Sé constructivo y respetuoso
- Explica el "por qué" de tus sugerencias
- Aprueba cuando esté listo
- Distingue entre "debe cambiar" y "podría mejorar"

**Comentarios constructivos:**

```
❌ "Este código está mal"
✅ "Considera usar useMemo aquí para mejorar performance"

❌ "No funciona"
✅ "Probé este flujo y encontré que X falla cuando Y. ¿Podrías verificar?"
```

---

## 🐛 Reportar Bugs

### Plantilla de Issue para Bugs

```markdown
## Descripción del Bug
Descripción clara y concisa del bug.

## Para Reproducir
Pasos para reproducir:
1. Ir a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

## Comportamiento Esperado
Qué esperabas que sucediera.

## Comportamiento Actual
Qué sucede actualmente.

## Screenshots
Si aplica, agrega screenshots.

## Entorno
- OS: [e.g. Windows 10]
- Navegador: [e.g. Chrome 120]
- Versión del proyecto: [e.g. v0.1.0]

## Información Adicional
Cualquier otro contexto sobre el problema.

## Posible Solución
Si tienes ideas de cómo solucionarlo.
```

---

## ✨ Solicitar Features

### Plantilla de Issue para Features

```markdown
## ¿El feature está relacionado a un problema?
Descripción clara del problema. Ej: "Siempre me frustra cuando..."

## Describe la solución que te gustaría
Descripción clara de lo que quieres que suceda.

## Describe alternativas consideradas
Cualquier solución o feature alternativa considerada.

## Contexto Adicional
Cualquier otro contexto, screenshots, o ejemplos.

## Beneficio
¿Cómo beneficiaría esto a los usuarios?

## Prioridad
- [ ] Alta - Bloqueante o muy importante
- [ ] Media - Mejora significativa
- [ ] Baja - Nice to have
```

---

## 📚 Documentación

### Qué Documentar

- Nuevas funcionalidades
- Cambios en APIs
- Configuraciones complejas
- Decisiones de arquitectura importantes

### Dónde Documentar

- **README.md** - Overview del proyecto
- **ARCHITECTURE.md** - Decisiones de arquitectura
- **API_REFERENCE.md** - Endpoints y servicios
- **COMPONENTS.md** - Componentes y su uso
- **Comentarios en código** - Lógica compleja

### Estilo de Documentación

```javascript
/**
 * Calcula el total del carrito aplicando descuentos.
 * 
 * @param {Array} items - Array de items en el carrito
 * @param {Object} coupon - Objeto de cupón con tipo y valor
 * @returns {number} Total calculado después de descuentos
 * 
 * @example
 * const total = calculateCartTotal(items, { type: 'percentage', value: 10 });
 */
const calculateCartTotal = (items, coupon) => {
  // Implementación
};
```

---

## 🏆 Reconocimiento

Los contribuidores serán:
- Listados en el README
- Mencionados en release notes
- Agradecidos públicamente

---

## 📞 ¿Necesitas Ayuda?

- **Discusiones:** [GitHub Discussions]
- **Issues:** [GitHub Issues]
- **Email:** [tu-email@example.com]
- **Chat:** [Discord/Slack si existe]

---

## 🎓 Recursos para Nuevos Contribuidores

### Aprender Git
- [GitHub Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)

### Aprender React
- [React Docs](https://react.dev)
- [React Tutorial](https://react.dev/learn)

### Testing
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)

---

## 📜 Licencia

Al contribuir a Zugarez, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto.

---

¡Gracias por contribuir a Zugarez! 🎉

