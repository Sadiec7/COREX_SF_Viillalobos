// PolizasPage.js - Page Object para la gestión de Pólizas

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const { waitForVisible, waitForClickable } = require('../helpers/wait-helpers');

class PolizasPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      // Búsqueda y acciones
      searchPolizas: By.id('searchPolizas'),
      btnOpenFilters: By.id('btnOpenFilters'),
      btnAddPoliza: By.id('btnAddPoliza'),

      // Stats
      statTotal: By.id('statTotal'),
      statVigentes: By.id('statVigentes'),
      statPorVencer: By.id('statPorVencer'),
      statVencidas: By.id('statVencidas'),

      // Tabla
      polizasTableBody: By.id('polizasTableBody'),
      emptyState: By.id('emptyState'),
      loadingState: By.id('loadingState'),

      // Modal
      modalPoliza: By.id('modalPoliza'),
      modalTitle: By.id('modalTitle'),
      btnCloseModal: By.id('btnCloseModal'),
      formPoliza: By.id('formPoliza'),

      // Campos del formulario
      inputNumero: By.id('inputNumero'),
      inputCliente: By.id('inputCliente'),
      inputAseguradora: By.id('inputAseguradora'),
      inputRamo: By.id('inputRamo'),
      inputTipoPoliza: By.id('inputTipoPoliza'),
      inputFechaInicio: By.id('inputFechaInicio'),
      inputFechaFin: By.id('inputFechaFin'),
      inputPrimaNeta: By.id('inputPrimaNeta'),
      inputPrima: By.id('inputPrima'),
      inputComision: By.id('inputComision'),
      inputPeriodicidad: By.id('inputPeriodicidad'),
      inputMetodoPago: By.id('inputMetodoPago'),
      inputSumaAsegurada: By.id('inputSumaAsegurada'),
      inputNotas: By.id('inputNotas'),

      // Botones
      btnCancelForm: By.id('btnCancelForm'),
      btnSubmitForm: By.css('#formPoliza button[type="submit"]')
    };
  }

  async navigateToPolizas() {
    console.log('📍 Navegando a sección de Pólizas...');
    const navLink = By.css('a[data-view="polizas"]');
    await this.click(navLink);
    await this.sleep(1500); // Dar tiempo a la transición
    console.log('✅ Vista de Pólizas cargada');
  }

  async waitForPageLoad() {
    await this.sleep(1000); // Dar tiempo a que se carguen los datos
  }

  async openNewPolizaModal() {
    console.log('🆕 Abriendo modal de nueva póliza...');
    await this.click(this.locators.btnAddPoliza);
    await waitForVisible(this.driver, this.locators.modalPoliza);
    await this.sleep(500);
    console.log('✅ Modal de nueva póliza abierto');
  }

  async closeModal() {
    // Esperar a que desaparezcan toasts que puedan bloquear el botón
    await this.sleep(2000);
    await this.click(this.locators.btnCloseModal);
    await this.sleep(500);
  }

  async isModalVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalPoliza);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (error) {
      return false;
    }
  }

  async fillPolizaForm(polizaData) {
    console.log('📝 Llenando formulario de póliza...');

    if (polizaData.numero_poliza) {
      await this.type(this.locators.inputNumero, polizaData.numero_poliza);
    }

    // Seleccionar primer cliente disponible
    if (polizaData.cliente_id || polizaData.selectFirstClient) {
      const clienteSelect = await this.driver.findElement(this.locators.inputCliente);
      const options = await clienteSelect.findElements(By.css('option'));
      if (options.length > 1) {
        await options[1].click(); // Seleccionar primer cliente (skip "Seleccionar...")
      }
    }

    // Seleccionar primera aseguradora disponible
    if (polizaData.aseguradora_id || polizaData.selectFirstAseguradora) {
      const asegSelect = await this.driver.findElement(this.locators.inputAseguradora);
      const options = await asegSelect.findElements(By.css('option'));
      if (options.length > 1) {
        await options[1].click();
      }
    }

    // Seleccionar primer ramo disponible
    if (polizaData.ramo_id || polizaData.selectFirstRamo) {
      const ramoSelect = await this.driver.findElement(this.locators.inputRamo);
      const options = await ramoSelect.findElements(By.css('option'));
      if (options.length > 1) {
        await options[1].click();
      }
    }

    if (polizaData.fecha_inicio) {
      await this.type(this.locators.inputFechaInicio, polizaData.fecha_inicio);
    }

    if (polizaData.fecha_fin) {
      await this.type(this.locators.inputFechaFin, polizaData.fecha_fin);
    }

    if (polizaData.prima_neta) {
      await this.type(this.locators.inputPrimaNeta, polizaData.prima_neta);
    }

    if (polizaData.prima_total) {
      await this.type(this.locators.inputPrima, polizaData.prima_total);
    }

    // Seleccionar primera periodicidad disponible
    if (polizaData.periodicidad_pago_id || polizaData.selectFirstPeriodicidad) {
      const periSelect = await this.driver.findElement(this.locators.inputPeriodicidad);
      const options = await periSelect.findElements(By.css('option'));
      if (options.length > 1) {
        await options[1].click();
      }
    }

    // Seleccionar primer método de pago disponible
    if (polizaData.metodo_pago_id || polizaData.selectFirstMetodoPago) {
      const metodoSelect = await this.driver.findElement(this.locators.inputMetodoPago);
      const options = await metodoSelect.findElements(By.css('option'));
      if (options.length > 1) {
        await options[1].click();
      }
    }

    if (polizaData.suma_asegurada) {
      await this.type(this.locators.inputSumaAsegurada, polizaData.suma_asegurada);
    }

    if (polizaData.notas) {
      await this.type(this.locators.inputNotas, polizaData.notas);
    }

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

  async createPoliza(polizaData) {
    await this.openNewPolizaModal();
    await this.fillPolizaForm(polizaData);
    await this.submitForm();
    await this.sleep(2000);
  }

  async search(searchText) {
    console.log(`🔍 Buscando: "${searchText}"`);
    await this.type(this.locators.searchPolizas, searchText);
    await this.sleep(500);
  }

  async clearSearch() {
    const searchInput = await this.driver.findElement(this.locators.searchPolizas);
    await searchInput.clear();
    // Disparar evento 'input' para que el filtro se actualice
    await this.driver.executeScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", searchInput);
    await this.sleep(1000);
  }

  async getTotalPolizas() {
    const text = await this.getText(this.locators.statTotal);
    return parseInt(text);
  }

  async getTotalVigentes() {
    const text = await this.getText(this.locators.statVigentes);
    return parseInt(text);
  }

  async getTotalPorVencer() {
    const text = await this.getText(this.locators.statPorVencer);
    return parseInt(text);
  }

  async getTotalVencidas() {
    const text = await this.getText(this.locators.statVencidas);
    return parseInt(text);
  }

  async getTableRowCount() {
    try {
      const tbody = await this.driver.findElement(this.locators.polizasTableBody);
      const rows = await tbody.findElements(By.css('tr'));
      return rows.length;
    } catch (error) {
      return 0;
    }
  }

  async polizaExistsInTable(numeroPoliza) {
    console.log(`🔎 Verificando si existe póliza: ${numeroPoliza}`);
    try {
      const tbody = await this.driver.findElement(this.locators.polizasTableBody);
      const rows = await tbody.findElements(By.css('tr'));

      for (const row of rows) {
        const text = await row.getText();
        if (text.includes(numeroPoliza)) {
          console.log(`✅ Póliza encontrada en tabla: ${numeroPoliza}`);
          return true;
        }
      }

      console.log(`❌ Póliza no encontrada en tabla: ${numeroPoliza}`);
      return false;
    } catch (error) {
      return false;
    }
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

module.exports = PolizasPage;
