// RecibosPage.js - Page Object para la gestión de Recibos

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const { waitForVisible, waitForClickable } = require('../helpers/wait-helpers');

class RecibosPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      // Búsqueda y acciones
      searchInput: By.id('searchInput'),
      btnOpenFilters: By.id('btnOpenFilters'),
      btnAddRecibo: By.id('btnAddRecibo'),

      // Stats
      statTotal: By.id('statTotal'),
      statPendientes: By.id('statPendientes'),
      statPagados: By.id('statPagados'),
      statVencidos: By.id('statVencidos'),

      // Tabla
      recibosTableBody: By.id('recibosTableBody'),
      emptyState: By.id('emptyState'),
      loadingState: By.id('loadingState'),

      // Paginación
      paginationContainer: By.id('paginationContainer'),
      paginationInfo: By.id('paginationInfo'),
      itemsPerPageSelect: By.id('itemsPerPageSelect'),
      paginationButtons: By.id('paginationButtons'),

      // Modal Recibo
      modalRecibo: By.id('modalRecibo'),
      modalTitle: By.id('modalTitle'),
      btnCloseModal: By.id('btnCloseModal'),
      formRecibo: By.id('formRecibo'),

      // Campos del formulario
      inputPoliza: By.id('inputPoliza'),
      inputNumeroRecibo: By.id('inputNumeroRecibo'),
      inputNumeroFraccion: By.id('inputNumeroFraccion'),
      inputFechaInicio: By.id('inputFechaInicio'),
      inputFechaFin: By.id('inputFechaFin'),
      inputMonto: By.id('inputMonto'),
      inputFechaCorte: By.id('inputFechaCorte'),
      inputDiasGracia: By.id('inputDiasGracia'),
      inputEstado: By.id('inputEstado'),
      inputFechaPago: By.id('inputFechaPago'),

      // Botones del formulario
      btnCancelForm: By.id('btnCancelForm'),
      btnSubmitForm: By.css('#formRecibo button[type="submit"]'),

      // Modal de Filtros
      modalFiltros: By.id('modalFiltros'),
      btnCloseFiltros: By.id('btnCloseFiltros'),
      filterPendiente: By.id('filterPendiente'),
      filterPagado: By.id('filterPagado'),
      filterVencido: By.id('filterVencido'),
      btnClearFilters: By.id('btnClearFilters'),
      btnApplyFilters: By.id('btnApplyFilters'),
      filterBadge: By.id('filterBadge')
    };
  }

  async navigateToRecibos() {
    console.log('📍 Navegando a sección de Recibos...');
    const navLink = By.css('a[data-view="recibos"]');
    await this.click(navLink);
    await this.sleep(1500); // Dar tiempo a la transición
    console.log('✅ Vista de Recibos cargada');
  }

  async waitForPageLoad() {
    await this.sleep(1000); // Dar tiempo a que se carguen los datos
  }

  async openNewReciboModal() {
    console.log('🆕 Abriendo modal de nuevo recibo...');

    // Descartar toasts con método avanzado
    await this.dismissAllToasts(2000);

    // Evitar que overlays bloqueen el botón
    try {
      await this.driver.executeScript(`
        document.querySelectorAll('#loading-overlay').forEach(el => el.classList.add('hidden'));
        const content = document.querySelector('#contentView');
        if (content) content.classList.remove('loading');
      `);
    } catch (e) {
      // ignore
    }

    // Hacer scroll al botón por si quedó fuera de vista
    try {
      await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});',
        await this.driver.findElement(this.locators.btnAddRecibo));
    } catch (e) {
      // ignore
    }

    // Clic con reintentos automáticos
    await this.clickWithRetry(this.locators.btnAddRecibo, 3, 1000);

    await waitForVisible(this.driver, this.locators.modalRecibo);
    await this.sleep(500);
    console.log('✅ Modal de nuevo recibo abierto');
  }

  async closeModal() {
    // Descartar toasts antes de cerrar
    await this.dismissAllToasts(2000);

    // Clic con reintentos
    await this.clickWithRetry(this.locators.btnCloseModal, 3, 500);
    await this.sleep(500);
  }

  async isModalVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalRecibo);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (error) {
      return false;
    }
  }

  async fillReciboForm(reciboData) {
    console.log('📝 Llenando formulario de recibo...');

    // Seleccionar póliza
    if (reciboData.poliza_id || reciboData.selectFirstPoliza) {
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

    if (reciboData.numero_recibo) {
      await this.type(this.locators.inputNumeroRecibo, reciboData.numero_recibo);
    }

    if (reciboData.numero_fraccion) {
      await this.type(this.locators.inputNumeroFraccion, reciboData.numero_fraccion);
    }

    if (reciboData.fecha_inicio_periodo) {
      await this.setDateValue(this.locators.inputFechaInicio, reciboData.fecha_inicio_periodo);
    }

    if (reciboData.fecha_fin_periodo) {
      await this.setDateValue(this.locators.inputFechaFin, reciboData.fecha_fin_periodo);
    }

    if (reciboData.monto) {
      await this.type(this.locators.inputMonto, reciboData.monto);
    }

    if (reciboData.fecha_corte) {
      await this.setDateValue(this.locators.inputFechaCorte, reciboData.fecha_corte);
    }

    if (reciboData.dias_gracia) {
      await this.type(this.locators.inputDiasGracia, reciboData.dias_gracia);
    }

    if (reciboData.estado) {
      const estadoSelect = await this.driver.findElement(this.locators.inputEstado);
      await this.driver.executeScript(`
        const select = arguments[0];
        select.value = arguments[1];
        select.dispatchEvent(new Event('change', { bubbles: true }));
      `, estadoSelect, reciboData.estado);
    }

    if (reciboData.fecha_pago) {
      await this.setDateValue(this.locators.inputFechaPago, reciboData.fecha_pago);
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

  async createRecibo(reciboData) {
    await this.openNewReciboModal();
    await this.fillReciboForm(reciboData);
    await this.submitForm();
    await this.sleep(2000);
  }

  async search(searchText) {
    console.log(`🔍 Buscando: "${searchText}"`);
    await this.type(this.locators.searchInput, searchText);
    await this.sleep(500);
  }

  async clearSearch() {
    const searchInput = await this.driver.findElement(this.locators.searchInput);
    await searchInput.clear();
    // Disparar evento 'input' para que el filtro se actualice
    await this.driver.executeScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", searchInput);
    await this.sleep(1000);
  }

  // Stats
  async getTotalRecibos() {
    const text = await this.getText(this.locators.statTotal);
    return parseInt(text);
  }

  async getTotalPendientes() {
    const text = await this.getText(this.locators.statPendientes);
    return parseInt(text);
  }

  async getTotalPagados() {
    const text = await this.getText(this.locators.statPagados);
    return parseInt(text);
  }

  async getTotalVencidos() {
    const text = await this.getText(this.locators.statVencidos);
    return parseInt(text);
  }

  async getTableRowCount() {
    try {
      const tbody = await this.driver.findElement(this.locators.recibosTableBody);
      const rows = await tbody.findElements(By.css('tr'));
      return rows.length;
    } catch (error) {
      return 0;
    }
  }

  async waitForReciboInTable(numeroRecibo, timeout = 10000) {
    console.log(`⏳ Esperando a que aparezca recibo: ${numeroRecibo}`);

    try {
      // Buscar el recibo para filtrar
      await this.search(numeroRecibo);
      await this.sleep(500);

      // Esperar usando método avanzado de BasePage
      const found = await this.waitForTextInTable(
        this.locators.recibosTableBody,
        numeroRecibo,
        timeout
      );

      if (found) {
        console.log(`✅ Recibo encontrado: ${numeroRecibo}`);
        return true;
      } else {
        console.log(`❌ Timeout esperando recibo: ${numeroRecibo}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Error buscando recibo: ${error.message}`);
      return false;
    }
  }

  async reciboExistsInTable(numeroRecibo) {
    console.log(`🔎 Verificando si existe recibo: ${numeroRecibo}`);
    try {
      await this.search(numeroRecibo);
      await this.sleep(500);

      const tbody = await this.driver.findElement(this.locators.recibosTableBody);
      const rows = await tbody.findElements(By.css('tr'));

      for (const row of rows) {
        const text = await row.getText();
        if (text.includes(numeroRecibo)) {
          console.log(`✅ Recibo encontrado en tabla: ${numeroRecibo}`);
          return true;
        }
      }

      console.log(`❌ Recibo no encontrado en tabla: ${numeroRecibo}`);
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

  async setFilterPendiente(checked) {
    const checkbox = await this.driver.findElement(this.locators.filterPendiente);
    const isChecked = await checkbox.isSelected();
    if (isChecked !== checked) {
      await checkbox.click();
    }
  }

  async setFilterPagado(checked) {
    const checkbox = await this.driver.findElement(this.locators.filterPagado);
    const isChecked = await checkbox.isSelected();
    if (isChecked !== checked) {
      await checkbox.click();
    }
  }

  async setFilterVencido(checked) {
    const checkbox = await this.driver.findElement(this.locators.filterVencido);
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

  // Acciones en la tabla
  async clickEditRecibo(numeroRecibo) {
    console.log(`✏️ Editando recibo: ${numeroRecibo}`);
    await this.search(numeroRecibo);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.recibosTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(numeroRecibo)) {
        const editBtn = await row.findElement(By.css('button[onclick*="editRecibo"]'));
        await editBtn.click();
        await this.sleep(500);
        return;
      }
    }
  }

  async clickMarcarComoPagado(numeroRecibo) {
    console.log(`💰 Marcando como pagado recibo: ${numeroRecibo}`);
    await this.search(numeroRecibo);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.recibosTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(numeroRecibo)) {
        const pagarBtn = await row.findElement(By.css('button[onclick*="marcarComoPagado"]'));
        await pagarBtn.click();
        await this.sleep(1000);
        return;
      }
    }
  }

  async clickRevertirPago(numeroRecibo) {
    console.log(`↩️ Revirtiendo pago de recibo: ${numeroRecibo}`);
    await this.search(numeroRecibo);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.recibosTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(numeroRecibo)) {
        const revertBtn = await row.findElement(By.css('button[onclick*="revertirPago"]'));
        await revertBtn.click();
        await this.sleep(1000);
        return;
      }
    }
  }

  async getReciboEstado(numeroRecibo) {
    console.log(`📊 Obteniendo estado de recibo: ${numeroRecibo}`);
    await this.search(numeroRecibo);
    await this.sleep(500);

    const tbody = await this.driver.findElement(this.locators.recibosTableBody);
    const rows = await tbody.findElements(By.css('tr'));

    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(numeroRecibo)) {
        const badge = await row.findElement(By.css('.status-badge'));
        const estadoText = await badge.getText();
        return estadoText.toLowerCase();
      }
    }
    return null;
  }

  // Paginación
  async isPaginationVisible() {
    try {
      const container = await this.driver.findElement(this.locators.paginationContainer);
      const classes = await container.getAttribute('class');
      return !classes.includes('hidden');
    } catch (error) {
      return false;
    }
  }

  async changeItemsPerPage(value) {
    console.log(`📄 Cambiando items por página a: ${value}`);
    const select = await this.driver.findElement(this.locators.itemsPerPageSelect);
    await this.driver.executeScript(`
      const select = arguments[0];
      select.value = arguments[1];
      select.dispatchEvent(new Event('change', { bubbles: true }));
    `, select, value.toString());
    await this.sleep(1000);
  }

  async goToPage(pageNumber) {
    console.log(`📖 Navegando a página: ${pageNumber}`);
    const buttons = await this.driver.findElement(this.locators.paginationButtons);
    const pageButtons = await buttons.findElements(By.css('button'));

    for (const btn of pageButtons) {
      const text = await btn.getText();
      if (text === pageNumber.toString()) {
        await btn.click();
        await this.sleep(1000);
        return;
      }
    }
  }

  async getPaginationInfo() {
    try {
      const info = await this.getText(this.locators.paginationInfo);
      return info;
    } catch (error) {
      return '';
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

module.exports = RecibosPage;
