// electron-driver.js - Helper para inicializar el driver de Electron

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const config = require('../config/selenium.config');

/**
 * Crea y configura un driver de Selenium para Electron
 * @returns {Promise<WebDriver>}
 */
async function createElectronDriver() {
  // Configurar opciones de Chrome para Electron
  const options = new chrome.Options();

  // Configurar el binario de Electron
  options.setChromeBinaryPath(config.electronPath);

  // Argumentos para Electron
  options.addArguments(
    `--app=${config.appPath}`,
    `--remote-debugging-port=${config.debuggingPort}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-extensions'
  );

  // Usar electron-chromedriver en lugar del chromedriver normal
  const service = new chrome.ServiceBuilder(
    path.join(__dirname, '../../../node_modules/electron-chromedriver/bin/chromedriver')
  );

  // Crear el driver
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  // Configurar timeouts
  await driver.manage().setTimeouts({
    implicit: config.defaultTimeout,
    pageLoad: config.pageLoadTimeout,
    script: config.scriptTimeout
  });

  console.log('✅ Electron driver creado exitosamente');
  return driver;
}

/**
 * Cierra el driver de forma segura
 * @param {WebDriver} driver
 */
async function quitDriver(driver) {
  if (driver) {
    try {
      await driver.quit();
      console.log('✅ Driver cerrado correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar driver:', error.message);
    }
  }
}

/**
 * Toma un screenshot y lo guarda
 * @param {WebDriver} driver
 * @param {string} filename - Nombre del archivo (sin extensión)
 */
async function takeScreenshot(driver, filename) {
  const fs = require('fs');
  const path = require('path');

  try {
    // Crear directorio si no existe
    const dir = config.screenshotsDir;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Tomar screenshot
    const image = await driver.takeScreenshot();
    const filepath = path.join(dir, `${filename}.png`);

    // Guardar imagen
    fs.writeFileSync(filepath, image, 'base64');
    console.log(`📸 Screenshot guardado: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error('❌ Error al tomar screenshot:', error.message);
    return null;
  }
}

module.exports = {
  createElectronDriver,
  quitDriver,
  takeScreenshot
};
