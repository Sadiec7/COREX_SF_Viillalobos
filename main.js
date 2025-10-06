// main.js - Equivalente al main.py con arquitectura MVC
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Importar DatabaseManager y Modelos v2
const { initDatabase } = require('./models/database');
const UserModel = require('./models/user_model_sqljs');
const ClienteModel = require('./models/cliente_model');
const PolizaModel = require('./models/poliza_model');
const { registerIPCHandlers } = require('./ipc-handlers');

let mainWindow;
let dbManager;
let userModel;
let clienteModel;
let polizaModel;

function createWindow() {
    // Crear la ventana del navegador con tamaño inicial más grande
    mainWindow = new BrowserWindow({
        width: 500,
        height: 750,
        minWidth: 450,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: "Seguros Fianzas VILLALOBOS",
        icon: path.join(__dirname, 'icon.png'),  // Ícono de la app
        resizable: true,  // Permitir redimensionar
        show: false,
        maximizable: true,
        minimizable: true
    });

    // Cargar la vista de login
    mainWindow.loadFile('views/login_view.html');

    // Mostrar cuando esté listo
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.center();
    });

    // Manejar cierre de ventana
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // DevTools en modo desarrollo
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }
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
    console.log('✅ Modelos inicializados (User, Cliente, Poliza)\n');

    // 3. Registrar handlers IPC
    registerIPCHandlers(dbManager, userModel, clienteModel, polizaModel);

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

    // Cargar dashboard en la misma ventana con transición más rápida
    setTimeout(async () => {
        if (mainWindow) {
            // Redimensionar ventana para dashboard
            mainWindow.setSize(1200, 800);
            mainWindow.center();

            // Cargar dashboard
            await mainWindow.loadFile('views/dashboard_view.html');
            console.log('✅ Dashboard cargado exitosamente');
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