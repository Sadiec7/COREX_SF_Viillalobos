# 📘 GUÍA DE ESTUDIO - ANGEL FLORES (Arquitectura Electron & IPC)

**Área**: Electron, IPC (Inter-Process Communication), Arquitectura Multi-Proceso, Seguridad

---

## 🎯 TU RESPONSABILIDAD

Eres el experto en **Electron y comunicación entre procesos**. Debes poder explicar:
- Qué es Electron y cómo funciona
- La arquitectura multi-proceso (main vs renderer)
- Cómo funciona IPC (Inter-Process Communication)
- Qué es preload.js y contextBridge
- Por qué la arquitectura de seguridad es crítica
- Cómo se maneja la autenticación
- Cómo Selenium se integra con Electron

---

## 📚 ARCHIVOS QUE DEBES DOMINAR

### 🔥 **CRÍTICOS** (Debes conocer al 100%)

1. **`main.js`** - Proceso principal de Electron
   - **Líneas clave**: 1-150 (inicialización), 50-80 (seguridad)
   - **Qué hace**: Inicia Electron, crea ventana, configura IPC

2. **`preload.js`** - Script de precarga (API Bridge)
   - **Líneas clave**: 1-100 (contextBridge), 100-500 (todas las APIs)
   - **Qué hace**: Expone APIs seguras al renderer

3. **`ipc-handlers.js`** - Handlers IPC
   - **Líneas clave**: 1-1000 (todos los handlers)
   - **Qué hace**: Maneja todas las llamadas IPC del renderer

4. **`controllers/login_controller.js`** - Autenticación
   - **Líneas clave**: 1-200
   - **Qué hace**: Login, logout, manejo de sesión

### ⚠️ **IMPORTANTES** (Conocer funcionamiento general)

5. **`testing-qa-selenium/selenium-webdriver/helpers/electron-driver.js`**
6. **`assets/js/app-navigation.js`**
7. **`package.json`** - Configuración de Electron

---

## 💬 PREGUNTAS DEL PROFESOR (PREPARA RESPUESTAS)

### **1. ¿Qué es Electron y cómo funciona?**

**RESPUESTA MODELO**:
> "Electron es un framework para crear aplicaciones de escritorio multiplataforma usando tecnologías web.
>
> **Componentes principales**:
> - **Chromium**: Motor de renderizado (lo mismo que Chrome)
> - **Node.js**: Runtime de JavaScript con acceso al sistema
> - **APIs nativas**: Acceso a funcionalidades del SO
>
> **Aplicaciones famosas hechas con Electron**:
> - Visual Studio Code (editor de código de Microsoft)
> - Slack (mensajería empresarial)
> - Discord (chat para gamers)
> - Figma (diseño)
> - Notion (notas y productividad)
> - WhatsApp Desktop
>
> **Ventajas**:
> 1. **Multiplataforma**: Un código → Windows, Mac, Linux
> 2. **Tecnologías web**: HTML, CSS, JavaScript (que ya sabemos)
> 3. **Acceso al sistema**: Archivos, base de datos local, notificaciones
> 4. **Ecosistema npm**: Miles de paquetes disponibles
> 5. **Actualizaciones**: Fácil distribuir nuevas versiones
>
> **Arquitectura básica**:
> ```
> ┌─────────────────────────────────────┐
> │        Electron Application         │
> ├─────────────────────────────────────┤
> │                                     │
> │  ┌─────────────┐  ┌──────────────┐ │
> │  │Main Process │  │   Renderer   │ │
> │  │  (Node.js)  │◄─┤   Process    │ │
> │  │             │  │  (Chromium)  │ │
> │  └─────────────┘  └──────────────┘ │
> │         │                │         │
> │         ▼                ▼         │
> │    File System      HTML/CSS/JS   │
> │    Database         User Interface│
> │    OS APIs                         │
> └─────────────────────────────────────┘
> ```
>
> **Por qué Electron para este proyecto**:
> - App de escritorio para SMB (pequeñas empresas)
> - Base de datos local (SQLite)
> - Sin necesidad de servidor
> - Instalar en Windows/Mac
> - Interfaz familiar para usuarios de web"

**DEMOSTRAR**:
1. Abrir Task Manager (Windows) o Activity Monitor (Mac)
2. Mostrar procesos de Electron ejecutándose
3. Mostrar que hay múltiples procesos (main + renderer)

---

### **2. ¿Cuál es la diferencia entre main process y renderer process?**

**RESPUESTA MODELO**:
> "Electron tiene arquitectura multi-proceso por seguridad y estabilidad.
>
> **MAIN PROCESS** (`main.js`):
> - **Único**: Solo hay 1 main process
> - **Backend**: Servidor de la aplicación
> - **Acceso completo**: Node.js, archivos, base de datos, OS
> - **Crea ventanas**: Usa BrowserWindow
> - **Maneja IPC**: Recibe y procesa mensajes
> - **Vive mientras la app esté abierta**
>
> ```javascript
> // main.js
> const { app, BrowserWindow, ipcMain } = require('electron');
> const { dbManager } = require('./models/database');
>
> // Crear ventana
> function createWindow() {
>   const win = new BrowserWindow({
>     width: 1200,
>     height: 800,
>     webPreferences: {
>       preload: path.join(__dirname, 'preload.js'),
>       nodeIntegration: false,     // ← Seguridad
>       contextIsolation: true      // ← Seguridad
>     }
>   });
>
>   win.loadFile('./views/login_view.html');
> }
>
> // Handler IPC
> ipcMain.handle('clientes:getAll', async () => {
>   return dbManager.query('SELECT * FROM Cliente WHERE activo = 1');
> });
> ```
>
> **RENDERER PROCESS** (ventanas HTML):
> - **Múltiples**: Cada ventana es un renderer process
> - **Frontend**: Interfaz de usuario
> - **Restringido**: NO tiene acceso directo a Node.js (seguridad)
> - **Ejecuta**: HTML, CSS, JavaScript
> - **Comunica vía IPC**: Pide datos al main process
>
> ```javascript
> // En el HTML (renderer)
> const clientes = await window.electronAPI.clientes.getAll();
> // No puede hacer: require('fs') ❌
> // No puede hacer: dbManager.query() ❌
> ```
>
> **¿Por qué separar?**
>
> 1. **Seguridad**:
>    - Renderer ejecuta código que puede venir de internet
>    - Si alguien inyecta código malicioso, no puede acceder al sistema
>    - Main es confiable, renderer no
>
> 2. **Estabilidad**:
>    - Si renderer crashea, main sigue vivo
>    - Puedes cerrar/reabrir ventanas sin reiniciar app
>
> 3. **Rendimiento**:
>    - Operaciones pesadas (BD) en main
>    - UI responsiva en renderer
>    - No bloquear la interfaz
>
> **Analogía**:
> ```
> Main Process = Cocina de un restaurante
> - Acceso a ingredientes (archivos)
> - Prepara la comida (procesa datos)
> - Privado, solo empleados
>
> Renderer Process = Comedor del restaurante
> - Los clientes ven menú bonito (UI)
> - Piden comida (IPC)
> - No pueden entrar a la cocina
> ```

**DEMOSTRAR**:
1. Abrir DevTools (F12) en la app
2. Consola → escribir `require('fs')`
3. Mostrar error: "require is not defined"
4. Explicar: "Esto es seguridad - renderer no puede acceder a Node.js"
5. Escribir `window.electronAPI`
6. Mostrar: "Solo tiene las APIs que preload.js expuso"

---

### **3. ¿Cómo funciona IPC (Inter-Process Communication)?**

**RESPUESTA MODELO**:
> "IPC es el sistema de mensajería entre main process y renderer process.
>
> **Flujo completo de una llamada IPC**:
>
> **1. Renderer llama API** (`clientes_controller.js`):
> ```javascript
> async function cargarClientes() {
>   // Renderer pide datos al main
>   const result = await window.electronAPI.clientes.getAll();
>
>   if (result.success) {
>     mostrarClientes(result.data);
>   }
> }
> ```
>
> **2. Preload envía mensaje** (`preload.js`):
> ```javascript
> const { contextBridge, ipcRenderer } = require('electron');
>
> contextBridge.exposeInMainWorld('electronAPI', {
>   clientes: {
>     getAll: () => ipcRenderer.invoke('clientes:getAll'),
>     create: (data) => ipcRenderer.invoke('clientes:create', data),
>     update: (id, data) => ipcRenderer.invoke('clientes:update', id, data),
>     delete: (id) => ipcRenderer.invoke('clientes:delete', id)
>   }
> });
> ```
>
> **3. Main recibe y procesa** (`main.js` o `ipc-handlers.js`):
> ```javascript
> const { ipcMain } = require('electron');
> const { dbManager } = require('./models/database');
> const ClienteModel = require('./models/cliente_model');
>
> const clienteModel = new ClienteModel(dbManager);
>
> // Handler: escucha el mensaje 'clientes:getAll'
> ipcMain.handle('clientes:getAll', async (event) => {
>   try {
>     const clientes = clienteModel.getAll();
>     return { success: true, data: clientes };
>   } catch (error) {
>     return { success: false, error: error.message };
>   }
> });
> ```
>
> **4. Respuesta regresa al renderer**:
> ```javascript
> // La respuesta viaja de vuelta automáticamente
> const result = await window.electronAPI.clientes.getAll();
> console.log(result.data); // Array de clientes
> ```
>
> **Diagrama de flujo**:
> ```
> [Renderer Process]                    [Main Process]
>       │                                     │
>       │  window.electronAPI.clientes.getAll()
>       ├──────────────────────────────────► │
>       │                                     │
>       │          preload.js                │
>       │  ipcRenderer.invoke('clientes:getAll')
>       ├──────────────────────────────────► │
>       │                                     │
>       │                        ipcMain.handle('clientes:getAll')
>       │                                     ├─► clienteModel.getAll()
>       │                                     ├─► dbManager.query(...)
>       │                                     ├─► return { success, data }
>       │                                     │
>       │  { success: true, data: [...] }   │
>       │ ◄──────────────────────────────────┤
>       │                                     │
>   actualizar UI                            │
> ```
>
> **Tipos de IPC**:
>
> 1. **invoke/handle** (bidireccional con respuesta):
> ```javascript
> // Renderer
> const result = await ipcRenderer.invoke('accion', data);
>
> // Main
> ipcMain.handle('accion', async (event, data) => {
>   // procesar
>   return resultado;
> });
> ```
>
> 2. **send/on** (unidireccional, sin esperar respuesta):
> ```javascript
> // Renderer
> ipcRenderer.send('log', 'mensaje');
>
> // Main
> ipcMain.on('log', (event, mensaje) => {
>   console.log(mensaje);
> });
> ```
>
> **En nuestro proyecto usamos invoke/handle porque necesitamos respuestas**."

**DEMOSTRAR**:
1. Abrir `preload.js` líneas 100-200
2. Mostrar definición de APIs
3. Mostrar `ipcRenderer.invoke(...)`
4. Abrir `ipc-handlers.js` o `main.js`
5. Mostrar `ipcMain.handle(...)`
6. Abrir DevTools → Network
7. Crear un cliente
8. Mostrar la llamada IPC en DevTools

---

### **4. ¿Qué es preload.js y contextBridge? ¿Por qué son críticos?**

**RESPUESTA MODELO**:
> "preload.js es el script de precarga que actúa como puente seguro entre renderer y main.
>
> **¿Qué es preload.js?**
> - Se ejecuta ANTES de cargar la página HTML
> - Tiene acceso a Node.js
> - Tiene acceso al DOM del renderer
> - Es el ÚNICO lugar donde ambos mundos se juntan
>
> **Configuración en main.js**:
> ```javascript
> const win = new BrowserWindow({
>   width: 1200,
>   height: 800,
>   webPreferences: {
>     preload: path.join(__dirname, 'preload.js'),  // ← Script de precarga
>     nodeIntegration: false,   // ← NO dar Node.js al renderer
>     contextIsolation: true    // ← Separar contextos
>   }
> });
> ```
>
> **¿Qué es contextBridge?**
> - API de Electron para exponer funciones de forma segura
> - Crea un puente entre contextos aislados
> - Solo expone lo que explícitamente defines
>
> **Ejemplo en preload.js**:
> ```javascript
> const { contextBridge, ipcRenderer } = require('electron');
>
> // ✅ Exponer APIs seguras
> contextBridge.exposeInMainWorld('electronAPI', {
>   // API de clientes
>   clientes: {
>     getAll: () => ipcRenderer.invoke('clientes:getAll'),
>     create: (data) => ipcRenderer.invoke('clientes:create', data)
>   },
>
>   // API de pólizas
>   polizas: {
>     getAll: () => ipcRenderer.invoke('polizas:getAll'),
>     create: (data) => ipcRenderer.invoke('polizas:create', data)
>   },
>
>   // API de dashboard
>   dashboard: {
>     getMetrics: () => ipcRenderer.invoke('dashboard:getMetrics')
>   }
> });
> ```
>
> **Uso en renderer**:
> ```javascript
> // ✅ Permitido - API expuesta
> const clientes = await window.electronAPI.clientes.getAll();
>
> // ❌ NO permitido - no expuesto
> const fs = require('fs');  // Error: require is not defined
>
> // ❌ NO permitido - no expuesto
> const { exec } = require('child_process');
> ```
>
> **¿Por qué es crítico para seguridad?**
>
> **Sin contextBridge (inseguro)**:
> ```javascript
> // main.js (MAL - NO HACER)
> webPreferences: {
>   nodeIntegration: true,     // ❌ Peligroso
>   contextIsolation: false    // ❌ Peligroso
> }
>
> // Ahora en renderer (HTML):
> <script>
>   const fs = require('fs');
>   fs.unlinkSync('/important-file');  // 💀 Puede borrar archivos
>
>   const { exec } = require('child_process');
>   exec('rm -rf /');  // 💀 Puede destruir el sistema
> </script>
> ```
>
> **Con contextBridge (seguro)**:
> ```javascript
> // Solo puede llamar APIs que preload expuso
> window.electronAPI.clientes.getAll();  // ✅ Permitido
> require('fs');  // ❌ Error
> ```
>
> **Escenario de ataque real**:
> 1. Usuario abre PDF malicioso en la app
> 2. PDF tiene JavaScript malicioso inyectado
> 3. Sin contextBridge: el código puede hacer `require('fs')` y borrar archivos
> 4. Con contextBridge: el código solo ve `window.electronAPI`, nada más
>
> **Regla de oro**:
> - **Renderer = No confiable** (puede ejecutar código de internet)
> - **Main = Confiable** (tu código)
> - **preload.js = Puente seguro y controlado**"

**DEMOSTRAR**:
1. Abrir `main.js:50-80`
2. Señalar `nodeIntegration: false`
3. Señalar `contextIsolation: true`
4. Señalar `preload: path.join(__dirname, 'preload.js')`
5. Abrir `preload.js:1-100`
6. Señalar `contextBridge.exposeInMainWorld`
7. Abrir DevTools → Consola
8. Escribir `window`
9. Expandir `electronAPI`
10. Mostrar solo las APIs expuestas

---

### **5. ¿Cómo funciona la autenticación en Electron?**

**RESPUESTA MODELO**:
> "La autenticación se maneja en el main process y usa bcrypt para hashear passwords.
>
> **Flujo de login**:
>
> **1. Usuario ingresa credenciales** (`login_view.html`):
> ```javascript
> // login_controller.js
> async function handleLogin(username, password) {
>   const result = await window.electronAPI.auth.login(username, password);
>
>   if (result.success) {
>     // Guardar sesión en localStorage
>     localStorage.setItem('userId', result.user.usuario_id);
>     localStorage.setItem('username', result.user.username);
>
>     // Redirigir a app
>     window.location.href = 'app_view.html';
>   } else {
>     showError(result.error);
>   }
> }
> ```
>
> **2. Main process valida** (`ipc-handlers.js` o `main.js`):
> ```javascript
> const bcrypt = require('bcryptjs');
> const { dbManager } = require('./models/database');
>
> ipcMain.handle('auth:login', async (event, username, password) => {
>   try {
>     // 1. Buscar usuario
>     const user = dbManager.queryOne(
>       'SELECT * FROM Usuario WHERE username = ? AND activo = 1',
>       [username]
>     );
>
>     if (!user) {
>       return { success: false, error: 'Usuario no existe' };
>     }
>
>     // 2. Verificar password con bcrypt
>     const passwordMatch = await bcrypt.compare(password, user.password_hash);
>
>     if (!passwordMatch) {
>       return { success: false, error: 'Contraseña incorrecta' };
>     }
>
>     // 3. Actualizar última conexión
>     dbManager.execute(
>       'UPDATE Usuario SET ultima_conexion = CURRENT_TIMESTAMP WHERE usuario_id = ?',
>       [user.usuario_id]
>     );
>
>     // 4. Retornar datos del usuario (sin password)
>     delete user.password_hash;
>     return { success: true, user };
>
>   } catch (error) {
>     return { success: false, error: error.message };
>   }
> });
> ```
>
> **3. Sesión en localStorage**:
> ```javascript
> // Guardar (después de login exitoso)
> localStorage.setItem('userId', user.usuario_id);
> localStorage.setItem('username', user.username);
>
> // Verificar (en cada página)
> function checkAuth() {
>   const userId = localStorage.getItem('userId');
>   if (!userId) {
>     window.location.href = 'login_view.html';
>   }
> }
>
> // Logout
> function logout() {
>   localStorage.removeItem('userId');
>   localStorage.removeItem('username');
>   window.location.href = 'login_view.html';
> }
> ```
>
> **Seguridad de passwords con bcrypt**:
> ```javascript
> // Crear usuario (hash password)
> const bcrypt = require('bcryptjs');
> const saltRounds = 10;
>
> const passwordHash = await bcrypt.hash('admin123', saltRounds);
> // Resultado: $2a$10$abcd...xyz (60 caracteres)
>
> // Guardar en BD
> INSERT INTO Usuario (username, password_hash) VALUES ('admin', '$ 2a$10$abcd...xyz');
>
> // Verificar password
> const match = await bcrypt.compare('admin123', passwordHash);
> // match = true si coincide
> ```
>
> **¿Por qué bcrypt?**
> - **Irreversible**: No puedes obtener la contraseña original
> - **Salted**: Dos usuarios con misma contraseña tienen hashes diferentes
> - **Slow by design**: Dificulta ataques de fuerza bruta
> - **Estándar de industria**: Usado por bancos, Google, Facebook
>
> **Ejemplo**:
> ```
> Password: 'admin123'
> Hash 1: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
> Hash 2: $2a$10$bQu8eJZxQV5zRz6hKL9yy.vOwJBKx0DhL2K7K8Nx9qU5vDyR6YpLy
>
> Mismo password, hashes diferentes por el 'salt'
> ```

**DEMOSTRAR**:
1. Cerrar sesión en la app
2. Abrir DevTools
3. Ir a Application → Local Storage
4. Mostrar que está vacío
5. Hacer login con admin/admin123
6. Mostrar que aparece userId y username en localStorage
7. Abrir DB Browser
8. Query: `SELECT username, password_hash FROM Usuario`
9. Mostrar que password_hash es ilegible
10. Explicar: "Es imposible obtener 'admin123' del hash"

---

### **6. ¿Cómo se integra Selenium con Electron?**

**RESPUESTA MODELO**:
> "Integrar Selenium con Electron requiere configuración especial porque Electron no es un navegador normal.
>
> **Desafíos**:
> 1. Electron usa Chromium, pero con versión específica
> 2. No se ejecuta como Chrome normal
> 3. Necesita ChromeDriver compatible con su versión
>
> **Solución** (`electron-driver.js`):
> ```javascript
> const { Builder } = require('selenium-webdriver');
> const chrome = require('selenium-webdriver/chrome');
> const path = require('path');
>
> async function createElectronDriver() {
>   const options = new chrome.Options();
>
>   // 1. ✅ Apuntar al binario de Electron (no Chrome)
>   options.setChromeBinaryPath(
>     path.join(__dirname, '../../../node_modules/electron/dist/Electron.app/Contents/MacOS/Electron')
>   );
>
>   // 2. ✅ Pasar argumentos a Electron
>   options.addArguments(
>     `--app=${path.join(__dirname, '../../../main.js')}`,  // Tu app
>     `--remote-debugging-port=9222`,  // Puerto para Selenium
>     '--disable-gpu',
>     '--no-sandbox'
>   );
>
>   // 3. ✅ Usar electron-chromedriver (no chromedriver normal)
>   const service = new chrome.ServiceBuilder(
>     path.join(__dirname, '../../../node_modules/electron-chromedriver/bin/chromedriver')
>   );
>
>   // 4. ✅ Crear driver
>   const driver = await new Builder()
>     .forBrowser('chrome')
>     .setChromeOptions(options)
>     .setChromeService(service)
>     .build();
>
>   return driver;
> }
> ```
>
> **¿Qué hace cada parte?**
>
> 1. **setChromeBinaryPath**: Le dice a Selenium que ejecute Electron en lugar de Chrome
> 2. **--app=main.js**: Lanza tu aplicación Electron
> 3. **--remote-debugging-port=9222**: Abre puerto para que Selenium se conecte
> 4. **electron-chromedriver**: ChromeDriver compilado para la versión de Electron que usas
>
> **Flujo de ejecución**:
> ```
> npm run test:auth
>    ↓
> electron-chromedriver se inicia (puerto 9515)
>    ↓
> ChromeDriver lanza Electron con --app=main.js
>    ↓
> Electron abre con remote debugging (puerto 9222)
>    ↓
> Selenium se conecta al puerto 9222
>    ↓
> Ahora Selenium puede controlar Electron
>    ↓
> Test ejecuta: login, clic, verificar, etc.
>    ↓
> Test termina, Electron se cierra
> ```
>
> **package.json dependencies**:
> ```json
> {
>   'devDependencies': {
>     'electron': '^38.1.2',
>     'electron-chromedriver': '^38.0.0',  // ← Mismo major version
>     'selenium-webdriver': '^4.27.0'
>   }
> }
> ```
>
> **Importante**: La versión de `electron-chromedriver` debe coincidir con la de `electron`."

**DEMOSTRAR**:
1. Abrir `package.json`
2. Señalar `electron: ^38.1.2`
3. Señalar `electron-chromedriver: ^38.0.0`
4. Explicar: "Mismo major version (38)"
5. Abrir `electron-driver.js`
6. Señalar línea `setChromeBinaryPath`
7. Señalar línea `--remote-debugging-port=9222`
8. Ejecutar: `npm run test:auth`
9. Mostrar Electron abriéndose automáticamente
10. Mostrar test ejecutándose
11. Mostrar Electron cerrándose automáticamente

---

## 🎬 DEMOSTRACIÓN EN VIVO (Practica esto)

### **Demo 1: Arquitectura Multi-Proceso**
```
1. Iniciar aplicación
2. Abrir Task Manager (Windows) o Activity Monitor (Mac)
3. Buscar "Electron"
4. Mostrar múltiples procesos:
   - Electron (Main Process)
   - Electron Helper (Renderer Process)
   - Electron Helper (GPU Process)
5. Explicar: "Arquitectura multi-proceso para seguridad"
6. Cerrar app
7. Mostrar que todos los procesos terminan
```

### **Demo 2: Seguridad con contextBridge**
```
1. Abrir app
2. F12 → DevTools → Consola
3. Escribir: require('fs')
4. Mostrar error: "require is not defined"
5. Explicar: "nodeIntegration: false protege el sistema"
6. Escribir: window
7. Expandir y buscar electronAPI
8. Mostrar APIs expuestas: clientes, polizas, dashboard, etc.
9. Explicar: "Solo estas APIs están disponibles"
10. Intentar: window.electronAPI.clientes.getAll()
11. Mostrar que funciona
12. Abrir preload.js
13. Señalar donde se expone esa API
```

### **Demo 3: Flujo IPC Completo**
```
1. Abrir app → módulo Clientes
2. Abrir DevTools → Consola
3. Escribir: await window.electronAPI.clientes.getAll()
4. Mostrar array de clientes en consola
5. Abrir preload.js línea 100-150
6. Señalar: clientes: { getAll: () => ipcRenderer.invoke(...) }
7. Abrir main.js o ipc-handlers.js
8. Buscar: ipcMain.handle('clientes:getAll', ...)
9. Señalar: dbManager.query(...)
10. Explicar flujo completo:
    "Renderer → preload.js → IPC → main.js → model → BD → respuesta"
```

---

## ✅ CHECKLIST DE PREPARACIÓN

Antes de la presentación, asegúrate de poder:

- [ ] Explicar qué es Electron y por qué se usa
- [ ] Explicar arquitectura multi-proceso
- [ ] Explicar diferencia entre main y renderer
- [ ] Explicar cómo funciona IPC
- [ ] Explicar qué es preload.js y contextBridge
- [ ] Demostrar configuración de seguridad
- [ ] Explicar flujo de autenticación con bcrypt
- [ ] Mostrar IPC en acción (DevTools)
- [ ] Explicar integración Selenium + Electron
- [ ] Mostrar múltiples procesos en Task Manager
- [ ] Ejecutar tests de Selenium

---

## 🎯 RESPUESTAS RÁPIDAS (Memoriza)

**P: ¿Qué es Electron?**
R: Framework para apps de escritorio con HTML/CSS/JS usando Chromium + Node.js

**P: ¿Main vs Renderer?**
R: Main = backend (Node.js), Renderer = frontend (Chromium), separados por seguridad

**P: ¿Qué es IPC?**
R: Inter-Process Communication - mensajería entre main y renderer

**P: ¿Qué es preload.js?**
R: Script que expone APIs seguras del main al renderer vía contextBridge

**P: ¿Por qué contextBridge?**
R: Seguridad - solo expone APIs específicas, no todo Node.js

**P: ¿Cómo funciona auth?**
R: bcrypt hashea passwords, se verifican en main process, sesión en localStorage

**P: ¿Selenium + Electron cómo?**
R: electron-chromedriver + setChromeBinaryPath + remote debugging

**P: ¿Apps famosas con Electron?**
R: VS Code, Slack, Discord, WhatsApp Desktop, Figma, Notion

---

## 💡 CONCEPTOS CLAVE

- **nodeIntegration: false** - Renderer NO puede usar require()
- **contextIsolation: true** - Contextos separados
- **Remote debugging port** - Puerto 9222 para Selenium
- **ipcRenderer.invoke()** - Llamada con respuesta
- **ipcMain.handle()** - Handler que responde
- **bcrypt.hash()** - Crear hash de password
- **bcrypt.compare()** - Verificar password

**¡Éxito en tu presentación! ⚡**
