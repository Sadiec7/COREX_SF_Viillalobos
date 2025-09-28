# 🛡️ Sistema de Gestión de Seguros - Seguros Fianzas VILLALOBOS

Sistema de gestión moderno desarrollado con **Electron** y arquitectura **MVC**, diseñado para la gestión integral de seguros y fianzas.

## ✨ Características Principales

- 🏛️ **Arquitectura MVC** con separación clara de responsabilidades
- 🎨 **Interfaz moderna** con animaciones CSS fluidas
- 🔐 **Sistema de autenticación** seguro con IPC
- 📊 **Dashboard interactivo** con métricas en tiempo real
- 🚧 **Alertas de funcionalidades** para desarrollo futuro
- 🎭 **Logos corporativos** adaptativos según el tamaño
- ⚡ **Rendimiento optimizado** sin librerías pesadas

## 🛠️ Stack Tecnológico

### Core
- **Electron** - Framework de aplicación de escritorio
- **Node.js** - Runtime de JavaScript
- **HTML5/CSS3/JavaScript** - Frontend vanilla

### Styling
- **Tailwind CSS** - Framework de CSS utility-first
- **CSS Custom** - Animaciones y efectos avanzados

### Base de Datos
- **SQLite** - Base de datos local (con mock para desarrollo)
- **better-sqlite3** - Driver nativo (opcional)

### Herramientas
- **npm** - Gestor de paquetes
- **Git** - Control de versiones

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** (viene con Node.js)
- **Git** (para clonar el repositorio)

### Verificar instalaciones:
```bash
node --version    # v16.0.0 o superior
npm --version     # 8.0.0 o superior
git --version     # cualquier versión reciente
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd projecttest
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar la aplicación
```bash
npm start
```

## 🔑 Credenciales de Acceso (Demo)

Para probar la aplicación, utiliza las siguientes credenciales:

- **Usuario**: `admin`
- **Contraseña**: `1234`

## 🏗️ Estructura del Proyecto

```
projecttest/
├── assets/                 # Recursos estáticos
│   └── images/            # Logos e imágenes
│       ├── logo.png       # Logo pequeño (sidebar)
│       └── logo-with-text.png # Logo completo (login)
├── controllers/           # Controladores MVC
│   └── login_controller.js
├── models/               # Modelos de datos
│   ├── user_model.js     # Modelo original con SQLite
│   └── user_model_mock.js # Modelo mock para desarrollo
├── views/                # Vistas de la aplicación
│   ├── login_view.html   # Pantalla de login
│   └── dashboard_view.html # Panel principal
├── main.js               # Proceso principal de Electron
├── preload.js           # Script de preload para IPC seguro
├── package.json         # Configuración del proyecto
└── README.md           # Este archivo
```

## 🎯 Arquitectura MVC

### **Model (Modelo)**
- `user_model_mock.js` - Gestión de usuarios y autenticación
- Datos en memoria para desarrollo
- Interfaz preparada para SQLite en producción

### **View (Vista)**
- `login_view.html` - Interfaz de autenticación
- `dashboard_view.html` - Panel de control principal
- CSS con animaciones y efectos visuales

### **Controller (Controlador)**
- `login_controller.js` - Lógica de autenticación
- Comunicación entre Vista y Modelo
- Manejo de eventos y validaciones

## ⚙️ Scripts Disponibles

```bash
# Ejecutar la aplicación
npm start

# Instalar dependencias
npm install

# Limpiar node_modules (si hay problemas)
npm run clean && npm install
```

## 🎨 Características de la Interfaz

### Login
- Logo corporativo completo con animaciones
- Campos con efectos hover y focus
- Botón con animación de carga y éxito
- Elementos flotantes de fondo
- Transición fluida al dashboard

### Dashboard
- Logo pequeño en sidebar
- Navegación con efectos visuales
- Tarjetas métricas con shimmer effects
- Alertas toast para funciones futuras
- Reloj en tiempo real

## 🔧 Desarrollo

### Agregar nuevas funciones
1. Crear controlador en `/controllers/`
2. Actualizar modelo en `/models/`
3. Crear vista en `/views/`
4. Conectar mediante IPC en `main.js`

### Modificar estilos
- Usar clases Tailwind para estilos base
- CSS custom para animaciones avanzadas
- Mantener paleta de colores corporativa

### Base de datos
- Actualmente usa datos mock
- Para producción, activar `user_model.js` con SQLite
- Configurar `better-sqlite3` si es necesario

## 🐛 Solución de Problemas

### Error de módulos nativos
```bash
npm rebuild
# o
npm install --rebuild
```

### Problemas con better-sqlite3
- El proyecto usa mock data como fallback
- Para SQLite real, instalar build tools del sistema

### Ventana no aparece
- Verificar que no hay errores en consola
- Comprobar permisos de pantalla (macOS)

## 📦 Preparación para Producción

### Configurar SQLite real
1. Instalar dependencias nativas
2. Cambiar import en `main.js`:
   ```javascript
   const UserModel = require('./models/user_model'); // SQLite real
   ```

### Build para distribución
```bash
# Instalar electron-builder
npm install --save-dev electron-builder

# Configurar en package.json y ejecutar
npm run build
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado para **Seguros Fianzas VILLALOBOS** con arquitectura moderna y escalable.

---

💡 **Tip**: Para desarrollo, usa `npm start` y las DevTools de Electron se abrirán automáticamente con `--dev` flag.