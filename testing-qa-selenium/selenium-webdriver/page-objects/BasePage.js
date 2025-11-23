// BasePage.js - Clase base para todos los Page Objects

const { By } = require('selenium-webdriver');
const {
  waitForElement,
  waitForVisible,
  waitForClickable,
  waitForText,
  waitForTextContains,
  waitForUrlContains,
  sleep
} = require('../helpers/wait-helpers');
const { takeScreenshot } = require('../helpers/electron-driver');

/**
 * Clase base para Page Objects
 * Proporciona métodos comunes para interactuar con elementos
 */
class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  // ========== MÉTODOS DE BÚSQUEDA ==========

  /**
   * Encuentra un elemento por ID
   * @param {string} id
   * @returns {Promise<WebElement>}
   */
  async findById(id) {
    return await waitForElement(this.driver, By.id(id));
  }

  /**
   * Encuentra un elemento por selector CSS
   * @param {string} selector
   * @returns {Promise<WebElement>}
   */
  async findByCSS(selector) {
    return await waitForElement(this.driver, By.css(selector));
  }

  /**
   * Encuentra un elemento por nombre
   * @param {string} name
   * @returns {Promise<WebElement>}
   */
  async findByName(name) {
    return await waitForElement(this.driver, By.name(name));
  }

  /**
   * Encuentra un elemento por XPath
   * @param {string} xpath
   * @returns {Promise<WebElement>}
   */
  async findByXPath(xpath) {
    return await waitForElement(this.driver, By.xpath(xpath));
  }

  /**
   * Encuentra un elemento por texto del enlace
   * @param {string} linkText
   * @returns {Promise<WebElement>}
   */
  async findByLinkText(linkText) {
    return await waitForElement(this.driver, By.linkText(linkText));
  }

  // ========== MÉTODOS DE INTERACCIÓN ==========

  /**
   * Hace clic en un elemento
   * @param {By} locator
   */
  async click(locator) {
    const element = await waitForClickable(this.driver, locator);
    await element.click();
    console.log(`🖱️  Click en: ${locator}`);
  }

  /**
   * Hace clic en un elemento por ID
   * @param {string} id
   */
  async clickById(id) {
    await this.click(By.id(id));
  }

  /**
   * Ingresa texto en un campo
   * @param {By} locator
   * @param {string} text
   */
  async type(locator, text) {
    const element = await waitForVisible(this.driver, locator);
    await element.clear();
    await element.sendKeys(text);
    console.log(`⌨️  Escribiendo "${text}" en: ${locator}`);
  }

  /**
   * Ingresa texto en un campo por ID
   * @param {string} id
   * @param {string} text
   */
  async typeById(id, text) {
    await this.type(By.id(id), text);
  }

  /**
   * Limpia un campo de texto
   * @param {By} locator
   */
  async clear(locator) {
    const element = await waitForVisible(this.driver, locator);
    await element.clear();
    console.log(`🧹 Campo limpiado: ${locator}`);
  }

  /**
   * Selecciona una opción de un dropdown por texto visible
   * @param {By} locator
   * @param {string} optionText
   */
  async selectByText(locator, optionText) {
    const element = await waitForVisible(this.driver, locator);
    const option = await element.findElement(By.xpath(`.//option[text()="${optionText}"]`));
    await option.click();
    console.log(`📋 Seleccionado "${optionText}" en: ${locator}`);
  }

  // ========== MÉTODOS DE OBTENCIÓN DE INFORMACIÓN ==========

  /**
   * Obtiene el texto de un elemento
   * @param {By} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    const element = await waitForVisible(this.driver, locator);
    const text = await element.getText();
    console.log(`📖 Texto obtenido: "${text}"`);
    return text;
  }

  /**
   * Obtiene el valor de un campo de entrada
   * @param {By} locator
   * @returns {Promise<string>}
   */
  async getValue(locator) {
    const element = await waitForVisible(this.driver, locator);
    const value = await element.getAttribute('value');
    console.log(`📝 Valor obtenido: "${value}"`);
    return value;
  }

  /**
   * Obtiene un atributo de un elemento
   * @param {By} locator
   * @param {string} attribute
   * @returns {Promise<string>}
   */
  async getAttribute(locator, attribute) {
    const element = await waitForVisible(this.driver, locator);
    const value = await element.getAttribute(attribute);
    return value;
  }

  /**
   * Obtiene la URL actual
   * @returns {Promise<string>}
   */
  async getCurrentUrl() {
    const url = await this.driver.getCurrentUrl();
    console.log(`🌐 URL actual: ${url}`);
    return url;
  }

  /**
   * Obtiene el título de la página
   * @returns {Promise<string>}
   */
  async getTitle() {
    const title = await this.driver.getTitle();
    console.log(`📄 Título: ${title}`);
    return title;
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========

  /**
   * Verifica si un elemento está presente
   * @param {By} locator
   * @returns {Promise<boolean>}
   */
  async isElementPresent(locator) {
    try {
      await waitForElement(this.driver, locator, 2000);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si un elemento está visible
   * @param {By} locator
   * @returns {Promise<boolean>}
   */
  async isElementVisible(locator) {
    try {
      await waitForVisible(this.driver, locator, 2000);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si un elemento está habilitado
   * @param {By} locator
   * @returns {Promise<boolean>}
   */
  async isElementEnabled(locator) {
    const element = await waitForElement(this.driver, locator);
    return await element.isEnabled();
  }

  /**
   * Verifica si un checkbox está seleccionado
   * @param {By} locator
   * @returns {Promise<boolean>}
   */
  async isChecked(locator) {
    const element = await waitForElement(this.driver, locator);
    return await element.isSelected();
  }

  // ========== MÉTODOS DE ESPERA ==========

  /**
   * Espera a que un elemento esté presente
   * @param {By} locator
   * @param {number} timeout
   */
  async waitForElement(locator, timeout) {
    return await waitForElement(this.driver, locator, timeout);
  }

  /**
   * Espera a que un elemento sea visible
   * @param {By} locator
   * @param {number} timeout
   */
  async waitForVisible(locator, timeout) {
    return await waitForVisible(this.driver, locator, timeout);
  }

  /**
   * Espera a que la URL contenga cierto texto
   * @param {string} urlPart
   * @param {number} timeout
   */
  async waitForUrl(urlPart, timeout) {
    return await waitForUrlContains(this.driver, urlPart, timeout);
  }

  /**
   * Espera a que un elemento contenga cierto texto
   * @param {By} locator
   * @param {string} text
   * @param {number} timeout
   */
  async waitForTextContains(locator, text, timeout) {
    return await waitForTextContains(this.driver, locator, text, timeout);
  }

  /**
   * Espera un tiempo fijo (usar solo cuando sea necesario)
   * @param {number} ms
   */
  async sleep(ms) {
    await sleep(ms);
  }

  // ========== MÉTODOS ÚTILES ==========

  /**
   * Toma un screenshot de la página actual
   * @param {string} filename
   */
  async screenshot(filename) {
    return await takeScreenshot(this.driver, filename);
  }

  /**
   * Ejecuta JavaScript en el navegador
   * @param {string} script
   * @param {...any} args
   * @returns {Promise<any>}
   */
  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  /**
   * Refresca la página
   */
  async refresh() {
    await this.driver.navigate().refresh();
    console.log('🔄 Página refrescada');
  }

  /**
   * Navega hacia atrás
   */
  async goBack() {
    await this.driver.navigate().back();
    console.log('⬅️  Navegando hacia atrás');
  }

  /**
   * Navega hacia adelante
   */
  async goForward() {
    await this.driver.navigate().forward();
    console.log('➡️  Navegando hacia adelante');
  }
}

module.exports = BasePage;
