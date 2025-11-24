// AseguradorasPage.js - Page Object para el módulo de Aseguradoras

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const { waitForVisible } = require('../helpers/wait-helpers');

class AseguradorasPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      // Búsqueda y acciones
      searchInput: By.id('searchAseguradoras'),
      btnAddAseguradora: By.id('btnAddAseguradora'),

      // Stats (si aplica)
      statTotal: By.id('statTotal'),

      // Tabla
      aseguradorasTableBody: By.id('aseguradorasTableBody'),
      emptyState: By.id('emptyState'),
      loadingState: By.id('loadingState'),

      // Paginación
      paginationContainer: By.id('paginationContainer'),

      // Modal
      modalAseguradora: By.id('modalAseguradora'),
      modalTitle: By.id('modalTitle'),
      btnCloseModal: By.id('btnCloseModal'),
      formAseguradora: By.id('formAseguradora'),

      // Campos del formulario
      inputNombre: By.id('inputNombre'),
      inputActivo: By.id('inputActivo'),

      // Botones del formulario
      btnCancelForm: By.id('btnCancelForm'),
      btnSubmitForm: By.css('#formAseguradora button[type="submit"]')
    };
  }

  async closeAllModals() {
    // Intentar cerrar cualquier modal abierto presionando ESC o haciendo clic en el overlay
    try {
      for (let i = 0; i < 3; i++) {
        try {
          // Buscar modal activo
          const modal = await this.driver.findElement(By.css('.modal.active, #modalAseguradora.active'));
          const closeBtn = await modal.findElement(By.css('button[id*="Close"], button.close, [aria-label="Close"]'));
          await closeBtn.click();
          await this.sleep(500);
        } catch (e) {
          // No hay modal activo
          break;
        }
      }
    } catch (e) {
      // Ignorar errores
    }
  }

  async navigateToAseguradoras() {
    console.log('📍 Navegando a sección de Aseguradoras...');

    // Cerrar cualquier modal abierto
    await this.closeAllModals();
    await this.sleep(500);

    // Verificar si el menú de catálogos está expandido
    const catalogosParent = By.id('catalogosParent');
    const catalogosSubmenu = By.id('catalogosSubmenu');

    try {
      const submenu = await this.driver.findElement(catalogosSubmenu);
      const classes = await submenu.getAttribute('class');

      // Si el submenu no tiene la clase 'active', expandirlo
      if (!classes.includes('active')) {
        await this.click(catalogosParent);
        await this.sleep(500);
      }
    } catch (e) {
      // Si no se encuentra el submenu, intentar expandir
      try {
        await this.click(catalogosParent);
        await this.sleep(500);
      } catch (err) {
        // Ignorar si falla
      }
    }

    // Luego hacer clic en Aseguradoras
    const navLink = By.css('a[data-view="aseguradoras"]');
    await this.click(navLink);
    await this.sleep(800);
    console.log('✅ Vista de Aseguradoras cargada');
  }

  async waitForPageLoad() {
    await this.sleep(1000);
  }

  async openNewAseguradoraModal() {
    console.log('🆕 Abriendo modal de nueva aseguradora...');
    await this.dismissAllToasts(2000);

    try {
      await this.driver.executeScript(`
        document.querySelectorAll('#loading-overlay').forEach(el => el.classList.add('hidden'));
        const content = document.querySelector('#contentView');
        if (content) content.classList.remove('loading');
      `);
    } catch (e) {
      // ignore
    }

    await this.clickWithRetry(this.locators.btnAddAseguradora, 3, 1000);
    await waitForVisible(this.driver, this.locators.modalAseguradora);
    await this.sleep(500);
    console.log('✅ Modal de nueva aseguradora abierto');
  }

  async closeModal() {
    await this.dismissAllToasts(2000);
    await this.clickWithRetry(this.locators.btnCloseModal, 3, 500);
    await this.sleep(500);
  }

  async isModalVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalAseguradora);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (error) {
      return false;
    }
  }

  async fillAseguradoraForm(data) {
    console.log('📝 Llenando formulario de aseguradora...');

    if (data.nombre) {
      await this.type(this.locators.inputNombre, data.nombre);
    }

    // inputActivo no existe en el formulario (todas las aseguradoras se crean activas por defecto)

    console.log('✅ Formulario llenado correctamente');
  }

  async submitForm() {
    console.log('💾 Enviando formulario...');
    await this.click(this.locators.btnSubmitForm);
  }

  async cancelForm() {
    await this.click(this.locators.btnCancelForm);
    await this.sleep(300);
  }

  async createAseguradora(data) {
    await this.openNewAseguradoraModal();
    await this.fillAseguradoraForm(data);
    await this.submitForm();
    await this.sleep(1000);

    // Cerrar el modal si sigue abierto usando JavaScript directo
    try {
      await this.driver.executeScript(`
        const modal = document.getElementById('modalAseguradora');
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      `);
    } catch (e) {
      // Ignorar errores
    }
    await this.sleep(500);
  }

  async search(searchText) {
    console.log(`🔍 Buscando: "${searchText}"`);
    await this.type(this.locators.searchInput, searchText);
    await this.sleep(500);
  }

  async clearSearch() {
    const searchInput = await this.driver.findElement(this.locators.searchInput);
    await searchInput.clear();
    await this.driver.executeScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", searchInput);
    await this.sleep(1000);
  }

  async getTableRowCount() {
    try {
      const tbody = await this.driver.findElement(this.locators.aseguradorasTableBody);
      const rows = await tbody.findElements(By.css('tr'));
      return rows.length;
    } catch (error) {
      return 0;
    }
  }

  async aseguradoraExistsInTable(nombre) {
    console.log(`🔎 Verificando si existe aseguradora: ${nombre}`);
    try {
      await this.search(nombre);
      await this.sleep(500);

      const tbody = await this.driver.findElement(this.locators.aseguradorasTableBody);
      const rows = await tbody.findElements(By.css('tr'));

      for (const row of rows) {
        const text = await row.getText();
        if (text.includes(nombre)) {
          console.log(`✅ Aseguradora encontrada: ${nombre}`);
          return true;
        }
      }

      console.log(`❌ Aseguradora no encontrada: ${nombre}`);
      return false;
    } catch (error) {
      return false;
    }
  }

  async clickEditAseguradora(nombre) {
    console.log(`✏️ Editando aseguradora: ${nombre}`);
    await this.search(nombre);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.aseguradorasTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(nombre)) {
        // Buscar el botón de editar por su title
        const editBtn = await row.findElement(By.css('button[title="Editar"]'));
        await editBtn.click();
        await this.sleep(1000);
        return;
      }
    }
  }

  async clickDeleteAseguradora(nombre) {
    console.log(`🗑️ Eliminando aseguradora: ${nombre}`);
    await this.search(nombre);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.aseguradorasTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(nombre)) {
        // Buscar el botón de eliminar por su title
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

  async clickActivarDesactivar(nombre) {
    console.log(`🔄 Activando/Desactivando aseguradora: ${nombre}`);
    await this.search(nombre);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.aseguradorasTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(nombre)) {
        // Buscar el botón de activar/desactivar (es el botón entre editar y eliminar)
        const buttons = await row.findElements(By.css('button'));
        // El segundo botón es el de toggle (0=editar, 1=toggle, 2=eliminar)
        if (buttons.length >= 2) {
          await buttons[1].click();
          await this.sleep(1000);

          // Manejar el modal de confirmación
          try {
            const confirmBtn = await this.driver.findElement(By.id('confirm-modal-confirm'));
            await confirmBtn.click();
            await this.sleep(1000);
          } catch (e) {
            console.log('No se encontró modal de confirmación para activar/desactivar');
          }
          return;
        }
      }
    }
  }

  async getAseguradoraEstado(nombre) {
    await this.search(nombre);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.aseguradorasTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(nombre)) {
        // Buscar el badge de estado
        try {
          const badge = await row.findElement(By.css('.status-badge, .badge'));
          const badgeText = await badge.getText();
          return badgeText.toLowerCase().includes('activ') ? 'activo' : 'inactivo';
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  async getFieldValue(fieldLocator) {
    try {
      const field = await this.driver.findElement(fieldLocator);
      return await field.getAttribute('value');
    } catch (error) {
      return '';
    }
  }
}

module.exports = AseguradorasPage;
