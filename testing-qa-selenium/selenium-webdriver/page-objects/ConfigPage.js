// ConfigPage.js - Page Object para el módulo de Configuración

const { By, Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class ConfigPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators - Sección Cuenta
    this.locators = {
      // Navegación
      configNav: By.css('a[data-view="config"]'),

      // Formulario de Cuenta
      accountForm: By.id('accountForm'),
      displayNameInput: By.id('displayNameInput'),
      usernameInput: By.id('usernameInput'),
      emailInput: By.id('emailInput'),
      accountSubmitBtn: By.css('#accountForm button[type="submit"]'),
      accountStatus: By.id('accountStatus'),

      // Formulario de Seguridad
      securityForm: By.id('securityForm'),
      currentPasswordInput: By.id('currentPasswordInput'),
      newPasswordInput: By.id('newPasswordInput'),
      confirmPasswordInput: By.id('confirmPasswordInput'),
      securitySubmitBtn: By.css('#securityForm button[type="submit"]'),
      securityStatus: By.id('securityStatus'),

      // UI Elements
      sidebarUserName: By.id('userName'),
      welcomeUser: By.id('welcomeUser')
    };
  }

  // ========== NAVEGACIÓN ==========

  async navigateToConfig() {
    console.log('📍 Navegando a sección de Configuración...');
    await this.click(this.locators.configNav);
    await this.sleep(1500);
    console.log('✅ Vista de Configuración cargada');
  }

  async waitForPageLoad() {
    await this.waitForElement(this.locators.accountForm, 10000);
    await this.sleep(1000);
  }

  // ========== HELPERS INTERNOS ==========

  async getFieldValue(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.getAttribute('value') || '';
    } catch (e) {
      return '';
    }
  }

  async clearAndType(locator, value) {
    const element = await this.driver.findElement(locator);
    await element.clear();
    // Siempre enviar el valor, incluso si es string vacío
    // Esto asegura que el campo quede explícitamente vacío
    if (value !== undefined && value !== null) {
      await element.sendKeys(String(value));
    }
    await this.sleep(300);
  }

  // ========== CUENTA ==========

  async getDisplayName() {
    return await this.getFieldValue(this.locators.displayNameInput);
  }

  async setDisplayName(value) {
    console.log(`⌨️  Seteando displayName: "${value}"`);
    await this.clearAndType(this.locators.displayNameInput, value);
  }

  async getUsername() {
    return await this.getFieldValue(this.locators.usernameInput);
  }

  async setUsername(value) {
    console.log(`⌨️  Seteando username: "${value}"`);
    await this.clearAndType(this.locators.usernameInput, value);
  }

  async getEmail() {
    return await this.getFieldValue(this.locators.emailInput);
  }

  async setEmail(value) {
    console.log(`⌨️  Seteando email: "${value}"`);
    await this.clearAndType(this.locators.emailInput, value);
  }

  async submitAccountForm() {
    console.log('💾 Enviando formulario de cuenta...');

    // Limpiar mensaje de estado anterior
    try {
      await this.driver.executeScript(`
        const statusEl = document.getElementById('accountStatus');
        if (statusEl) {
          statusEl.textContent = '';
          statusEl.className = 'hidden';
        }
      `);
    } catch (e) {
      // Ignorar si falla
    }

    await this.click(this.locators.accountSubmitBtn);
    await this.sleep(1000);
  }

  async getAccountStatusMessage() {
    try {
      const element = await this.driver.findElement(this.locators.accountStatus);
      const classes = await element.getAttribute('class');

      if (classes.includes('hidden')) {
        return null;
      }

      const text = await element.getText();
      return text;
    } catch (e) {
      return null;
    }
  }

  async isAccountStatusVisible() {
    try {
      const element = await this.driver.findElement(this.locators.accountStatus);
      const classes = await element.getAttribute('class');
      return !classes.includes('hidden');
    } catch (e) {
      return false;
    }
  }

  // ========== SEGURIDAD ==========

  async setCurrentPassword(value) {
    console.log('⌨️  Ingresando contraseña actual');
    await this.clearAndType(this.locators.currentPasswordInput, value);
  }

  async setNewPassword(value) {
    console.log('⌨️  Ingresando nueva contraseña');
    await this.clearAndType(this.locators.newPasswordInput, value);
  }

  async setConfirmPassword(value) {
    console.log('⌨️  Confirmando nueva contraseña');
    await this.clearAndType(this.locators.confirmPasswordInput, value);
  }

  async submitSecurityForm() {
    console.log('💾 Enviando formulario de seguridad...');

    // Limpiar mensaje de estado anterior
    try {
      await this.driver.executeScript(`
        const statusEl = document.getElementById('securityStatus');
        if (statusEl) {
          statusEl.textContent = '';
          statusEl.className = 'hidden';
        }
      `);
    } catch (e) {
      // Ignorar si falla
    }

    await this.click(this.locators.securitySubmitBtn);
    await this.sleep(1000);
  }

  async getSecurityStatusMessage() {
    try {
      const element = await this.driver.findElement(this.locators.securityStatus);
      const classes = await element.getAttribute('class');

      if (classes.includes('hidden')) {
        return null;
      }

      const text = await element.getText();
      return text;
    } catch (e) {
      return null;
    }
  }

  async isSecurityStatusVisible() {
    try {
      const element = await this.driver.findElement(this.locators.securityStatus);
      const classes = await element.getAttribute('class');
      return !classes.includes('hidden');
    } catch (e) {
      return false;
    }
  }

  async arePasswordFieldsEmpty() {
    const current = await this.getFieldValue(this.locators.currentPasswordInput);
    const newPass = await this.getFieldValue(this.locators.newPasswordInput);
    const confirm = await this.getFieldValue(this.locators.confirmPasswordInput);

    return current === '' && newPass === '' && confirm === '';
  }

  // ========== UI UPDATES ==========

  async getSidebarUserName() {
    try {
      // Esperar a que el DOM se actualice completamente
      await this.sleep(1500);
      const element = await this.driver.findElement(this.locators.sidebarUserName);
      return await element.getText();
    } catch (e) {
      return null;
    }
  }

  async getWelcomeUserName() {
    try {
      // Navegar al dashboard para ver el saludo
      const dashboardNav = By.css('a[data-view="dashboard"]');
      await this.click(dashboardNav);
      await this.sleep(1000);

      const element = await this.driver.findElement(this.locators.welcomeUser);
      const text = await element.getText();

      // Volver a config
      await this.navigateToConfig();

      return text;
    } catch (e) {
      return null;
    }
  }

  // ========== HELPERS ==========

  async updateAccountInfo(displayName, username, email) {
    if (displayName) await this.setDisplayName(displayName);
    if (username) await this.setUsername(username);
    if (email !== undefined) await this.setEmail(email);
    await this.submitAccountForm();
  }

  async changePassword(currentPassword, newPassword, confirmPassword) {
    await this.setCurrentPassword(currentPassword);
    await this.setNewPassword(newPassword);
    await this.setConfirmPassword(confirmPassword || newPassword);
    await this.submitSecurityForm();
  }
}

console.log('✅ ConfigPage class loaded successfully');

module.exports = ConfigPage;
