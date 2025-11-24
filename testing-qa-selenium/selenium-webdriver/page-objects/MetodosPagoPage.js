// MetodosPagoPage.js - Page Object para el módulo de Métodos de Pago

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const { waitForVisible } = require('../helpers/wait-helpers');

class MetodosPagoPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      searchInput: By.id('searchMetodosPago'),
      btnAddMetodoPago: By.id('btnAddMetodoPago'),
      tableBody: By.id('metodosPagoTableBody'),
      emptyState: By.id('emptyState'),
      modal: By.id('modalMetodoPago'),
      modalTitle: By.id('modalTitle'),
      btnCloseModal: By.id('btnCloseModal'),
      form: By.id('formMetodoPago'),
      inputNombre: By.id('inputNombre'),
      btnCancelForm: By.id('btnCancelForm'),
      btnSubmitForm: By.css('#formMetodoPago button[type="submit"]')
    };
  }

  async closeAllModals() {
    try {
      for (let i = 0; i < 3; i++) {
        try {
          const modal = await this.driver.findElement(By.css('.modal.active, #modalMetodoPago.active'));
          const closeBtn = await modal.findElement(By.css('button[id*="Close"], button.close, [aria-label="Close"]'));
          await closeBtn.click();
          await this.sleep(500);
        } catch (e) {
          break;
        }
      }
    } catch (e) {}
  }

  async navigateToMetodosPago() {
    console.log('📍 Navegando a Métodos de Pago...');

    await this.closeAllModals();
    await this.sleep(500);

    const catalogosParent = By.id('catalogosParent');
    const catalogosSubmenu = By.id('catalogosSubmenu');

    try {
      const submenu = await this.driver.findElement(catalogosSubmenu);
      const classes = await submenu.getAttribute('class');
      if (!classes.includes('active')) {
        await this.click(catalogosParent);
        await this.sleep(500);
      }
    } catch (e) {
      try {
        await this.click(catalogosParent);
        await this.sleep(500);
      } catch (err) {}
    }

    const navLink = By.css('a[data-view="metodos-pago"]');
    await this.click(navLink);
    await this.sleep(800);
    console.log('✅ Vista cargada');
  }

  async openNewModal() {
    await this.dismissAllToasts(2000);
    await this.clickWithRetry(this.locators.btnAddMetodoPago, 3, 1000);
    await waitForVisible(this.driver, this.locators.modal);
    await this.sleep(500);
  }

  async closeModal() {
    await this.clickWithRetry(this.locators.btnCloseModal, 3, 500);
    await this.sleep(500);
  }

  async fillForm(data) {
    if (data.nombre) {
      await this.type(this.locators.inputNombre, data.nombre);
    }
  }

  async submitForm() {
    await this.click(this.locators.btnSubmitForm);
    await this.sleep(1000);
  }

  async create(data) {
    await this.openNewModal();
    await this.fillForm(data);
    await this.submitForm();

    // Cerrar modal si sigue abierto
    try {
      await this.driver.executeScript(`
        const modal = document.getElementById('modalMetodoPago');
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      `);
    } catch (e) {}
    await this.sleep(500);
  }

  async search(text) {
    await this.type(this.locators.searchInput, text);
    await this.sleep(500);
  }

  async clearSearch() {
    const input = await this.driver.findElement(this.locators.searchInput);
    await input.clear();
    await this.driver.executeScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", input);
    await this.sleep(500);
  }

  async getTableRowCount() {
    try {
      const tbody = await this.driver.findElement(this.locators.tableBody);
      const rows = await tbody.findElements(By.css('tr'));
      return rows.length;
    } catch (error) {
      return 0;
    }
  }

  async existsInTable(nombre) {
    await this.search(nombre);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.tableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(nombre)) {
        return true;
      }
    }
    return false;
  }

  async clickEdit(nombre) {
    await this.search(nombre);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.tableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(nombre)) {
        const editBtn = await row.findElement(By.css('button[title="Editar"]'));
        await editBtn.click();
        await this.sleep(1000);
        return;
      }
    }
  }

  async clickDelete(nombre) {
    await this.search(nombre);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.tableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(nombre)) {
        const deleteBtn = await row.findElement(By.css('button[title="Eliminar"]'));
        await deleteBtn.click();
        await this.sleep(1000);

        // Manejar el modal de confirmación
        try {
          const confirmBtn = await this.driver.findElement(By.id('confirm-modal-confirm'));
          await confirmBtn.click();
          await this.sleep(1000);
        } catch (e) {
          console.log('No se encontró modal de confirmación');
        }
        return;
      }
    }
  }

  async waitForPageLoad() {
    await this.sleep(1000);
  }
}

module.exports = MetodosPagoPage;
