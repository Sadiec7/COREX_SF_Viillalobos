# Sistema de Gestión de Seguros - Seguros Fianzas VILLALOBOS

Sistema de gestión empresarial desarrollado con **Electron** y arquitectura **MVC**, diseñado para la administración integral de seguros, fianzas, clientes, pólizas y recibos.

## Características Principales

### Gestión Completa
- **Clientes**: CRUD completo con búsqueda y filtrado
- **Pólizas**: Administración de pólizas por cliente
- **Recibos**: Control de pagos y estados
- **Documentos**: Gestión de archivos asociados
- **Catálogos**: Aseguradoras, tipos de seguro, estados

### Tecnología
- Arquitectura MVC profesional
- Base de datos SQLite con sql.js
- Autenticación segura con bcrypt
- Sistema de auditoría completo
- Interfaz moderna con Tailwind CSS
- Optimizado para equipos de bajo rendimiento

### Seguridad
- Contraseñas hasheadas con bcrypt
- Validación de entrada de datos
- Sistema de auditoría de acciones
- Aislamiento de contexto con IPC

## Stack Tecnológico

### Backend
- **Electron** v38.1.2 - Framework de aplicación de escritorio
- **Node.js** - Runtime de JavaScript
- **sql.js** v1.13.0 - SQLite en memoria con persistencia
- **bcryptjs** v3.0.2 - Hash de contraseñas

### Frontend
- **HTML5/CSS3/JavaScript** - Frontend vanilla
- **Tailwind CSS** v3.4.17 - Framework de CSS utility-first
- **CSS Custom** - Animaciones y efectos avanzados

### Herramientas de Desarrollo
- **Electron Builder** v26.0.12 - Generación de instaladores
- **Playwright** v1.56.0 - Testing E2E automatizado
- **npm** - Gestor de paquetes
- **Git** - Control de versiones

## Requisitos del Sistema

### Mínimos (Equipos de Bajo Rendimiento)
- **Procesador**: Intel Celeron N4120 @ 1.10GHz o superior
- **RAM**: 4 GB (3.82 GB utilizable)
- **GPU**: Intel UHD Graphics 600 (512 MB) o equivalente
- **Espacio en disco**: 500 MB

### Recomendados
- **Procesador**: Intel Core i3 o superior
- **RAM**: 8 GB
- **GPU**: Cualquier GPU moderna
- **Espacio en disco**: 1 GB

### Software
- **Windows 10/11** (x64 o x86)
- **macOS** 10.13 o superior
- **Node.js** v16 o superior (solo para desarrollo)

## Instalación

### Para Usuarios Finales

#### Windows
1. Descargar `Sistema de Seguros VILLALOBOS Setup 1.0.0.exe`
2. Ejecutar el instalador
3. Seguir el asistente de instalación
4. Iniciar la aplicación desde el escritorio o menú de inicio

#### macOS
1. Descargar `Sistema de Seguros VILLALOBOS-1.0.0.dmg`
2. Abrir el archivo DMG
3. Arrastrar la aplicación a la carpeta Aplicaciones
4. Iniciar desde el Launchpad

### Para Desarrolladores

#### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd projecttest
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Ejecutar en modo desarrollo
```bash
npm start
# o con DevTools
npm run dev
```

## Credenciales de Acceso

### Usuario Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## Estructura del Proyecto

```
projecttest/
├── assets/                     # Recursos estáticos
│   ├── css/                    # Hojas de estilo
│   ├── images/                 # Logos e iconos
│   └── js/                     # JavaScript del frontend
├── build/                      # Recursos para builds
│   ├── icon.ico               # Icono Windows
│   ├── icon.icns              # Icono macOS
│   └── icon-256.png           # Icono base
├── controllers/               # Controladores MVC
│   ├── catalogos_controller.js
│   ├── clientes_controller.js
│   ├── dashboard_controller.js
│   ├── documentos_controller.js
│   ├── polizas_controller.js
│   └── recibos_controller.js
├── dist/                      # Instaladores generados
├── docs/                      # Documentación organizada
│   ├── arquitectura/          # Documentos de arquitectura
│   ├── base-de-datos/         # Documentación de BD
│   ├── desarrollo/            # Guías de desarrollo
│   ├── manuales/              # Manuales de usuario
│   └── testing/               # Reportes de testing
├── models/                    # Modelos de datos
│   ├── database.js            # Gestor de base de datos
│   ├── auditoria_model.js
│   ├── catalogos_model.js
│   ├── cliente_model.js
│   ├── documento_model.js
│   ├── poliza_model.js
│   ├── recibo_model.js
│   └── user_model_sqljs.js
├── testing/                   # Tests automatizados
│   ├── db_integrity.test.js
│   └── ui_smoke.test.js
├── views/                     # Vistas HTML
│   ├── partials/              # Componentes reutilizables
│   ├── app_view.html          # Vista principal
│   ├── clientes_view.html
│   └── login_view.html
├── main.js                    # Proceso principal Electron
├── preload.js                 # Script de preload IPC
├── ipc-handlers.js           # Manejadores de IPC
├── package.json              # Configuración del proyecto
└── README.md                 # Este archivo
```

## Scripts Disponibles

### Desarrollo
```bash
npm start              # Ejecutar aplicación
npm run dev           # Ejecutar con DevTools
npm run watch:css     # Compilar CSS en tiempo real
```

### Testing
```bash
npm run test:db       # Tests de integridad de BD
npm run test:ui       # Tests de interfaz (smoke tests)
```

### Build y Distribución
```bash
npm run dist          # Build para la plataforma actual
npm run dist:win      # Build para Windows (x64 + x86)
npm run dist:mac      # Build para macOS (requiere macOS)
npm run dist:all      # Build para todas las plataformas
```

### CSS
```bash
npm run build:css     # Compilar CSS una vez
npm run watch:css     # Compilar CSS automáticamente
```

## Arquitectura MVC

### Models (Modelos)
- `database.js` - Gestor central de SQLite
- `user_model_sqljs.js` - Usuarios y autenticación
- `cliente_model.js` - Gestión de clientes
- `poliza_model.js` - Gestión de pólizas
- `recibo_model.js` - Gestión de recibos
- `documento_model.js` - Gestión de documentos
- `catalogos_model.js` - Catálogos del sistema
- `auditoria_model.js` - Registro de auditoría

### Views (Vistas)
- `login_view.html` - Autenticación
- `app_view.html` - Contenedor principal con navegación
- `clientes_view.html` - CRUD de clientes
- Vistas dinámicas cargadas por módulo

### Controllers (Controladores)
- `login_controller.js` - Lógica de autenticación
- `dashboard_controller.js` - Panel principal
- `clientes_controller.js` - Lógica de clientes
- `polizas_controller.js` - Lógica de pólizas
- `recibos_controller.js` - Lógica de recibos
- `documentos_controller.js` - Lógica de documentos
- `catalogos_controller.js` - Lógica de catálogos

## Base de Datos

### Tecnología
- **sql.js**: SQLite compilado a WebAssembly
- **Persistencia**: Archivo `seguros.db` en disco
- **Backup automático**: Guardado después de cada transacción

### Tablas Principales
- `usuarios` - Usuarios del sistema
- `clientes` - Información de clientes
- `polizas` - Pólizas de seguros
- `recibos` - Recibos de pago
- `documentos` - Archivos adjuntos
- `aseguradoras` - Catálogo de aseguradoras
- `tipos_seguro` - Tipos de seguro
- `estados_poliza` - Estados de pólizas
- `auditoria` - Registro de acciones

## Optimizaciones para Bajo Rendimiento

El sistema está optimizado para funcionar en equipos con recursos limitados:

### CPU
- Limitación de heap V8 a 512MB
- Desactivación de procesos en segundo plano innecesarios
- Reducción de throttling de animaciones

### GPU
- Desactivación de vsync de GPU
- Desactivación de cache de shaders
- Optimización de renderizado

### Memoria
- Garbage collection al minimizar ventana
- Limpieza de memoria al cambiar vistas
- Limitación de frame rate a 30fps cuando está oculta

## Generación de Instaladores

### Configuración de Iconos
Los iconos ya están configurados en la carpeta `build/`:
- `icon.ico` - Windows
- `icon.icns` - macOS
- `icon-256.png` - Fallback

### Generar Instalador para Windows
```bash
npm run dist:win
```

Genera:
- Instalador NSIS (`.exe`)
- Versiones x64 y x86
- Atajos de escritorio y menú inicio
- Carpeta de instalación personalizable

### Generar Instalador para Mac
```bash
npm run dist:mac
```

**Nota**: Solo se puede generar desde macOS

Genera:
- Archivo DMG
- Aplicación firmada (requiere certificado)
- Instalación por arrastrar y soltar

## Testing

### Tests Automáticos
```bash
# Integridad de base de datos
npm run test:db

# Pruebas de interfaz
npm run test:ui
```

### Coverage
Ver reportes detallados en `docs/testing/`

## Documentación Adicional

### Manuales
- [Manual de Usuario](docs/manuales/MANUAL_USUARIO.md)

### Arquitectura
- [Especificaciones Completas](docs/arquitectura/ESPECIFICACIONES_COMPLETAS.md)
- [Análisis de Cumplimiento](docs/arquitectura/ANALISIS_CUMPLIMIENTO.md)
- [Mejoras UX/UI](docs/arquitectura/MEJORAS_UX_UI.md)

### Base de Datos
- [Propuesta de Base de Datos](docs/base-de-datos/DATABASE_PROPOSAL.md)
- [Diagrama de BD](docs/base-de-datos/diagrama_bd.md)

### Testing
- [Reporte de Ejecución](docs/testing/REPORTE_EJECUCION_TESTING.md)
- [Selectores de Referencia](docs/testing/SELECTORES_REFERENCIA.md)
- [Estado TestLink](docs/testing/TESTLINK_STATUS.md)

### Desarrollo
- [Checkpoint Claude](docs/desarrollo/CHECKPOINT_CLAUDE.md)
- [Prompt Lucidchart](docs/desarrollo/PROMPT_LUCIDCHART.md)

## Solución de Problemas

### La base de datos no persiste
```bash
# Verificar permisos del archivo seguros.db
chmod 644 seguros.db
```

### Error al compilar CSS
```bash
# Reinstalar Tailwind
npm install tailwindcss --save-dev
npm run build:css
```

### El instalador no se genera
```bash
# Limpiar caché y rebuildar
rm -rf dist/
npm run dist:win
```

### Problemas de rendimiento
- Verificar que las optimizaciones estén activas en `main.js`
- Reducir frame rate si es necesario
- Cerrar DevTools en producción

## Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: Agregar funcionalidad X'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Convenciones
- Usar commit messages semánticos
- Seguir estructura MVC
- Documentar funciones complejas
- Incluir tests para nuevas features

## Licencia

Este proyecto está bajo licencia propietaria de **Seguros Fianzas VILLALOBOS**.

## Contacto y Soporte

**Seguros Fianzas VILLALOBOS**
- Sistema desarrollado con tecnologías modernas
- Arquitectura escalable y mantenible
- Optimizado para rendimiento

---

**Versión**: 1.0.0
**Última actualización**: Noviembre 2025
