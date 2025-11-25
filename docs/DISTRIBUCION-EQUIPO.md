# 📋 DISTRIBUCIÓN DEL PROYECTO - EQUIPO DE 5

**Sistema de Seguros VILLALOBOS - Arquitectura MVC con Electron**

---

## 👥 INTEGRANTES DEL EQUIPO

1. **Angel Salinas** (Líder Técnico / Integrador)
2. **Michelle** (Frontend & UI/UX)
3. **Sebas** (Backend & Base de Datos)
4. **Chava** (Testing & QA)
5. **Angel Flores** (Arquitectura Electron & IPC)

---

## 🎯 DISTRIBUCIÓN DE RESPONSABILIDADES

### 👤 **1. ANGEL SALINAS** - Líder Técnico / Integrador
**Rol**: Coordinación general, integración de componentes, arquitectura MVC

#### 📂 Archivos Asignados:

**Core de la Aplicación**
- `main.js` - Proceso principal de Electron
- `preload.js` - API segura entre procesos
- `ipc-handlers.js` - Handlers IPC del proceso principal
- `package.json` - Configuración del proyecto

**Módulo de Pólizas (CORE)**
- `controllers/polizas_controller.js`
- `models/poliza_model.js`
- `views/partials/polizas_partial.html`

**Módulo de Recibos**
- `controllers/recibos_controller.js`
- `models/recibo_model.js`
- `views/partials/recibos_partial.html`

**Dashboard**
- `controllers/dashboard_controller.js`
- `views/partials/dashboard_partial.html`

**Seeder & Migración**
- `migration/seeder.js`
- `migration/helpers/rfc-generator.js`
- `migration/helpers/faker-data.js`

#### 🎓 Preguntas que debe poder responder:

1. **¿Cómo funciona la arquitectura MVC en Electron?**
   - Explicar la separación entre Model, View, Controller
   - Cómo se comunican los procesos (main vs renderer)

2. **¿Cómo se generan los recibos automáticamente al crear una póliza?**
   - Revisar `poliza_model.js:152-213` método `_generarRecibos()`
   - Explicar cálculo de periodicidad y distribución de montos

3. **¿Cómo funciona el seeder y por qué es importante?**
   - Explicar el uso de PolizaModel para auto-generar recibos
   - Datos realistas mexicanos (RFCs, nombres, direcciones)

4. **¿Qué métricas se muestran en el dashboard?**
   - Cobrado este mes, por cobrar, morosidad
   - Explicar queries de `dashboard_controller.js`

5. **¿Cómo se comunican el frontend y backend en Electron?**
   - IPC (Inter-Process Communication)
   - preload.js como puente seguro
   - Ejemplo: `window.electronAPI.polizas.create()`

#### 📝 Archivos clave para estudiar:
```
main.js:1-200                    # Inicialización de Electron
preload.js:1-500                 # API Bridge IPC
poliza_model.js:152-213          # Generación de recibos
seeder.js:165-249                # Seeder con PolizaModel
dashboard_controller.js:1-300    # Métricas del dashboard
```

---

### 👤 **2. MICHELLE** - Frontend & UI/UX
**Rol**: Interfaz de usuario, experiencia de usuario, componentes visuales

#### 📂 Archivos Asignados:

**Módulo de Clientes**
- `controllers/clientes_controller.js`
- `models/cliente_model.js`
- `views/partials/clientes_partial.html`

**Módulo de Documentos**
- `controllers/documentos_controller.js`
- `models/documento_model.js`
- `views/partials/documentos_partial.html`

**Módulo de Catálogos**
- `controllers/catalogos_controller.js`
- `models/catalogos_model.js`
- `views/partials/catalogos_partial.html`

**Utilidades Frontend**
- `assets/js/toast-manager.js` - Notificaciones
- `assets/js/confirm-modal.js` - Modales de confirmación
- `assets/js/form-validator.js` - Validación de formularios
- `assets/js/pagination-utils.js` - Paginación de tablas
- `assets/js/tooltip-manager.js` - Tooltips informativos
- `assets/js/loading-spinner.js` - Indicadores de carga

**Vistas Principales**
- `views/login_view.html`
- `views/app_view.html`

**Estilos**
- `assets/css/input.css`
- `tailwind.config.js`

#### 🎓 Preguntas que debe poder responder:

1. **¿Qué framework CSS se usa y por qué?**
   - Tailwind CSS - utilidad-first
   - Ventajas: rápido, consistente, no CSS custom

2. **¿Cómo funcionan los toasts (notificaciones)?**
   - Revisar `toast-manager.js`
   - Tipos: success, error, warning, info
   - Auto-dismiss configurable

3. **¿Cómo se validan los formularios?**
   - Revisar `form-validator.js`
   - Validaciones: requeridos, formato RFC, email, fechas
   - Mensajes de error personalizados

4. **¿Cómo funciona la paginación de tablas?**
   - Revisar `pagination-utils.js`
   - Controles: anterior, siguiente, ir a página
   - Mostrar X registros por página

5. **¿Qué es el patrón de componentes reutilizables?**
   - Modales reutilizables (confirm-modal.js)
   - Toast manager centralizado
   - Form validator genérico

6. **¿Cómo se organizan las vistas parciales?**
   - app_view.html carga partials dinámicamente
   - Navegación SPA (Single Page App)

#### 📝 Archivos clave para estudiar:
```
toast-manager.js:1-150           # Sistema de notificaciones
form-validator.js:1-200          # Validación de formularios
clientes_partial.html:1-300      # Ejemplo de vista CRUD
confirm-modal.js:1-100           # Confirmaciones de usuario
pagination-utils.js:1-150        # Paginación de tablas
```

---

### 👤 **3. SEBAS** - Backend & Base de Datos
**Rol**: Base de datos, modelos, lógica de negocio

#### 📂 Archivos Asignados:

**Core de Base de Datos**
- `models/database.js` - DatabaseManager y queries centrales
- `models/user_model_sqljs.js` - Modelo de usuarios
- `models/auditoria_model.js` - Sistema de auditoría

**Catálogos de Base de Datos**
- `controllers/aseguradoras_controller.js`
- `controllers/ramos_controller.js`
- `controllers/periodicidades_controller.js`
- `controllers/metodos_pago_controller.js`

**Vistas de Catálogos**
- `views/partials/aseguradoras_partial.html`
- `views/partials/ramos_partial.html`
- `views/partials/periodicidades_partial.html`
- `views/partials/metodos_pago_partial.html`

**Configuración**
- `controllers/config_controller.js`
- `views/partials/config_partial.html`

**Esquema de Base de Datos**
- `docs/base-de-datos/DATABASE_PROPOSAL.md`
- `docs/base-de-datos/SCHEMA.sql`

#### 🎓 Preguntas que debe poder responder:

1. **¿Qué motor de base de datos se usa y por qué?**
   - SQLite con sql.js (ejecuta en JavaScript)
   - Ventajas: archivo único, portátil, sin servidor
   - Perfecto para Electron (aplicación de escritorio)

2. **¿Cómo está organizado el esquema de la base de datos?**
   - Revisar `docs/base-de-datos/DATABASE_PROPOSAL.md`
   - Tablas principales: Cliente, Poliza, Recibo, Usuario
   - Catálogos: Aseguradora, Ramo, Periodicidad, MetodoPago

3. **¿Qué es el patrón Singleton en DatabaseManager?**
   - Revisar `database.js:1-50`
   - Una sola instancia de conexión a BD
   - Compartida en toda la aplicación

4. **¿Cómo funcionan los soft deletes?**
   - Campo `activo = 0` en lugar de DELETE
   - Mantiene histórico y auditoría
   - Queries filtran con `WHERE activo = 1`

5. **¿Qué es el sistema de auditoría?**
   - Revisar `auditoria_model.js`
   - Registra cambios en pólizas
   - Campos: usuario, acción, valores antes/después

6. **¿Cómo se manejan las transacciones?**
   - BEGIN TRANSACTION, COMMIT, ROLLBACK
   - Ejemplo en `poliza_model.js:18-92`
   - Asegura consistencia (recibos se crean con póliza)

7. **¿Qué son las periodicidades y cómo afectan los recibos?**
   - Mensual, Trimestral, Semestral, Anual
   - Determina cuántos recibos se generan
   - Campo `meses` define intervalo

#### 📝 Archivos clave para estudiar:
```
database.js:1-300                # DatabaseManager singleton
database.js:400-600              # Queries del dashboard
DATABASE_PROPOSAL.md             # Esquema completo
auditoria_model.js:1-100         # Sistema de auditoría
poliza_model.js:14-93            # Transacciones
```

---

### 👤 **4. CHAVA** - Testing & QA
**Rol**: Pruebas automatizadas, calidad de software

#### 📂 Archivos Asignados:

**Tests Selenium - Suites**
- `testing-qa-selenium/selenium-webdriver/tests/auth.test.js`
- `testing-qa-selenium/selenium-webdriver/tests/clientes.test.js`
- `testing-qa-selenium/selenium-webdriver/tests/polizas.test.js`
- `testing-qa-selenium/selenium-webdriver/tests/recibos.test.js`
- `testing-qa-selenium/selenium-webdriver/tests/catalogos.test.js`
- `testing-qa-selenium/selenium-webdriver/tests/documentos.test.js`
- `testing-qa-selenium/selenium-webdriver/tests/dashboard.test.js`

**Page Objects**
- `testing-qa-selenium/selenium-webdriver/page-objects/BasePage.js`
- `testing-qa-selenium/selenium-webdriver/page-objects/LoginPage.js`
- `testing-qa-selenium/selenium-webdriver/page-objects/ClientesPage.js`
- `testing-qa-selenium/selenium-webdriver/page-objects/PolizasPage.js`
- `testing-qa-selenium/selenium-webdriver/page-objects/RecibosPage.js`

**Helpers de Testing**
- `testing-qa-selenium/selenium-webdriver/helpers/wait-helpers.js`
- `testing-qa-selenium/selenium-webdriver/helpers/test-data.js`

**Configuración**
- `testing-qa-selenium/selenium-webdriver/config/selenium.config.js`
- `testing-qa-selenium/selenium-webdriver/run-all.js`

**Reportes**
- `testing-qa-selenium/generate-report.js`
- `testing-qa-selenium/generate-full-report.js`
- `testing-qa-selenium/generate-professional-report.js`

**Tests de Integridad**
- `testing/automatizado/scripts/db_integrity.test.js`
- `testing/automatizado/scripts/ui_smoke.test.js`

#### 🎓 Preguntas que debe poder responder:

1. **¿Qué es el patrón Page Object Model (POM)?**
   - Separar estructura de página de lógica de tests
   - Ventajas: reusable, mantenible, legible
   - Ejemplo: `LoginPage.js` encapsula elementos del login

2. **¿Cómo se integra Selenium con Electron?**
   - Usar electron-chromedriver (no chromedriver normal)
   - Configurar Chrome binary path al binario de Electron
   - Remote debugging port para conexión

3. **¿Qué son los locators y cuáles se usan?**
   - By.id(), By.css(), By.xpath()
   - Preferir IDs (más rápidos y confiables)
   - Ejemplo en `LoginPage.js:14-39`

4. **¿Qué es el patrón AAA en tests?**
   - Arrange (preparar datos)
   - Act (ejecutar acción)
   - Assert (verificar resultado)
   - Ejemplo en `polizas.test.js:128-150`

5. **¿Cómo se manejan las esperas en Selenium?**
   - Esperas implícitas (timeout global)
   - Esperas explícitas (waitForElement)
   - Revisar `wait-helpers.js`

6. **¿Qué es clickWithRetry y por qué es necesario?**
   - Revisar `BasePage.js:381-411`
   - Maneja "element click intercepted"
   - Reintenta hasta N veces

7. **¿Cómo se generan los reportes de tests?**
   - Formato JSON con resultados
   - Screenshots en fallos
   - Revisar `generate-professional-report.js`

8. **¿Cuántos tests hay y qué cubren?**
   - Auth: login válido/inválido, sesión
   - Clientes: CRUD completo
   - Pólizas: crear, editar, eliminar, búsqueda
   - Recibos: marcar como pagado, búsqueda
   - Dashboard: métricas, gráficas

#### 📝 Archivos clave para estudiar:
```
BasePage.js:1-505                # Clase base Page Object
LoginPage.js:1-373               # Ejemplo completo de PO
polizas.test.js:1-200            # Ejemplo de suite de tests
electron-driver.js:1-102         # Configuración Selenium-Electron
wait-helpers.js:1-150            # Estrategias de espera
auth.test.js:1-300               # Tests de autenticación
```

---

### 👤 **5. ANGEL FLORES** - Arquitectura Electron & IPC
**Rol**: Comunicación entre procesos, arquitectura Electron, seguridad

#### 📂 Archivos Asignados:

**Core de Electron**
- `main.js` - Proceso principal (estudiar junto con Angel S.)
- `preload.js` - Script de precarga (contextBridge)
- `ipc-handlers.js` - Todos los handlers IPC

**Helpers de Electron Testing**
- `testing-qa-selenium/selenium-webdriver/helpers/electron-driver.js`

**Navegación y App**
- `assets/js/app-navigation.js`

**Login y Autenticación**
- `controllers/login_controller.js`

**Documentación de Arquitectura**
- `docs/arquitectura/MVC-ARCHITECTURE.md` (si existe)
- `README.md`

#### 🎓 Preguntas que debe poder responder:

1. **¿Qué es Electron y cómo funciona?**
   - Framework para apps de escritorio con tecnologías web
   - Chromium (renderizado) + Node.js (backend)
   - Multi-proceso: main process + renderer processes

2. **¿Qué es el proceso principal (main process)?**
   - Revisar `main.js:1-200`
   - Crea ventanas (BrowserWindow)
   - Maneja IPC, archivos, base de datos
   - Tiene acceso a APIs de Node.js

3. **¿Qué es el proceso renderer?**
   - Ejecuta el HTML/CSS/JS de la interfaz
   - NO tiene acceso directo a Node.js (seguridad)
   - Se comunica con main process vía IPC

4. **¿Qué es preload.js y por qué es crítico?**
   - Revisar `preload.js:1-500`
   - Ejecuta ANTES de cargar la página
   - Expone APIs seguras usando contextBridge
   - Puente entre renderer (no confiable) y main (confiable)

5. **¿Cómo funciona IPC (Inter-Process Communication)?**
   - ipcMain.handle() en proceso main
   - ipcRenderer.invoke() en renderer (vía preload)
   - Ejemplo: `ipcMain.handle('polizas:create', async (event, data) => {...})`

6. **¿Qué es contextBridge y por qué es seguro?**
   - Revisar `preload.js:10-30`
   - Expone solo APIs específicas
   - Evita exponer todo Node.js al renderer
   - Previene ataques de código malicioso

7. **¿Cómo se maneja la autenticación en Electron?**
   - Revisar `login_controller.js`
   - bcryptjs para hash de passwords
   - Sesión almacenada en localStorage
   - Redirección entre login_view y app_view

8. **¿Qué es la arquitectura de seguridad en Electron?**
   - contextIsolation: true
   - nodeIntegration: false
   - preload script para APIs controladas
   - Revisar `main.js:50-80` (creación de ventana)

9. **¿Cómo se comunica el frontend con la base de datos?**
   ```
   Frontend (clientes_partial.html)
      ↓ llama a
   Controller (clientes_controller.js)
      ↓ usa IPC via
   preload.js (window.electronAPI.clientes.create)
      ↓ invoca
   ipc-handlers.js (ipcMain.handle('clientes:create'))
      ↓ llama a
   Model (cliente_model.js)
      ↓ ejecuta query en
   Database (database.js)
   ```

10. **¿Cómo se ejecutan los tests de Selenium en Electron?**
    - Revisar `electron-driver.js:12-50`
    - Configurar chrome binary path a Electron
    - Usar electron-chromedriver
    - Remote debugging port

#### 📝 Archivos clave para estudiar:
```
main.js:1-150                    # Inicialización de Electron
main.js:50-80                    # Configuración de seguridad
preload.js:1-100                 # contextBridge setup
preload.js:100-500               # Todas las APIs expuestas
ipc-handlers.js:1-1000           # Todos los handlers IPC
electron-driver.js:12-50         # Selenium + Electron
login_controller.js:1-200        # Autenticación
```

---

## 📊 RESUMEN DE DISTRIBUCIÓN

| Integrante | Área Principal | # Archivos | Complejidad |
|------------|----------------|------------|-------------|
| **Angel Salinas** | Integración / MVC Core | ~15 | Alta |
| **Michelle** | Frontend / UI/UX | ~15 | Media-Alta |
| **Sebas** | Backend / Base de Datos | ~12 | Alta |
| **Chava** | Testing / QA | ~20 | Media |
| **Angel Flores** | Electron / IPC / Arquitectura | ~10 | Alta |

---

## 🎯 PREGUNTAS GENERALES (TODOS DEBEN SABER)

### Arquitectura del Proyecto

1. **¿Qué patrón arquitectónico se usa?**
   - MVC (Model-View-Controller)
   - Separación de responsabilidades

2. **¿Qué tecnologías principales se usan?**
   - Electron (framework desktop)
   - SQLite con sql.js (base de datos)
   - Tailwind CSS (estilos)
   - Selenium WebDriver (testing)
   - Chart.js (gráficas)
   - PDFKit (generación de PDFs)

3. **¿Cuál es el flujo de una operación CRUD?**
   ```
   Usuario → Vista HTML → Controller JS → IPC (preload.js)
   → IPC Handlers (main.js) → Model JS → Database SQLite
   → Respuesta de vuelta por el mismo camino
   ```

4. **¿Qué módulos tiene el sistema?**
   - Dashboard (métricas de negocio)
   - Clientes (gestión de clientes)
   - Pólizas (gestión de pólizas de seguros)
   - Recibos (pagos de pólizas)
   - Documentos (archivos adjuntos)
   - Catálogos (aseguradoras, ramos, etc.)
   - Configuración (parámetros del sistema)

5. **¿Por qué Electron?**
   - App de escritorio multiplataforma (Windows, Mac, Linux)
   - Usa tecnologías web (HTML/CSS/JS)
   - Acceso a sistema de archivos
   - Base de datos local (SQLite)

---

## 📚 ESTRATEGIA DE ESTUDIO

### Para cada integrante:

1. **Leer primero**:
   - Este documento completo
   - Los archivos clave de tu área (marcados con 📝)

2. **Ejecutar el código**:
   - Instalar: `npm install`
   - Probar: `npm start`
   - Hacer login: admin / admin123
   - Navegar a tu módulo asignado

3. **Experimentar**:
   - Modificar valores, ver qué pasa
   - Agregar console.log() para entender flujo
   - Revisar DevTools (Ctrl+Shift+I en Electron)

4. **Preparar respuestas**:
   - Anotar respuestas a las preguntas de tu sección
   - Practicar explicar en voz alta
   - Tener ejemplos de código listos

5. **Conocer el panorama completo**:
   - Leer las preguntas de las otras secciones
   - Entender cómo tu área se integra con las demás

---

## 🔗 DEPENDENCIAS ENTRE ÁREAS

```
┌─────────────────────────────────────────────────────┐
│                  ANGEL FLORES                        │
│              (Electron / IPC Core)                   │
│   main.js, preload.js, ipc-handlers.js              │
└──────────────┬──────────────────────┬────────────────┘
               │                      │
       ┌───────▼───────┐      ┌──────▼──────┐
       │  ANGEL S.     │      │   SEBAS     │
       │  (MVC Core)   │◄────►│ (Database)  │
       │  Controllers  │      │   Models    │
       └───────┬───────┘      └──────┬──────┘
               │                     │
       ┌───────▼─────────────────────▼──────┐
       │          MICHELLE                   │
       │        (Frontend / UI)              │
       │   Views, Components, Styles         │
       └─────────────────┬───────────────────┘
                         │
                 ┌───────▼───────┐
                 │     CHAVA     │
                 │   (Testing)   │
                 │  Selenium QA  │
                 └───────────────┘
```

---

## ⚡ COMANDOS IMPORTANTES

```bash
# Instalar dependencias
npm install

# Iniciar aplicación
npm start

# Ejecutar seeder (poblar BD con datos de prueba)
npm run seed

# Tests
npm run test:selenium        # Todos los tests
npm run test:auth           # Solo autenticación
npm run test:polizas        # Solo pólizas
npm run test:dashboard      # Solo dashboard

# Build CSS (Tailwind)
npm run build:css

# Generar distributable
npm run dist                # Para tu plataforma actual
npm run dist:win           # Para Windows
npm run dist:mac           # Para macOS
```

---

## 🎤 PREPARACIÓN PARA LA PRESENTACIÓN

### Cada integrante debe:

1. **Poder demostrar su módulo en vivo**
2. **Explicar el código de sus archivos principales**
3. **Responder las preguntas de su sección**
4. **Explicar cómo su área se integra con las demás**

### Preguntas comunes del profesor:

- "¿Por qué eligieron esta tecnología?"
- "¿Qué pasaría si...?" (escenarios hipotéticos)
- "Muéstrame dónde se implementa X funcionalidad"
- "¿Cómo manejaron este problema de...?"
- "¿Qué aprendieron en este proyecto?"

---

## 📞 CONTACTO Y COORDINACIÓN

**Líder de equipo**: Angel Salinas

Sugerencia: Crear un grupo de WhatsApp/Discord para:
- Resolver dudas entre ustedes
- Practicar presentación
- Coordinar quién presenta qué

---

## ✅ CHECKLIST FINAL (3 días antes de presentar)

- [ ] Cada integrante estudió sus archivos asignados
- [ ] Cada integrante puede responder sus preguntas
- [ ] Probamos que la app funciona en la máquina de presentación
- [ ] Tenemos datos de prueba cargados (npm run seed)
- [ ] Screenshots/videos de backup por si algo falla
- [ ] Ensayamos la presentación completa al menos 1 vez
- [ ] Todos conocemos el flujo general del proyecto

---

**Fecha de creación**: 24 de noviembre de 2025
**Versión**: 1.0
**Proyecto**: Sistema de Seguros VILLALOBOS

---

## 💡 CONSEJOS FINALES

1. **No memoricen, comprendan**: Es mejor entender que recitar
2. **Usen ejemplos**: "Por ejemplo, cuando un usuario crea una póliza..."
3. **Sean honestos**: Si no saben algo, digan "No estoy seguro, pero creo que..."
4. **Ayúdense entre ustedes**: Si un compañero no sabe, otro puede apoyar
5. **Muestren entusiasmo**: Están orgullosos de este proyecto

**¡ÉXITO EN SU PRESENTACIÓN! 🚀**
