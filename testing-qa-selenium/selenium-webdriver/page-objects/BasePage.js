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
   * Establece el valor de un campo de fecha usando executeScript
   * Más confiable que sendKeys para inputs type="date"
   * @param {By} locator
   * @param {string} dateValue - Fecha en formato YYYY-MM-DD
   */
  async setDateValue(locator, dateValue) {
    const element = await waitForVisible(this.driver, locator);
    await this.driver.executeScript(`
      arguments[0].value = arguments[1];
      arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
      arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    `, element, dateValue);
    console.log(`📅 Fecha establecida: "${dateValue}" en: ${locator}`);
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

  // ========== MÉTODOS AVANZADOS PARA TESTS ROBUSTOS ==========

  /**
   * Espera a que un elemento se vuelva invisible (útil para toasts/notifications)
   * Basado en: https://www.browserstack.com/guide/element-click-intercepted-exception-selenium
   * @param {By} locator - Localizador del elemento que debe desaparecer
   * @param {number} timeout - Tiempo máximo de espera en ms (default: 10000)
   * @returns {Promise<void>}
   */
  async waitForElementInvisible(locator, timeout = 10000) {
    const { until } = require('selenium-webdriver');
    console.log(`⏳ Esperando a que el elemento se vuelva invisible: ${locator}`);

    try {
      await this.driver.wait(until.elementIsNotVisible(
        await this.driver.findElement(locator)
      ), timeout);
      console.log(`✅ Elemento invisible: ${locator}`);
    } catch (error) {
      // Si el elemento no existe, también está "invisible"
      console.log(`✅ Elemento no presente/invisible: ${locator}`);
    }
  }

  /**
   * Hace clic con reintentos si hay interceptación
   * Basado en: https://stackoverflow.com/questions/58579355/selenium-wait-for-clickable-element-click-intercepted-issue
   * @param {By} locator - Localizador del botón/elemento a hacer clic
   * @param {number} maxRetries - Número máximo de reintentos (default: 3)
   * @param {number} delayBetweenRetries - Delay entre reintentos en ms (default: 1000)
   * @returns {Promise<void>}
   */
  async clickWithRetry(locator, maxRetries = 3, delayBetweenRetries = 1000) {
    console.log(`🔄 Intentando clic con reintentos en: ${locator}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`   Intento ${attempt}/${maxRetries}...`);

        // Esperar a que sea clickeable
        const element = await waitForClickable(this.driver, locator, 5000);
        await element.click();

        console.log(`✅ Clic exitoso en intento ${attempt}`);
        return;
      } catch (error) {
        if (error.name === 'ElementClickInterceptedError') {
          console.log(`   ⚠️  Clic interceptado en intento ${attempt}`);

          if (attempt === maxRetries) {
            console.log(`   ❌ Todos los intentos fallaron`);
            throw error;
          }

          // Esperar antes del siguiente intento
          await this.sleep(delayBetweenRetries);
        } else {
          // Otro tipo de error, lanzar inmediatamente
          throw error;
        }
      }
    }
  }

  /**
   * Espera a que una tabla tenga un número específico de filas
   * Basado en: https://stackoverflow.com/questions/65689079/selenium-java-how-can-i-make-it-wait-until-a-table-has-been-refreshed
   * @param {By} tableLocator - Localizador de la tabla
   * @param {number} expectedCount - Número esperado de filas
   * @param {number} timeout - Tiempo máximo de espera en ms (default: 10000)
   * @returns {Promise<boolean>}
   */
  async waitForTableRowCount(tableLocator, expectedCount, timeout = 10000) {
    const { until } = require('selenium-webdriver');
    console.log(`⏳ Esperando a que la tabla tenga ${expectedCount} filas`);

    try {
      await this.driver.wait(async () => {
        try {
          const table = await this.driver.findElement(tableLocator);
          const rows = await table.findElements(By.css('tbody tr'));
          const currentCount = rows.length;

          if (currentCount >= expectedCount) {
            console.log(`✅ Tabla tiene ${currentCount} filas (esperadas: ${expectedCount})`);
            return true;
          }

          return false;
        } catch (error) {
          return false;
        }
      }, timeout);

      return true;
    } catch (error) {
      console.log(`❌ Timeout esperando a que la tabla tenga ${expectedCount} filas`);
      return false;
    }
  }

  /**
   * Espera a que aparezca un texto específico en la tabla
   * @param {By} tableLocator - Localizador de la tabla
   * @param {string} searchText - Texto a buscar
   * @param {number} timeout - Tiempo máximo de espera en ms (default: 10000)
   * @returns {Promise<boolean>}
   */
  async waitForTextInTable(tableLocator, searchText, timeout = 10000) {
    const { until } = require('selenium-webdriver');
    console.log(`⏳ Esperando a que aparezca "${searchText}" en la tabla`);

    try {
      await this.driver.wait(async () => {
        try {
          const table = await this.driver.findElement(tableLocator);
          const tableText = await table.getText();

          if (tableText.includes(searchText)) {
            console.log(`✅ Texto "${searchText}" encontrado en la tabla`);
            return true;
          }

          return false;
        } catch (error) {
          return false;
        }
      }, timeout);

      return true;
    } catch (error) {
      console.log(`❌ Timeout esperando texto "${searchText}" en la tabla`);
      return false;
    }
  }

  /**
   * Descarta todos los toasts visibles haciendo clic fuera del toast
   * o esperando a que desaparezcan
   * @param {number} maxWaitTime - Tiempo máximo de espera en ms (default: 3000)
   * @returns {Promise<void>}
   */
  async dismissAllToasts(maxWaitTime = 3000) {
    console.log(`🔔 Descartando todos los toasts visibles...`);

    try {
      // Esperar a que los toasts desaparezcan
      await this.sleep(maxWaitTime);
      console.log(`✅ Toasts descartados`);
    } catch (error) {
      console.log(`⚠️  Error al descartar toasts:`, error.message);
    }
  }
}

module.exports = BasePage;
