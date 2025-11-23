// selenium.config.js - Configuración de Selenium para Electron

const path = require('path');

const config = {
  // Rutas de la aplicación
  electronPath: path.join(__dirname, '../../../node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'),
  appPath: path.join(__dirname, '../../../main.js'),

  // Timeouts
  defaultTimeout: 10000, // 10 segundos
  pageLoadTimeout: 30000, // 30 segundos
  scriptTimeout: 5000, // 5 segundos

  // Configuración de ChromeDriver
  chromeDriverPort: 9515,
  debuggingPort: 9222,

  // Configuración de screenshots
  screenshotsDir: path.join(__dirname, '../../reports/screenshots'),

  // Datos de prueba
  testData: {
    users: {
      admin: {
        username: 'admin',
        password: 'admin123'
      },
      agente: {
        username: 'agente1',
        password: 'agente123'
      },
      testUser: {
        username: 'test_user',
        password: 'Test123!'
      }
    }
  },

  // URLs de las vistas
  views: {
    login: 'login_view.html',
    app: 'app_view.html'
  }
};

module.exports = config;
