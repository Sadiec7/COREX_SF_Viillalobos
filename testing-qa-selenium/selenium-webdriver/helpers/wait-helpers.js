// wait-helpers.js - Helpers para esperas explícitas

const { until, By } = require('selenium-webdriver');
const config = require('../config/selenium.config');

/**
 * Espera a que un elemento esté presente en el DOM
 * @param {WebDriver} driver
 * @param {By} locator
 * @param {number} timeout - Opcional, por defecto usa config.defaultTimeout
 * @returns {Promise<WebElement>}
 */
async function waitForElement(driver, locator, timeout = config.defaultTimeout) {
  try {
    const element = await driver.wait(until.elementLocated(locator), timeout);
    console.log(`✅ Elemento encontrado: ${locator}`);
    return element;
  } catch (error) {
    console.error(`❌ Timeout esperando elemento: ${locator}`);
    throw error;
  }
}

/**
 * Espera a que un elemento sea visible
 * @param {WebDriver} driver
 * @param {By} locator
 * @param {number} timeout
 * @returns {Promise<WebElement>}
 */
async function waitForVisible(driver, locator, timeout = config.defaultTimeout) {
  try {
    const element = await waitForElement(driver, locator, timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    console.log(`✅ Elemento visible: ${locator}`);
    return element;
  } catch (error) {
    console.error(`❌ Timeout esperando visibilidad: ${locator}`);
    throw error;
  }
}

/**
 * Espera a que un elemento sea clickeable
 * @param {WebDriver} driver
 * @param {By} locator
 * @param {number} timeout
 * @returns {Promise<WebElement>}
 */
async function waitForClickable(driver, locator, timeout = config.defaultTimeout) {
  try {
    const element = await waitForVisible(driver, locator, timeout);
    await driver.wait(until.elementIsEnabled(element), timeout);
    console.log(`✅ Elemento clickeable: ${locator}`);
    return element;
  } catch (error) {
    console.error(`❌ Timeout esperando clickeable: ${locator}`);
    throw error;
  }
}

/**
 * Espera a que el texto de un elemento coincida
 * @param {WebDriver} driver
 * @param {By} locator
 * @param {string} text
 * @param {number} timeout
 * @returns {Promise<boolean>}
 */
async function waitForText(driver, locator, text, timeout = config.defaultTimeout) {
  try {
    const element = await waitForElement(driver, locator, timeout);
    await driver.wait(until.elementTextIs(element, text), timeout);
    console.log(`✅ Texto encontrado: "${text}" en ${locator}`);
    return true;
  } catch (error) {
    console.error(`❌ Timeout esperando texto "${text}" en: ${locator}`);
    throw error;
  }
}

/**
 * Espera a que un elemento contenga cierto texto
 * @param {WebDriver} driver
 * @param {By} locator
 * @param {string} text
 * @param {number} timeout
 * @returns {Promise<boolean>}
 */
async function waitForTextContains(driver, locator, text, timeout = config.defaultTimeout) {
  try {
    const element = await waitForElement(driver, locator, timeout);
    await driver.wait(until.elementTextContains(element, text), timeout);
    console.log(`✅ Texto "${text}" encontrado en ${locator}`);
    return true;
  } catch (error) {
    console.error(`❌ Timeout esperando texto que contenga "${text}" en: ${locator}`);
    throw error;
  }
}

/**
 * Espera a que la URL contenga cierto texto
 * @param {WebDriver} driver
 * @param {string} urlPart
 * @param {number} timeout
 * @returns {Promise<boolean>}
 */
async function waitForUrlContains(driver, urlPart, timeout = config.defaultTimeout) {
  try {
    await driver.wait(until.urlContains(urlPart), timeout);
    const currentUrl = await driver.getCurrentUrl();
    console.log(`✅ URL contiene "${urlPart}": ${currentUrl}`);
    return true;
  } catch (error) {
    console.error(`❌ Timeout esperando URL que contenga: ${urlPart}`);
    throw error;
  }
}

/**
 * Espera a que un elemento desaparezca del DOM
 * @param {WebDriver} driver
 * @param {By} locator
 * @param {number} timeout
 * @returns {Promise<boolean>}
 */
async function waitForElementGone(driver, locator, timeout = config.defaultTimeout) {
  try {
    await driver.wait(until.stalenessOf(await driver.findElement(locator)), timeout);
    console.log(`✅ Elemento desapareció: ${locator}`);
    return true;
  } catch (error) {
    // Si no encuentra el elemento, está bien (ya desapareció)
    console.log(`✅ Elemento no presente: ${locator}`);
    return true;
  }
}

/**
 * Espera un tiempo fijo (usar solo cuando sea absolutamente necesario)
 * @param {number} ms - Milisegundos
 */
async function sleep(ms) {
  console.log(`⏳ Esperando ${ms}ms...`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  waitForElement,
  waitForVisible,
  waitForClickable,
  waitForText,
  waitForTextContains,
  waitForUrlContains,
  waitForElementGone,
  sleep
};
