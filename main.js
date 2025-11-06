// main.js - Equivalente al main.py con arquitectura MVC
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// ========== OPTIMIZACIONES PARA EQUIPOS DE BAJOS RECURSOS ==========
// CPU: Intel Celeron N4120 @ 1.10GHz
// RAM: 4 GB (3.82 GB utilizable)
// GPU: Intel UHD Graphics 600 (512 MB)

// 1. Deshabilitar animaciones innecesarias de Electron
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

// 2. Optimizar uso de memoria
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512'); // Limitar heap de V8 a 512MB
app.commandLine.appendSwitch('disable-software-rasterizer');

// 3. Reducir uso de GPU (importante para GPU integrada básica)
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');

// 4. Optimizar carga de imágenes
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');

// 5. Reducir procesos en segundo plano
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');

// ====================================================================

// Importar DatabaseManager y Modelos v2
const { initDatabase } = require('./models/database');
const UserModel = require('./models/user_model_sqljs');
const ClienteModel = require('./models/cliente_model');
const PolizaModel = require('./models/poliza_model');
const ReciboModel = require('./models/recibo_model');
const DocumentoModel = require('./models/documento_model');
const CatalogosModel = require('./models/catalogos_model');
const AuditoriaModel = require('./models/auditoria_model');
const { registerIPCHandlers } = require('./ipc-handlers');

let mainWindow;
let dbManager;
let userModel;
let clienteModel;
let polizaModel;
let reciboModel;
let documentoModel;
let catalogosModel;
let auditoriaModel;

function createWindow() {
    // Crear la ventana del navegador optimizada para bajo rendimiento
    mainWindow = new BrowserWindow({
        width: 500,
        height: 750,
        minWidth: 450,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            // Optimizaciones para bajo rendimiento
            backgroundThrottling: false,  // Evitar ralentización en segundo plano
            enableWebSQL: false,  // Deshabilitar WebSQL (no se usa)
            spellcheck: false,  // Deshabilitar corrector ortográfico
            offscreen: false,  // Renderizado normal (no offscreen)
            disableHardwareAcceleration: false  // Mantener aceleración por hardware para GPU
        },
        title: "Seguros Fianzas VILLALOBOS",
        icon: path.join(__dirname, 'assets/images/logo.png'),  // Ícono en barra de tareas
        resizable: true,  // Permitir redimensionar
        show: false,
        maximizable: true,
        minimizable: true,
        // Optimización de memoria
        backgroundColor: '#f9fafb'  // Color de fondo para evitar flash blanco
    });

    // Cargar la vista de login
    mainWindow.loadFile('views/login_view.html');

    // Mostrar cuando esté listo
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.center();
    });

    // Capturar logs de la consola del navegador
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        const levels = ['VERBOSE', 'INFO', 'WARNING', 'ERROR'];
        console.log(`[RENDERER ${levels[level]}] ${message}`);
    });

    // Optimización: Limpiar memoria cuando se minimiza (ayuda en equipos con poca RAM)
    mainWindow.on('minimize', () => {
        if (global.gc) {
            global.gc();
        }
    });

    // Manejar cierre de ventana
    mainWindow.on('closed', () => {
        mainWindow = null;
        // Forzar garbage collection al cerrar
        if (global.gc) {
            global.gc();
        }
    });

    // DevTools en modo desarrollo
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    // Optimización: Reducir uso de CPU cuando la ventana está oculta
    mainWindow.on('hide', () => {
        mainWindow.webContents.setFrameRate(30);
    });

    mainWindow.on('show', () => {
        mainWindow.webContents.setFrameRate(60);
    });
}

async function initializeApp() {
    console.log('🛡️ Seguros Fianzas VILLALOBOS - Sistema MVC con Electron v2');
    console.log('   Inicializando aplicación con base de datos completa...\n');

    // 1. Inicializar base de datos (sql.js es asíncrono)
    dbManager = await initDatabase();

    // 2. Crear instancias de los modelos (pasando dbManager, no db)
    userModel = new UserModel(dbManager);
    clienteModel = new ClienteModel(dbManager);
    polizaModel = new PolizaModel(dbManager);
    reciboModel = new ReciboModel(dbManager);
    documentoModel = new DocumentoModel(dbManager);
    catalogosModel = new CatalogosModel(dbManager);
    auditoriaModel = new AuditoriaModel(dbManager);
    console.log('✅ Modelos inicializados (User, Cliente, Poliza, Recibo, Documento, Catálogos, Auditoría)\n');

    // 3. Registrar handlers IPC
    registerIPCHandlers(
        dbManager,
        {
            userModel,
            clienteModel,
            polizaModel,
            reciboModel,
            documentoModel,
            catalogosModel,
            auditoriaModel
        }
    );

    // 4. Crear la ventana (Vista)
    createWindow();
    console.log('✅ Vista cargada (LoginView)');

    // 5. El Controlador se inicializa en el renderer process
    console.log('✅ Controlador se inicializará en el frontend');
    console.log('');
    console.log('🔐 Credenciales: admin / admin123');
}

// Manejar autenticación desde el renderer process (ahora con bcrypt)
ipcMain.handle('auth:authenticate', async (event, username, password) => {
    try {
        console.log(`🔐 Intentando autenticar usuario: ${username}`);

        // Usar el modelo v2 con bcrypt para verificar credenciales
        const user = await userModel.checkCredentials(username, password);

        if (user) {
            console.log(`✅ Autenticación exitosa para: ${username} (Rol: ${user.rol})`);

            return {
                success: true,
                user: user
            };
        } else {
            console.log(`❌ Credenciales incorrectas para: ${username}`);
            return {
                success: false,
                message: 'Usuario o contraseña incorrectos'
            };
        }

    } catch (error) {
        console.error('❌ Error en autenticación:', error.message);
        return {
            success: false,
            message: error.message || 'Error interno del servidor'
        };
    }
});

// Manejar login exitoso
ipcMain.handle('app:login-success', async (event, user) => {
    console.log(`🎉 Login exitoso - Usuario: ${user.username}`);

    // Cargar app principal con navegación persistente
    setTimeout(async () => {
        if (mainWindow) {
            // Redimensionar ventana para la aplicación
            mainWindow.setSize(1200, 800);
            mainWindow.center();

            // Cargar app view (con navbar persistente)
            await mainWindow.loadFile('views/app_view.html');
            console.log('✅ App principal cargada exitosamente');
        }
    }, 200);

    return { success: true };
});

// Manejar logout
ipcMain.handle('app:logout', async (event) => {
    console.log('🚪 Logout solicitado');

    // Volver al login
    setTimeout(async () => {
        if (mainWindow) {
            // Redimensionar ventana para login
            mainWindow.setSize(450, 650);
            mainWindow.center();

            // Cargar login
            await mainWindow.loadFile('views/login_view.html');
            console.log('✅ Regreso al login exitoso');
        }
    }, 500);

    return { success: true };
});

// Eventos de la aplicación
app.whenReady().then(() => {
    initializeApp();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Cerrar conexión a la base de datos
        if (dbManager) {
            dbManager.close();
        }
        app.quit();
    }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa rechazada no manejada:', reason);
});
