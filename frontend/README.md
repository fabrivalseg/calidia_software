# Sistema de Gestión de Enfermería - Geriátrico Calidia

Sistema profesional de gestión para el módulo de enfermería de un geriátrico. Desarrollado con React, JavaScript y Tailwind CSS.

## 🚀 Características Principales

### Autenticación
- Sistema de login seguro con email y contraseña
- Gestión de sesiones con localStorage
- Diseño profesional con branding institucional

### Gestión de Residentes
- Visualización completa de residentes
- Búsqueda por nombre, apellido o DNI
- Información detallada:
  - Datos personales (nombre, DNI, fecha de nacimiento)
  - Información médica (patologías, medicación)
  - Datos de contacto familiar
  - Obra social y médico de cabecera

### Registros de Enfermería
- Registro por turnos (Mañana, Tarde, Noche)
- Captura de signos vitales:
  - Temperatura
  - Presión arterial
  - Frecuencia cardíaca
- Observaciones detalladas
- Asociación con residente específico
- Registro de usuario que realiza la carga

### Gestión de Medicación
- Visualización del plan de medicación por residente
- Organización por momentos del día
- Registro de administración de medicamentos
- Control de medicación ya administrada
- Historial de administraciones del día

### Historial
- Consulta de registros históricos
- Filtros por:
  - Residente
  - Rango de fechas
  - Turno
- Visualización cronológica
- Detalle completo de cada registro

## 🛠 Tecnologías

- **React 19** - Framework frontend
- **JavaScript** (sin TypeScript)
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Context API** - Gestión de estado

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── Layout.jsx      # Layout principal con navegación
├── views/              # Vistas principales
│   ├── Login.jsx       # Pantalla de login
│   ├── Inicio.jsx      # Dashboard principal
│   ├── Residentes.jsx  # Gestión de residentes
│   ├── Registros.jsx   # Registros de enfermería
│   ├── Medicacion.jsx  # Control de medicación
│   └── Historial.jsx   # Consulta histórica
├── services/           # Servicios de API
│   ├── authService.js
│   ├── residentesService.js
│   ├── registrosService.js
│   └── medicacionService.js
├── context/            # Context API
│   └── AuthContext.jsx
└── utils/              # Utilidades
```

## 🚦 Instalación y Uso

### Requisitos Previos
- Node.js (v16 o superior)
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🔐 Login de Prueba

Para probar el sistema, ingresa cualquier email y contraseña válidos. El sistema está configurado con autenticación simulada que permite el acceso con cualquier credencial.

**Importante:** En producción, reemplazar con autenticación real contra el backend.

## 🔌 Integración con Backend

Los servicios están preparados para conectarse a un backend real mediante API REST. Cada servicio incluye comentarios `TODO` indicando dónde reemplazar las simulaciones con llamadas reales.

### Endpoints Esperados

#### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/verify` - Verificar token

#### Residentes
- `GET /api/residentes` - Listar residentes
- `GET /api/residentes/:id` - Obtener residente
- `GET /api/residentes/search?q=query` - Buscar residentes
- `POST /api/residentes` - Crear residente

#### Registros
- `GET /api/registros/residente/:id` - Registros por residente
- `GET /api/registros` - Todos los registros
- `POST /api/registros` - Crear registro

#### Medicación
- `GET /api/medicacion/residente/:id` - Medicación por residente
- `POST /api/medicacion/administracion` - Registrar administración
- `GET /api/medicacion/administraciones/:residenteId/:fecha` - Administraciones del día

## 🎨 Diseño

El sistema utiliza una paleta de colores profesional:

- **Primary (Verde):** #22c55e
- **Secondary (Azul):** #3b82f6
- **Fondos:** Blanco y grises claros
- **Acentos:** Gradientes suaves

### Principios de Diseño
- Claridad y legibilidad
- Densidad visual equilibrada
- Diseño responsivo (tablets, notebooks, celulares)
- Interfaz intuitiva para uso diario
- Profesionalismo institucional

## 📱 Compatibilidad

- ✅ Tablets (uso principal)
- ✅ Notebooks/Desktop
- ✅ Smartphones
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🔄 Próximos Pasos

1. Conectar con backend real
2. Implementar validaciones de formularios más robustas
3. Agregar exportación de reportes
4. Implementar notificaciones en tiempo real
5. Agregar más filtros y búsquedas avanzadas
6. Sistema de roles y permisos más detallado

## 👥 Usuarios del Sistema

- Enfermeros/as
- Médicos
- Personal administrativo
- Personal general

## 📄 Licencia

Sistema privado - Geriátrico Calidia

---

**Desarrollado con ❤️ para mejorar la atención de nuestros residentes**

