# Guía de Despliegue - Zugarez Frontend

## 🚀 Guía Completa de Deployment

Esta guía cubre el proceso de despliegue del frontend de Zugarez en diferentes plataformas.

---

## 📋 Pre-requisitos para Deployment

### Checklist Pre-Deployment

- [ ] Todos los tests pasan
- [ ] No hay errores de ESLint
- [ ] Variables de entorno configuradas
- [ ] Build de producción funciona localmente
- [ ] Backend API accesible desde el dominio de producción
- [ ] CORS configurado en el backend
- [ ] Mercado Pago configurado para producción
- [ ] Certificados SSL configurados

### Verificación Local

```bash
# 1. Ejecutar tests
npm test

# 2. Crear build de producción
npm run build

# 3. Verificar build localmente
npx serve -s build

# 4. Abrir http://localhost:3000 y probar
```

---

## 🌐 Opción 1: Vercel (Recomendado)

### Ventajas
- ✅ Deployment automático desde Git
- ✅ Preview deployments para PRs
- ✅ SSL automático
- ✅ CDN global
- ✅ Serverless functions support

### Paso a Paso

#### Método 1: Interfaz Web (Más Fácil)

1. **Ir a [vercel.com](https://vercel.com)**

2. **Conectar con GitHub**
   - Click en "Import Project"
   - Autorizar Vercel en GitHub
   - Seleccionar el repositorio zugarez-FRONT

3. **Configurar el Proyecto**
   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Variables de Entorno**
   - Click en "Environment Variables"
   - Agregar:
     ```
     REACT_APP_API_BASE=https://your-backend-url.com
     REACT_APP_MP_PUBLIC_KEY=your_mercadopago_key
     ```

5. **Deploy**
   - Click en "Deploy"
   - Esperar ~2 minutos
   - ¡Listo! URL: `https://zugarez-front.vercel.app`

#### Método 2: CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (primera vez)
vercel

# 4. Deploy a producción
vercel --prod

# 5. Configurar variables de entorno
vercel env add REACT_APP_API_BASE production
# Ingresar el valor cuando se solicite
```

### Configuración Avanzada (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000, immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_BASE": "@api-base-url"
  }
}
```

---

## 🎯 Opción 2: Netlify

### Ventajas
- ✅ Muy fácil de usar
- ✅ Form handling incluido
- ✅ SSL automático
- ✅ Redirects y rewrites sencillos

### Paso a Paso

#### Método 1: Drag & Drop

```bash
# 1. Crear build
npm run build

# 2. Ir a netlify.com
# 3. Drag & drop la carpeta build/
```

#### Método 2: Git Integration

1. **Conectar con GitHub**
   - New site from Git
   - Seleccionar repositorio

2. **Configuración de Build**
   ```
   Build command: npm run build
   Publish directory: build
   ```

3. **Variables de Entorno**
   - Site settings > Build & deploy > Environment
   - Agregar variables REACT_APP_*

#### Método 3: CLI

```bash
# 1. Instalar CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Inicializar
netlify init

# 4. Deploy
netlify deploy --prod
```

### Configuración (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## ☁️ Opción 3: AWS S3 + CloudFront

### Ventajas
- ✅ Escalabilidad empresarial
- ✅ Control total
- ✅ Integración con otros servicios AWS

### Paso a Paso

```bash
# 1. Instalar AWS CLI
pip install awscli

# 2. Configurar credenciales
aws configure

# 3. Crear bucket S3
aws s3 mb s3://zugarez-frontend

# 4. Configurar bucket para hosting
aws s3 website s3://zugarez-frontend \
  --index-document index.html \
  --error-document index.html

# 5. Build y subir
npm run build
aws s3 sync build/ s3://zugarez-frontend --delete

# 6. Configurar política pública
aws s3api put-bucket-policy --bucket zugarez-frontend \
  --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::zugarez-frontend/*"
    }
  ]
}
```

### CloudFront Setup

```bash
# Crear distribución CloudFront
aws cloudfront create-distribution \
  --origin-domain-name zugarez-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

---

## 🐳 Opción 4: Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Commands

```bash
# Build image
docker build -t zugarez-frontend .

# Run locally
docker run -p 3000:80 zugarez-frontend

# Push to registry
docker tag zugarez-frontend your-registry/zugarez-frontend:latest
docker push your-registry/zugarez-frontend:latest
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_BASE=https://api.zugarez.com
    restart: unless-stopped
```

---

## 📦 Opción 5: GitHub Pages

### Limitaciones
- ⚠️ Solo sitios estáticos
- ⚠️ No variables de entorno en runtime
- ⚠️ Necesita configuración especial para React Router

### Setup

```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Agregar scripts en package.json
{
  "homepage": "https://yourusername.github.io/zugarez-FRONT",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}

# 3. Deploy
npm run deploy
```

---

## 🔧 Configuración Post-Deployment

### 1. Verificar Variables de Entorno

```bash
# Verificar que las variables están configuradas
curl https://your-deployed-app.com/
# Inspeccionar network tab para ver las llamadas API
```

### 2. Configurar CORS en Backend

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "https://zugarez-front.vercel.app",
                        "https://www.zugarez.com"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 3. Configurar DNS (si tienes dominio propio)

```
# En tu proveedor DNS (GoDaddy, Namecheap, etc.)

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com

Tipo: A
Nombre: @
Valor: [IP de tu hosting]
```

### 4. SSL/HTTPS

La mayoría de plataformas (Vercel, Netlify) proporcionan SSL automático.

Para configuración manual:
```bash
# Con Certbot (Let's Encrypt)
sudo certbot --nginx -d zugarez.com -d www.zugarez.com
```

---

## 🔍 Verificación Post-Deployment

### Checklist

- [ ] Sitio accesible en la URL
- [ ] HTTPS funcionando (candado verde)
- [ ] Todas las páginas cargan correctamente
- [ ] Login/Registro funciona
- [ ] Llamadas API exitosas
- [ ] Carrito funciona
- [ ] Mercado Pago redirige correctamente
- [ ] Imágenes se cargan
- [ ] Responsive en móvil
- [ ] Console sin errores críticos

### Tools de Verificación

```bash
# 1. Lighthouse (Performance)
npx lighthouse https://your-site.com --view

# 2. Verificar SSL
curl -I https://your-site.com

# 3. Verificar CORS
curl -H "Origin: https://your-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://your-api.com/api/products
```

---

## 🚨 Troubleshooting

### Problema: Página en blanco después de deploy

**Solución:**
```bash
# Verificar homepage en package.json
{
  "homepage": "."  // Para hosting en subdirectorio
}

# O remover homepage si está en raíz
```

### Problema: 404 en rutas de React Router

**Solución Vercel (vercel.json):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Solución Netlify (_redirects):**
```
/*  /index.html  200
```

### Problema: Variables de entorno no funcionan

**Verificar:**
- Deben empezar con `REACT_APP_`
- Rebuild después de agregarlas
- No exponer en git (.env en .gitignore)

### Problema: CORS errors

**Solución:**
- Configurar CORS en backend
- Agregar dominio de producción a allowedOrigins
- Verificar que las URLs no tengan / al final

---

## 🔄 CI/CD Automático

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_BASE: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📊 Monitoreo Post-Deployment

### Herramientas Recomendadas

1. **Google Analytics**
   ```html
   <!-- En public/index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Sentry (Error Tracking)**
   ```bash
   npm install @sentry/react
   ```

3. **New Relic / DataDog**
   - Para métricas de performance

---

## 📝 Checklist Final

### Antes de Deployment
- [ ] Tests pasando
- [ ] Build exitoso localmente
- [ ] Variables de entorno documentadas
- [ ] README actualizado
- [ ] Changelog actualizado

### Durante Deployment
- [ ] Variables de entorno configuradas
- [ ] CORS configurado en backend
- [ ] DNS configurado (si aplica)
- [ ] SSL configurado

### Después de Deployment
- [ ] Verificar funcionalidad completa
- [ ] Monitoreo configurado
- [ ] Backups configurados
- [ ] Documentación actualizada
- [ ] Equipo notificado

---

¡Tu aplicación Zugarez está lista para producción! 🚀

