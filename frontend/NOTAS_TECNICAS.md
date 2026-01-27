# Notas Técnicas para Desarrolladores

## 📋 Resumen del Sistema

Este es un sistema frontend completo de gestión de enfermería para un geriátrico, desarrollado con React y preparado para conectarse a un backend real mediante API REST.

## 🏗 Arquitectura del Proyecto

### Patrón de Diseño
- **Context API** para gestión de estado global (autenticación)
- **Componentes funcionales** con hooks
- **Servicios separados** para lógica de negocio y llamadas API
- **Vistas independientes** para cada módulo

### Estructura de Carpetas

```
src/
├── components/
│   └── Layout.jsx              # Layout principal con sidebar y header
├── views/
│   ├── Login.jsx               # Pantalla de autenticación
│   ├── Inicio.jsx              # Dashboard principal
│   ├── Residentes.jsx          # Gestión y visualización de residentes
│   ├── Registros.jsx           # Registros de enfermería por turnos
│   ├── Medicacion.jsx          # Administración de medicación
│   └── Historial.jsx           # Consulta histórica de registros
├── services/
│   ├── authService.js          # Autenticación y verificación de tokens
│   ├── residentesService.js    # CRUD de residentes
│   ├── registrosService.js     # CRUD de registros de enfermería
│   └── medicacionService.js    # Gestión de medicación
├── context/
│   └── AuthContext.jsx         # Context global de autenticación
└── utils/                      # Utilidades (vacío, preparado para expansión)
```

## 🔌 Integración con Backend

### Estado Actual
Todos los servicios están **simulados** con datos mock y delays artificiales para simular latencia de red.

### Migración a Backend Real

Cada servicio tiene comentarios `// TODO:` marcando exactamente dónde reemplazar la lógica simulada con llamadas reales:

#### Ejemplo de Migración

**Antes (simulado):**
```javascript
getAll: async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockResidentes;
}
```

**Después (real):**
```javascript
getAll: async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/residentes`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al cargar residentes');
  return await response.json();
}
```

### API Endpoints Esperados

Ver archivo README.md para la lista completa de endpoints.

## 🎨 Sistema de Estilos

### Tailwind CSS v4
- Configuración en CSS mediante `@theme` en `src/index.css`
- No usa archivo `tailwind.config.js`
- PostCSS plugin: `@tailwindcss/postcss`

### Paleta de Colores

```css
Primary (Verde - Cuidado):
- 50 a 900: Escala completa de verdes

Secondary (Azul - Confianza):
- 50 a 900: Escala completa de azules
```

### Uso de Clases
- Gradientes: `bg-linear-to-r from-primary-600 to-secondary-600`
- Colores: `bg-primary-500`, `text-secondary-700`
- Responsivo: clases `md:`, `lg:` para tablets/desktop

## 🔐 Autenticación

### Flujo Actual (Simulado)
1. Usuario ingresa email y password
2. `authService.login()` valida (actualmente acepta cualquier credencial)
3. Se genera un objeto usuario con token mock
4. Se guarda en localStorage
5. AuthContext provee `isAuthenticated` a toda la app

### Flujo Real (A Implementar)
1. Usuario ingresa credenciales
2. POST a `/api/auth/login`
3. Backend valida y devuelve JWT + datos de usuario
4. Se guarda token en localStorage
5. Todas las peticiones subsecuentes incluyen el token en headers

### Protección de Rutas
Actualmente gestionado en `App.jsx`:
```javascript
if (!isAuthenticated) {
  return <Login />;
}
```

## 📊 Gestión de Estado

### Estado Global (Context API)
- **AuthContext:** Usuario actual, login, logout, isAuthenticated

### Estado Local (useState)
Cada vista maneja su propio estado:
- Listas de datos
- Formularios
- Filtros
- Estados de carga

### Consideraciones
- No se usa Redux (no es necesario para esta escala)
- Se puede migrar a Redux/Zustand si el sistema crece significativamente

## 🧪 Testing

### Estado Actual
No hay tests implementados.

### Recomendaciones para Testing
```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Testing sugerido:
- Unit tests para servicios
- Integration tests para flujos completos
- E2E tests con Playwright/Cypress para flujos críticos
```

## 🚀 Optimizaciones Futuras

### Performance
1. **React.memo** para componentes que se re-renderizan frecuentemente
2. **useMemo/useCallback** para funciones costosas
3. **Code splitting** con React.lazy para cargar vistas bajo demanda
4. **Virtual scrolling** si las listas de residentes crecen mucho

### Funcionalidades
1. **Caché local** con localStorage para datos frecuentes
2. **Offline support** con Service Workers
3. **Notificaciones push** para alertas de medicación
4. **Exportación de reportes** (PDF, Excel)
5. **Gráficos y estadísticas** con Chart.js o Recharts

## 🐛 Debugging

### Variables de Entorno
Crear `.env` basado en `.env.example`:
```env
VITE_API_URL=http://localhost:3000/api
```

### Console Logs
Los servicios incluyen `console.error()` para errores.
En producción, considerar usar un servicio de logging (Sentry, LogRocket).

### React DevTools
Extensión recomendada para debugging de componentes y hooks.

## 📱 Responsividad

### Breakpoints
- `sm:` 640px (smartphones)
- `md:` 768px (tablets)
- `lg:` 1024px (notebooks)
- `xl:` 1280px (desktop)

### Testing Responsivo
Probar en:
- Chrome DevTools (dispositivos móviles)
- Tablets reales (principal caso de uso)
- Diferentes navegadores

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 📦 Dependencias Principales

```json
{
  "react": "^19.0.0",
  "vite": "^7.3.0",
  "tailwindcss": "^4.1.18",
  "@tailwindcss/postcss": "^4.1.18"
}
```

## 🔄 Versionado

Recomendaciones:
- Usar Git para control de versiones
- Semantic Versioning (MAJOR.MINOR.PATCH)
- Conventional Commits para mensajes claros
- Branches: `main`, `develop`, `feature/*`, `hotfix/*`

## 📝 Convenciones de Código

### Naming
- Componentes: PascalCase (`Residentes.jsx`)
- Funciones/variables: camelCase (`loadResidentes`)
- Constantes: UPPER_SNAKE_CASE (`API_URL`)

### Archivos
- Componentes React: `.jsx`
- Servicios: `.js`
- Estilos globales: `.css`

### Comentarios
- JSDoc para funciones públicas
- Comentarios inline para lógica compleja
- TODO para marcar trabajo pendiente

## 🚨 Consideraciones de Seguridad

### Validaciones
- Frontend: Validación básica de formularios
- **Backend: Validación exhaustiva (CRÍTICO)**

### XSS Protection
- React escapa automáticamente el contenido
- Cuidado con `dangerouslySetInnerHTML` (no usado)

### CSRF
- Implementar tokens CSRF en backend
- SameSite cookies

### Tokens
- JWT debe tener expiración corta
- Refresh tokens para sesiones largas
- HTTPS obligatorio en producción

## 🌐 Deploy

### Opción 1: Vercel/Netlify
```bash
npm run build
# Subir carpeta dist/
```

### Opción 2: Nginx
```nginx
server {
  listen 80;
  server_name your-domain.com;
  
  root /var/www/frontend/dist;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Variables de Entorno en Producción
Configurar `VITE_API_URL` según el entorno.

## 📞 Contacto del Desarrollador

Para consultas técnicas sobre este código:
- Revisar comentarios en el código
- Consultar documentación de React y Tailwind CSS
- Issues en el repositorio del proyecto

---

**Última actualización:** Enero 2026
