// LoginPage.js - Page Object para la vista de login

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Page Object para la vista de Login
 * Representa los elementos y acciones disponibles en la página de autenticación
 */
class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Localizadores de elementos
    this.locators = {
      // Campos de entrada
      usernameInput: By.id('userInput'),
      passwordInput: By.id('passInput'),
      rememberCheckbox: By.id('remember'),

      // Botones
      loginButton: By.id('loginButton'),
      buttonText: By.id('buttonText'),
      buttonLoader: By.id('buttonLoader'),

      // Mensajes
      errorMessage: By.id('errorMessage'),
      errorText: By.id('errorText'),
      successMessage: By.id('successMessage'),
      successText: By.id('successText'),

      // Enlaces
      forgotPasswordLink: By.linkText('¿Olvidaste tu contraseña?'),

      // Otros elementos
      loginForm: By.id('loginForm'),
      companyLogo: By.css('img[alt="Seguros Fianzas VILLALOBOS"]'),
      pageTitle: By.css('h1')
    };
  }

  // ========== MÉTODOS DE NAVEGACIÓN ==========

  /**
   * No necesitamos método open() porque Electron se abre automáticamente en login
   * Pero lo dejamos por si se necesita forzar navegación
   */
  async waitForPageLoad() {
    await this.waitForVisible(this.locators.loginForm);
    console.log('✅ Página de login cargada');
  }

  // ========== MÉTODOS DE INTERACCIÓN ==========

  /**
   * Ingresa el nombre de usuario
   * @param {string} username
   */
  async enterUsername(username) {
    await this.type(this.locators.usernameInput, username);
  }

  /**
   * Ingresa la contraseña
   * @param {string} password
   */
  async enterPassword(password) {
    await this.type(this.locators.passwordInput, password);
  }

  /**
   * Marca o desmarca el checkbox "Recordar sesión"
   * @param {boolean} check
   */
  async setRememberMe(check = true) {
    const checkbox = await this.findById('remember');
    const isChecked = await checkbox.isSelected();

    if ((check && !isChecked) || (!check && isChecked)) {
      await this.click(this.locators.rememberCheckbox);
      console.log(`✅ Checkbox "Recordar sesión" ${check ? 'marcado' : 'desmarcado'}`);
    }
  }

  /**
   * Hace clic en el botón de login
   */
  async clickLoginButton() {
    await this.click(this.locators.loginButton);
  }

  /**
   * Hace clic en "¿Olvidaste tu contraseña?"
   */
  async clickForgotPassword() {
    await this.click(this.locators.forgotPasswordLink);
  }

  /**
   * Limpia el campo de usuario
   */
  async clearUsername() {
    await this.clear(this.locators.usernameInput);
  }

  /**
   * Limpia el campo de contraseña
   */
  async clearPassword() {
    await this.clear(this.locators.passwordInput);
  }

  // ========== MÉTODOS DE ACCIÓN COMPLETA ==========

  /**
   * Realiza el login completo con usuario y contraseña
   * @param {string} username
   * @param {string} password
   * @param {boolean} rememberMe
   */
  async login(username, password, rememberMe = false) {
    console.log(`🔐 Intentando login con usuario: ${username}`);

    await this.clearUsername();
    await this.enterUsername(username);

    await this.clearPassword();
    await this.enterPassword(password);

    if (rememberMe) {
      await this.setRememberMe(true);
    }

    await this.clickLoginButton();
    console.log('✅ Formulario de login enviado');
  }

  /**
   * Intenta hacer login dejando campos vacíos
   * @param {boolean} emptyUsername - Si true, deja usuario vacío
   * @param {boolean} emptyPassword - Si true, deja password vacío
   */
  async loginWithEmptyFields(emptyUsername = true, emptyPassword = true) {
    console.log('🔐 Intentando login con campos vacíos');

    if (!emptyUsername) {
      await this.enterUsername('admin');
    } else {
      await this.clearUsername();
    }

    if (!emptyPassword) {
      await this.enterPassword('admin123');
    } else {
      await this.clearPassword();
    }

    await this.clickLoginButton();
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========

  /**
   * Verifica si el mensaje de error está visible
   * @returns {Promise<boolean>}
   */
  async isErrorMessageDisplayed() {
    return await this.isElementVisible(this.locators.errorMessage);
  }

  /**
   * Obtiene el texto del mensaje de error
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    if (await this.isErrorMessageDisplayed()) {
      return await this.getText(this.locators.errorText);
    }
    return '';
  }

  /**
   * Verifica si el mensaje de éxito está visible
   * @returns {Promise<boolean>}
   */
  async isSuccessMessageDisplayed() {
    return await this.isElementVisible(this.locators.successMessage);
  }

  /**
   * Obtiene el texto del mensaje de éxito
   * @returns {Promise<string>}
   */
  async getSuccessMessage() {
    if (await this.isSuccessMessageDisplayed()) {
      return await this.getText(this.locators.successText);
    }
    return '';
  }

  /**
   * Verifica si el botón de login está habilitado
   * @returns {Promise<boolean>}
   */
  async isLoginButtonEnabled() {
    return await this.isElementEnabled(this.locators.loginButton);
  }

  /**
   * Verifica si el loader está visible (indicando proceso en curso)
   * @returns {Promise<boolean>}
   */
  async isLoaderVisible() {
    try {
      const loader = await this.driver.findElement(this.locators.buttonLoader);
      const classes = await loader.getAttribute('class');
      return !classes.includes('hidden');
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene el título de la página
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return await this.getText(this.locators.pageTitle);
  }

  /**
   * Verifica si el logo está visible
   * @returns {Promise<boolean>}
   */
  async isLogoVisible() {
    return await this.isElementVisible(this.locators.companyLogo);
  }

  /**
   * Verifica si el checkbox "Recordar sesión" está marcado
   * @returns {Promise<boolean>}
   */
  async isRememberMeChecked() {
    return await this.isChecked(this.locators.rememberCheckbox);
  }

  /**
   * Obtiene el valor del campo de usuario
   * @returns {Promise<string>}
   */
  async getUsernameValue() {
    return await this.getValue(this.locators.usernameInput);
  }

  /**
   * Obtiene el valor del campo de contraseña
   * @returns {Promise<string>}
   */
  async getPasswordValue() {
    return await this.getValue(this.locators.passwordInput);
  }

  /**
   * Verifica si un campo está marcado como inválido (HTML5 validation)
   * @param {string} fieldId - 'userInput' o 'passInput'
   * @returns {Promise<boolean>}
   */
  async isFieldInvalid(fieldId) {
    const field = await this.driver.findElement(By.id(fieldId));
    const validationMessage = await field.getAttribute('validationMessage');
    return validationMessage !== '';
  }

  /**
   * Obtiene el mensaje de validación HTML5 de un campo
   * @param {string} fieldId
   * @returns {Promise<string>}
   */
  async getValidationMessage(fieldId) {
    const field = await this.driver.findElement(By.id(fieldId));
    return await field.getAttribute('validationMessage');
  }

  // ========== MÉTODOS DE ESPERA ==========

  /**
   * Espera a que aparezca un mensaje de error
   * @param {number} timeout
   */
  async waitForErrorMessage(timeout = 5000) {
    await this.waitForVisible(this.locators.errorMessage, timeout);
    console.log('⚠️  Mensaje de error visible');
  }

  /**
   * Espera a que aparezca un mensaje de éxito
   * @param {number} timeout
   */
  async waitForSuccessMessage(timeout = 5000) {
    await this.waitForVisible(this.locators.successMessage, timeout);
    console.log('✅ Mensaje de éxito visible');
  }

  /**
   * Espera a que el loader desaparezca
   * @param {number} timeout
   */
  async waitForLoaderGone(timeout = 10000) {
    const startTime = Date.now();
    while (await this.isLoaderVisible()) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout esperando que el loader desaparezca');
      }
      await this.sleep(100);
    }
    console.log('✅ Loader desapareció');
  }

  /**
   * Espera a que se redirija a la vista principal (app_view.html)
   * @param {number} timeout
   */
  async waitForRedirection(timeout = 10000) {
    await this.waitForUrl('app_view.html', timeout);
    console.log('✅ Redirigido a la vista principal');
  }

  // ========== MÉTODOS DE VALIDACIÓN DE NEGOCIO ==========

  /**
   * Verifica que el login fue exitoso comprobando la redirección
   * @returns {Promise<boolean>}
   */
  async isLoginSuccessful() {
    try {
      const currentUrl = await this.getCurrentUrl();
      const success = currentUrl.includes('app_view.html');
      console.log(`🔍 Login ${success ? 'exitoso' : 'fallido'}`);
      return success;
    } catch (error) {
      console.error('❌ Error verificando login exitoso:', error.message);
      return false;
    }
  }

  /**
   * Verifica que el login falló comprobando que sigue en login_view.html
   * @returns {Promise<boolean>}
   */
  async isLoginFailed() {
    try {
      const currentUrl = await this.getCurrentUrl();
      const failed = currentUrl.includes('login_view.html');
      console.log(`🔍 Login ${failed ? 'falló' : 'exitoso'}`);
      return failed;
    } catch (error) {
      console.error('❌ Error verificando login fallido:', error.message);
      return false;
    }
  }

  /**
   * Verifica que el input de contraseña esté enmascarado (type="password")
   * @returns {Promise<boolean>}
   */
  async isPasswordMasked() {
    const type = await this.getAttribute(this.locators.passwordInput, 'type');
    return type === 'password';
  }
}

module.exports = LoginPage;
