// RecibosPage.js - Page Object para el módulo de Recibos

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

      // Estadísticas (4 cards)
      statMontoPendiente: By.id('statMontoPendiente'),
      statRecibosPendientes: By.id('statRecibosPendientes'),
      statMontoVence7: By.id('statMontoVence7'),
      statMontoPagado: By.id('statMontoPagado'),
      statRecibosPagados: By.id('statRecibosPagados'),
      statPagadoMes: By.id('statPagadoMes'),
      statMontoVencido: By.id('statMontoVencido'),
      statRecibosVencidos: By.id('statRecibosVencidos'),
      statDiasVencido: By.id('statDiasVencido'),
      statMontoTotal: By.id('statMontoTotal'),
      statRecibosTotal: By.id('statRecibosTotal'),
      barraUrgencia: By.id('barraUrgencia'),

      // Filtros Rápidos
      quickFilterAll: By.id('quickFilterAll'),
      quickFilterVencenHoy: By.id('quickFilterVencenHoy'),
      quickFilterVencen7: By.id('quickFilterVencen7'),
      quickFilterPendientes: By.id('quickFilterPendientes'),
      quickFilterVencidos: By.id('quickFilterVencidos'),
      quickFilterPagadosHoy: By.id('quickFilterPagadosHoy'),
      quickFilterCounter: By.id('quickFilterCounter'),
      quickFilterClear: By.id('quickFilterClear'),

      // Tabla
      recibosTableBody: By.id('recibosTableBody'),
      emptyState: By.id('emptyState'),
      loadingState: By.id('loadingState'),

      // Modales
      modalRecibo: By.id('modalRecibo'),
      modalRegistrarPago: By.id('modalRegistrarPago'),
      modalFiltros: By.id('modalFiltros'),

      modalTitle: By.id('modalTitle'),
      btnCloseModal: By.id('btnCloseModal'),
      btnCloseModalPago: By.id('btnCloseModalPago'),
      btnCloseFiltros: By.id('btnCloseFiltros'),

      // Formulario de Recibo
      formRecibo: By.id('formRecibo'),
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
      btnCancelForm: By.id('btnCancelForm'),
      btnSubmitForm: By.css('#formRecibo button[type="submit"]'),

      // Formulario de Pago
      formRegistrarPago: By.id('formRegistrarPago'),
      pagoReciboInfo: By.id('pagoReciboInfo'),
      pagoMontoInfo: By.id('pagoMontoInfo'),
      inputFechaPagoModal: By.id('inputFechaPagoModal'),
      inputMetodoPagoModal: By.id('inputMetodoPagoModal'),
      inputReferenciaPago: By.id('inputReferenciaPago'),
      inputNotasPago: By.id('inputNotasPago'),
      checkGenerarComprobante: By.id('checkGenerarComprobante'),
      btnCancelarPago: By.id('btnCancelarPago'),

      // Filtros Avanzados
      filterPendiente: By.id('filterPendiente'),
      filterPagado: By.id('filterPagado'),
      filterVencido: By.id('filterVencido'),
      btnApplyFilters: By.id('btnApplyFilters'),
      btnClearFilters: By.id('btnClearFilters'),
      filterBadge: By.id('filterBadge'),

      // Paginación
      paginationContainer: By.id('paginationContainer'),
      itemsPerPageSelect: By.id('itemsPerPageSelect')
    };
  }

  async navigateToRecibos() {
    console.log('📍 Navegando a sección de Recibos...');
    const navLink = By.css('a[data-view="recibos"]');
    await this.click(navLink);
    await this.sleep(1500);
    console.log('✅ Vista de Recibos cargada');
  }

  async waitForPageLoad() {
    await this.sleep(1000);
  }

  // ========== CRUD Básico ==========

  async openNewReciboModal() {
    console.log('🆕 Abriendo modal de nuevo recibo...');
    await this.dismissAllToasts(2000);
    await this.clickWithRetry(this.locators.btnAddRecibo, 3, 1000);
    await waitForVisible(this.driver, this.locators.modalRecibo);
    await this.sleep(500);
    console.log('✅ Modal de nuevo recibo abierto');
  }

  async fillReciboForm(data) {
    console.log('📝 Llenando formulario de recibo...');

    if (data.selectFirstPoliza) {
      const options = await this.driver.findElements(By.css('#inputPoliza option'));
      if (options.length > 1) {
        await this.select(this.locators.inputPoliza, options[1].getAttribute('value'));
      }
    } else if (data.poliza_id) {
      await this.select(this.locators.inputPoliza, data.poliza_id);
    }

    if (data.numero_recibo) {
      await this.type(this.locators.inputNumeroRecibo, data.numero_recibo);
    }

    if (data.numero_fraccion) {
      await this.type(this.locators.inputNumeroFraccion, data.numero_fraccion);
    }

    if (data.fecha_inicio) {
      await this.type(this.locators.inputFechaInicio, data.fecha_inicio);
    }

    if (data.fecha_fin) {
      await this.type(this.locators.inputFechaFin, data.fecha_fin);
    }

    if (data.monto) {
      await this.type(this.locators.inputMonto, data.monto);
    }

    if (data.fecha_corte) {
      await this.type(this.locators.inputFechaCorte, data.fecha_corte);
    }

    if (data.dias_gracia) {
      await this.type(this.locators.inputDiasGracia, data.dias_gracia);
    }

    if (data.estado) {
      await this.select(this.locators.inputEstado, data.estado);
    }

    if (data.fecha_pago) {
      await this.type(this.locators.inputFechaPago, data.fecha_pago);
    }

    console.log('✅ Formulario llenado');
  }

  async submitForm() {
    console.log('💾 Guardando recibo...');
    await this.click(this.locators.btnSubmitForm);
    await this.sleep(2000); // Esperar a que se guarde
  }

  async createRecibo(data) {
    await this.openNewReciboModal();
    await this.fillReciboForm(data);
    await this.submitForm();
    await this.sleep(1000);
  }

  async closeModal() {
    try {
      await this.clickWithRetry(this.locators.btnCloseModal, 2, 500);
      await this.sleep(500);
    } catch (e) {
      // Modal ya cerrado
    }
  }

  async isModalVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalRecibo);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (e) {
      return false;
    }
  }

  // ========== Búsqueda ==========

  async search(text) {
    console.log(`🔍 Buscando: "${text}"`);
    await this.type(this.locators.searchInput, text);
    await this.sleep(800);
  }

  async clearSearch() {
    try {
      const input = await this.driver.findElement(this.locators.searchInput);
      await input.clear();
      await this.driver.executeScript(
        "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
        input
      );
      await this.sleep(500);
    } catch (e) {
      // ignore
    }
  }

  // ========== Filtros Rápidos ==========

  async clickQuickFilter(filterName) {
    console.log(`🎯 Aplicando filtro rápido: ${filterName}`);
    const filterMap = {
      'todos': this.locators.quickFilterAll,
      'vencen-hoy': this.locators.quickFilterVencenHoy,
      'vencen-7': this.locators.quickFilterVencen7,
      'pendientes': this.locators.quickFilterPendientes,
      'vencidos': this.locators.quickFilterVencidos,
      'pagados-hoy': this.locators.quickFilterPagadosHoy
    };

    const locator = filterMap[filterName];
    if (locator) {
      await this.click(locator);
      await this.sleep(1000);
    }
  }

  async getQuickFilterCounter() {
    try {
      const counter = await this.driver.findElement(this.locators.quickFilterCounter);
      return await counter.getText();
    } catch (e) {
      return '';
    }
  }

  async isQuickFilterActive(filterName) {
    const filterMap = {
      'todos': this.locators.quickFilterAll,
      'vencen-hoy': this.locators.quickFilterVencenHoy,
      'vencen-7': this.locators.quickFilterVencen7,
      'pendientes': this.locators.quickFilterPendientes,
      'vencidos': this.locators.quickFilterVencidos,
      'pagados-hoy': this.locators.quickFilterPagadosHoy
    };

    const locator = filterMap[filterName];
    if (locator) {
      const element = await this.driver.findElement(locator);
      const classes = await element.getAttribute('class');
      return classes.includes('active');
    }
    return false;
  }

  // ========== Filtros Avanzados ==========

  async openFiltersModal() {
    console.log('🎛️  Abriendo filtros avanzados...');
    await this.click(this.locators.btnOpenFilters);
    await waitForVisible(this.driver, this.locators.modalFiltros);
    await this.sleep(500);
  }

  async closeFiltersModal() {
    await this.click(this.locators.btnCloseFiltros);
    await this.sleep(500);
  }

  async setFilterCheckbox(filterType, checked) {
    const filterMap = {
      'pendiente': this.locators.filterPendiente,
      'pagado': this.locators.filterPagado,
      'vencido': this.locators.filterVencido
    };

    const locator = filterMap[filterType];
    if (locator) {
      const checkbox = await this.driver.findElement(locator);
      const isChecked = await checkbox.isSelected();

      if (checked && !isChecked) {
        await checkbox.click();
      } else if (!checked && isChecked) {
        await checkbox.click();
      }
      await this.sleep(300);
    }
  }

  async applyFilters() {
    console.log('✅ Aplicando filtros...');
    await this.click(this.locators.btnApplyFilters);
    await this.sleep(1000);
  }

  async clearAdvancedFilters() {
    await this.click(this.locators.btnClearFilters);
    await this.sleep(500);
  }

  async getFilterBadgeCount() {
    try {
      const badge = await this.driver.findElement(this.locators.filterBadge);
      const classes = await badge.getAttribute('class');
      if (classes.includes('hidden')) {
        return 0;
      }
      const text = await badge.getText();
      return parseInt(text) || 0;
    } catch (e) {
      return 0;
    }
  }

  // ========== Registro de Pago ==========

  async clickOnReciboRow(reciboNumero) {
    console.log(`💳 Click en recibo: ${reciboNumero}`);
    await this.search(reciboNumero);
    await this.sleep(1000);

    const rows = await this.driver.findElements(By.css('#recibosTableBody tr'));
    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(reciboNumero)) {
        await row.click();
        await this.sleep(1000);
        return;
      }
    }
    throw new Error(`No se encontró recibo: ${reciboNumero}`);
  }

  async isModalPagoVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalRegistrarPago);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (e) {
      return false;
    }
  }

  async isModalReciboVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalRecibo);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (e) {
      return false;
    }
  }

  async isModalFiltrosVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalFiltros);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (e) {
      return false;
    }
  }

  async fillPagoForm(data) {
    console.log('📝 Llenando formulario de pago...');

    if (data.fecha_pago) {
      await this.clear(this.locators.inputFechaPagoModal);
      await this.type(this.locators.inputFechaPagoModal, data.fecha_pago);
    }

    if (data.metodo_pago) {
      await this.select(this.locators.inputMetodoPagoModal, data.metodo_pago);
    }

    if (data.referencia) {
      await this.type(this.locators.inputReferenciaPago, data.referencia);
    }

    if (data.notas) {
      await this.type(this.locators.inputNotasPago, data.notas);
    }

    if (data.generar_pdf !== undefined) {
      const checkbox = await this.driver.findElement(this.locators.checkGenerarComprobante);
      const isChecked = await checkbox.isSelected();

      if (data.generar_pdf && !isChecked) {
        await checkbox.click();
      } else if (!data.generar_pdf && isChecked) {
        await checkbox.click();
      }
    }

    console.log('✅ Formulario de pago llenado');
  }

  async submitPago() {
    console.log('💾 Confirmando pago...');
    const submitBtn = await this.driver.findElement(By.css('#formRegistrarPago button[type="submit"]'));
    await submitBtn.click();
    await this.sleep(2000);
  }

  async closeModalPago() {
    try {
      await this.click(this.locators.btnCloseModalPago);
      await this.sleep(500);
    } catch (e) {
      // Modal ya cerrado
    }
  }

  async registrarPago(reciboNumero, pagoData) {
    await this.clickOnReciboRow(reciboNumero);

    // Verificar que se abrió modal de pago (si es pendiente)
    const isModalOpen = await this.isModalPagoVisible();
    if (isModalOpen) {
      await this.fillPagoForm(pagoData);
      await this.submitPago();
    }
  }

  // ========== Acciones en Tabla ==========

  async clickActionButton(reciboNumero, action) {
    console.log(`🔘 Click en acción "${action}" para recibo: ${reciboNumero}`);
    await this.clearSearch();
    await this.search(reciboNumero);
    await this.sleep(1000);

    const rows = await this.driver.findElements(By.css('#recibosTableBody tr'));
    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(reciboNumero)) {
        let button;

        switch(action) {
          case 'mark-paid':
            button = await row.findElement(By.css('button[data-action="mark-paid"]'));
            break;
          case 'mark-pending':
            button = await row.findElement(By.css('button[data-action="mark-pending"]'));
            break;
          case 'generate-pdf':
            button = await row.findElement(By.css('button[data-action="generate-pdf"]'));
            break;
          case 'edit':
            button = await row.findElement(By.css('button[data-action="edit"]'));
            break;
          case 'delete':
            button = await row.findElement(By.css('button[data-action="delete"]'));
            break;
        }

        if (button) {
          await button.click();
          await this.sleep(1500);
          return;
        }
      }
    }
    throw new Error(`No se pudo hacer click en acción "${action}" para recibo: ${reciboNumero}`);
  }

  async deleteRecibo(reciboNumero) {
    await this.clickActionButton(reciboNumero, 'delete');

    // Confirmar en modal de confirmación
    try {
      const confirmBtn = await this.driver.findElement(By.id('confirm-modal-confirm'));
      await confirmBtn.click();
      await this.sleep(2000);
    } catch (e) {
      // No hay modal de confirmación o ya se procesó
    }
  }

  // ========== Verificaciones ==========

  async getTableRowCount() {
    try {
      const rows = await this.driver.findElements(By.css('#recibosTableBody tr'));
      return rows.length;
    } catch (e) {
      return 0;
    }
  }

  async existsInTable(searchText) {
    await this.search(searchText);
    await this.sleep(1000);

    const count = await this.getTableRowCount();
    await this.clearSearch();
    return count > 0;
  }

  async getStatValue(statName) {
    const statMap = {
      'monto-pendiente': this.locators.statMontoPendiente,
      'recibos-pendientes': this.locators.statRecibosPendientes,
      'monto-vence-7': this.locators.statMontoVence7,
      'monto-pagado': this.locators.statMontoPagado,
      'recibos-pagados': this.locators.statRecibosPagados,
      'pagado-mes': this.locators.statPagadoMes,
      'monto-vencido': this.locators.statMontoVencido,
      'recibos-vencidos': this.locators.statRecibosVencidos,
      'dias-vencido': this.locators.statDiasVencido,
      'monto-total': this.locators.statMontoTotal,
      'recibos-total': this.locators.statRecibosTotal
    };

    const locator = statMap[statName];
    if (locator) {
      try {
        const element = await this.driver.findElement(locator);
        return await element.getText();
      } catch (e) {
        return '';
      }
    }
    return '';
  }

  async getReciboBadgeState(reciboNumero) {
    await this.search(reciboNumero);
    await this.sleep(1000);

    const rows = await this.driver.findElements(By.css('#recibosTableBody tr'));
    for (const row of rows) {
      const text = await row.getText();
      if (text.includes(reciboNumero)) {
        const badge = await row.findElement(By.css('.status-badge'));
        const classes = await badge.getAttribute('class');
        const badgeText = await badge.getText();

        await this.clearSearch();

        if (classes.includes('status-vigente')) return 'pagado';
        if (classes.includes('status-vencida')) return 'vencido';
        if (classes.includes('status-por-vencer')) return 'pendiente';

        return badgeText.toLowerCase();
      }
    }

    await this.clearSearch();
    throw new Error(`No se encontró badge para recibo: ${reciboNumero}`);
  }

  // ========== Paginación ==========

  async changeItemsPerPage(value) {
    console.log(`📄 Cambiando items por página a: ${value}`);
    await this.select(this.locators.itemsPerPageSelect, value.toString());
    await this.sleep(1000);
  }

  async isPaginationVisible() {
    try {
      const pagination = await this.driver.findElement(this.locators.paginationContainer);
      const classes = await pagination.getAttribute('class');
      return !classes.includes('hidden');
    } catch (e) {
      return false;
    }
  }

  // ========== Estados de Vista ==========

  async isLoadingVisible() {
    try {
      const loading = await this.driver.findElement(this.locators.loadingState);
      const classes = await loading.getAttribute('class');
      return !classes.includes('hidden');
    } catch (e) {
      return false;
    }
  }

  async isEmptyStateVisible() {
    try {
      const empty = await this.driver.findElement(this.locators.emptyState);
      const classes = await empty.getAttribute('class');
      return !classes.includes('hidden');
    } catch (e) {
      return false;
    }
  }

  // ========== Métodos Adicionales para Tests ==========

  /**
   * Hace click en la primera fila de recibo en la tabla
   */
  async clickFirstReciboRow() {
    console.log('🖱️  Haciendo click en primera fila de recibo...');
    const firstRow = await this.driver.findElement(
      By.css('#recibosTableBody tr:first-child')
    );
    await firstRow.click();
    await this.sleep(500);
  }

  /**
   * Obtiene el monto pendiente (por cobrar) del stat card
   */
  async getStatMontoPendiente() {
    try {
      const element = await this.driver.findElement(By.id('statMontoPendiente'));
      const text = await element.getText();
      return text;
    } catch (e) {
      return null;
    }
  }

  /**
   * Obtiene la cantidad pendiente del stat card
   */
  async getStatCantidadPendiente() {
    try {
      const element = await this.driver.findElement(By.id('statRecibosPendientes'));
      const text = await element.getText();
      // Extraer número de recibos del texto (ej: "10 recibos" -> "10")
      const match = text.match(/(\d+)\s*recibo/i);
      return match ? match[1] : text;
    } catch (e) {
      return null;
    }
  }

  /**
   * Obtiene el monto pagado (cobrado) del stat card
   */
  async getStatMontoPagado() {
    try {
      const element = await this.driver.findElement(By.id('statMontoPagado'));
      const text = await element.getText();
      return text;
    } catch (e) {
      return null;
    }
  }

  /**
   * Obtiene el monto vencido del stat card
   */
  async getStatMontoVencido() {
    try {
      const element = await this.driver.findElement(By.id('statMontoVencido'));
      const text = await element.getText();
      return text;
    } catch (e) {
      return null;
    }
  }

  /**
   * Obtiene el monto total del stat card
   */
  async getStatMontoTotal() {
    try {
      const element = await this.driver.findElement(By.id('statMontoTotal'));
      const text = await element.getText();
      return text;
    } catch (e) {
      return null;
    }
  }

  /**
   * Verifica si existe al menos un badge "Pagado" en la tabla
   */
  async hasPagadoBadge() {
    try {
      const badges = await this.driver.findElements(
        By.css('#recibosTableBody .badge.bg-success')
      );
      return badges.length > 0;
    } catch (e) {
      return false;
    }
  }
}

module.exports = RecibosPage;
