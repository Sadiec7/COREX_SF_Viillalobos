// DocumentosPage.js - Page Object para la gestión de Documentos

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const { waitForVisible } = require('../helpers/wait-helpers');

class DocumentosPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      // Búsqueda y acciones
      searchDocumentos: By.id('searchDocumentos'),
      btnOpenFilters: By.id('btnOpenFilters'),
      btnAddDocumento: By.id('btnAddDocumento'),

      // Bulk Actions
      bulkActions: By.id('bulkActions'),
      bulkCount: By.id('bulkCount'),
      btnSelectAll: By.id('btnSelectAll'),
      btnClearSelection: By.id('btnClearSelection'),
      btnExportSelected: By.id('btnExportSelected'),
      selectAllCheckbox: By.id('selectAllCheckbox'),

      // Stats
      statTotal: By.id('statTotal'),

      // Tabla
      documentosTableBody: By.id('documentosTableBody'),
      emptyState: By.id('emptyState'),
      loadingState: By.id('loadingState'),

      // Paginación
      paginationContainer: By.id('paginationContainer'),

      // Modal Documento
      modalDocumento: By.id('modalDocumento'),
      modalTitle: By.id('modalTitle'),
      btnCloseModal: By.id('btnCloseModal'),
      formDocumento: By.id('formDocumento'),

      // Campos del formulario
      inputAlcance: By.id('inputAlcance'),
      inputCliente: By.id('inputCliente'),
      inputPoliza: By.id('inputPoliza'),
      inputTipoDocumento: By.id('inputTipoDocumento'),
      inputArchivo: By.id('inputArchivo'),

      // Botones del formulario
      btnCancelForm: By.id('btnCancelForm'),
      btnSubmitForm: By.css('#formDocumento button[type="submit"]'),

      // Modal de Filtros
      modalFiltros: By.id('modalFiltros'),
      btnCloseFiltros: By.id('btnCloseFiltros'),
      filterCliente: By.id('filterCliente'),
      filterPoliza: By.id('filterPoliza'),
      btnClearFilters: By.id('btnClearFilters'),
      btnApplyFilters: By.id('btnApplyFilters'),
      filterBadge: By.id('filterBadge')
    };
  }

  async navigateToDocumentos() {
    console.log('📍 Navegando a sección de Documentos...');
    const navLink = By.css('a[data-view="documentos"]');
    await this.click(navLink);
    await this.sleep(1500);
    console.log('✅ Vista de Documentos cargada');
  }

  async waitForPageLoad() {
    await this.sleep(1000);
  }

  async openNewDocumentoModal() {
    console.log('🆕 Abriendo modal de nuevo documento...');
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

    await this.clickWithRetry(this.locators.btnAddDocumento, 3, 1000);
    await waitForVisible(this.driver, this.locators.modalDocumento);
    await this.sleep(500);
    console.log('✅ Modal de nuevo documento abierto');
  }

  async closeModal() {
    await this.dismissAllToasts(2000);
    await this.clickWithRetry(this.locators.btnCloseModal, 3, 500);
    await this.sleep(500);
  }

  async isModalVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalDocumento);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (error) {
      return false;
    }
  }

  async fillDocumentoForm(docData) {
    console.log('📝 Llenando formulario de documento...');

    // Seleccionar alcance
    if (docData.alcance) {
      const alcanceSelect = await this.driver.findElement(this.locators.inputAlcance);
      await this.driver.executeScript(`
        const select = arguments[0];
        select.value = arguments[1];
        select.dispatchEvent(new Event('change', { bubbles: true }));
      `, alcanceSelect, docData.alcance);
      await this.sleep(300);
    }

    // Seleccionar cliente si es el alcance
    if (docData.cliente_id || docData.selectFirstCliente) {
      const clienteSelect = await this.driver.findElement(this.locators.inputCliente);
      const options = await clienteSelect.findElements(By.css('option'));
      if (options.length > 1) {
        const optionValue = await options[1].getAttribute('value');
        await this.driver.executeScript(`
          const select = arguments[0];
          select.value = arguments[1];
          select.dispatchEvent(new Event('change', { bubbles: true }));
        `, clienteSelect, optionValue);
      }
    }

    // Seleccionar póliza si es el alcance
    if (docData.poliza_id || docData.selectFirstPoliza) {
      const polizaSelect = await this.driver.findElement(this.locators.inputPoliza);
      const options = await polizaSelect.findElements(By.css('option'));
      if (options.length > 1) {
        const optionValue = await options[1].getAttribute('value');
        await this.driver.executeScript(`
          const select = arguments[0];
          select.value = arguments[1];
          select.dispatchEvent(new Event('change', { bubbles: true }));
        `, polizaSelect, optionValue);
      }
    }

    if (docData.tipo_documento) {
      await this.type(this.locators.inputTipoDocumento, docData.tipo_documento);
    }

    // Para archivos, necesitamos una ruta real en el sistema
    if (docData.archivo_path) {
      const fileInput = await this.driver.findElement(this.locators.inputArchivo);
      await fileInput.sendKeys(docData.archivo_path);
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

  async createDocumento(docData) {
    await this.openNewDocumentoModal();
    await this.fillDocumentoForm(docData);
    await this.submitForm();
    await this.sleep(2000);
  }

  async search(searchText) {
    console.log(`🔍 Buscando: "${searchText}"`);
    await this.type(this.locators.searchDocumentos, searchText);
    await this.sleep(500);
  }

  async clearSearch() {
    const searchInput = await this.driver.findElement(this.locators.searchDocumentos);
    await searchInput.clear();
    await this.driver.executeScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", searchInput);
    await this.sleep(1000);
  }

  async getTotalDocumentos() {
    const text = await this.getText(this.locators.statTotal);
    return parseInt(text);
  }

  async getTableRowCount() {
    try {
      const tbody = await this.driver.findElement(this.locators.documentosTableBody);
      const rows = await tbody.findElements(By.css('tr'));
      return rows.length;
    } catch (error) {
      return 0;
    }
  }

  async documentoExistsInTable(searchTerm) {
    console.log(`🔎 Verificando si existe documento: ${searchTerm}`);
    try {
      await this.search(searchTerm);
      await this.sleep(500);

      const tbody = await this.driver.findElement(this.locators.documentosTableBody);
      const rows = await tbody.findElements(By.css('tr'));

      for (const row of rows) {
        const text = await row.getText();
        if (text.includes(searchTerm)) {
          console.log(`✅ Documento encontrado: ${searchTerm}`);
          return true;
        }
      }

      console.log(`❌ Documento no encontrado: ${searchTerm}`);
      return false;
    } catch (error) {
      return false;
    }
  }

  // Filtros
  async openFiltersModal() {
    console.log('🔍 Abriendo modal de filtros...');
    await this.clickWithRetry(this.locators.btnOpenFilters, 3, 500);
    await waitForVisible(this.driver, this.locators.modalFiltros);
    await this.sleep(300);
  }

  async closeFiltersModal() {
    await this.click(this.locators.btnCloseFiltros);
    await this.sleep(300);
  }

  async setFilterCliente(checked) {
    const checkbox = await this.driver.findElement(this.locators.filterCliente);
    const isChecked = await checkbox.isSelected();
    if (isChecked !== checked) {
      await checkbox.click();
    }
  }

  async setFilterPoliza(checked) {
    const checkbox = await this.driver.findElement(this.locators.filterPoliza);
    const isChecked = await checkbox.isSelected();
    if (isChecked !== checked) {
      await checkbox.click();
    }
  }

  async applyFilters() {
    console.log('✅ Aplicando filtros...');
    await this.click(this.locators.btnApplyFilters);
    await this.sleep(1000);
  }

  async clearFilters() {
    console.log('🧹 Limpiando filtros...');
    await this.click(this.locators.btnClearFilters);
    await this.sleep(500);
  }

  async getFilterBadgeCount() {
    try {
      const badge = await this.driver.findElement(this.locators.filterBadge);
      const isHidden = await badge.getAttribute('class').then(cls => cls.includes('hidden'));
      if (isHidden) return 0;
      const text = await badge.getText();
      return parseInt(text);
    } catch (error) {
      return 0;
    }
  }

  // Selección múltiple
  async selectAllDocuments() {
    console.log('☑️ Seleccionando todos los documentos...');
    await this.click(this.locators.btnSelectAll);
    await this.sleep(500);
  }

  async clearSelection() {
    console.log('❎ Limpiando selección...');
    await this.click(this.locators.btnClearSelection);
    await this.sleep(500);
  }

  async getSelectedCount() {
    try {
      const countElement = await this.driver.findElement(this.locators.bulkCount);
      const text = await countElement.getText();
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    } catch (error) {
      return 0;
    }
  }

  async isBulkActionsVisible() {
    try {
      const element = await this.driver.findElement(this.locators.bulkActions);
      const classes = await element.getAttribute('class');
      return !classes.includes('hidden');
    } catch (error) {
      return false;
    }
  }

  async selectDocumentCheckbox(index) {
    const tbody = await this.driver.findElement(this.locators.documentosTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    if (index < rows.length) {
      const checkbox = await rows[index].findElement(By.css('input[type="checkbox"]'));
      await checkbox.click();
      await this.sleep(300);
    }
  }

  // Acciones en la tabla
  async clickDownloadDocumento(searchTerm) {
    console.log(`⬇️ Descargando documento: ${searchTerm}`);
    await this.search(searchTerm);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.documentosTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(searchTerm)) {
        const downloadBtn = await row.findElement(By.css('button[onclick*="download"]'));
        await downloadBtn.click();
        await this.sleep(1000);
        return;
      }
    }
  }

  async clickDeleteDocumento(searchTerm) {
    console.log(`🗑️ Eliminando documento: ${searchTerm}`);
    await this.search(searchTerm);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.documentosTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(searchTerm)) {
        const deleteBtn = await row.findElement(By.css('button[onclick*="delete"]'));
        await deleteBtn.click();
        await this.sleep(1000);
        return;
      }
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

module.exports = DocumentosPage;
