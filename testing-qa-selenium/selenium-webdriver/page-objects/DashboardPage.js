// DashboardPage.js - Page Object para el Dashboard

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const { waitForVisible, waitForClickable } = require('../helpers/wait-helpers');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.locators = {
      // Header
      welcomeUser: By.id('welcomeUser'),
      currentDate: By.id('currentDate'),
      currentTime: By.id('currentTime'),
      btnAlerts: By.id('btnAlerts'),
      alertsBadge: By.id('alertsBadge'),
      alertsPanel: By.id('alertsPanel'),

      // Filtros de tiempo
      filterBtn7Days: By.css('[data-filter="7"]'),
      filterBtn30Days: By.css('[data-filter="30"]'),
      filterBtn90Days: By.css('[data-filter="90"]'),
      filterBtn1Year: By.css('[data-filter="365"]'),
      filterBtnAll: By.css('[data-filter="all"]'),
      btnCustomRange: By.id('btnCustomRange'),
      customRangePanel: By.id('customRangePanel'),
      startDate: By.id('startDate'),
      endDate: By.id('endDate'),
      btnApplyCustomRange: By.id('btnApplyCustomRange'),
      btnCancelCustomRange: By.id('btnCancelCustomRange'),
      activeRangeIndicator: By.id('activeRangeIndicator'),

      // Cards de Atención Urgente
      urgentVencenHoyCount: By.id('urgentVencenHoyCount'),
      urgentVencenHoyMonto: By.id('urgentVencenHoyMonto'),
      urgentAtrasados30Count: By.id('urgentAtrasados30Count'),
      urgentAtrasados30Monto: By.id('urgentAtrasados30Monto'),
      urgentRenovar30Count: By.id('urgentRenovar30Count'),
      urgentRenovar30Riesgo: By.id('urgentRenovar30Riesgo'),

      // Métricas de Desempeño
      metricCobradoMes: By.id('metricCobradoMes'),
      metricCobradoMesTrend: By.id('metricCobradoMesTrend'),
      metricPorCobrar: By.id('metricPorCobrar'),
      metricVencen7Dias: By.id('metricVencen7Dias'),
      metricMorosidad: By.id('metricMorosidad'),
      metricMorosidadTrend: By.id('metricMorosidadTrend'),
      metricEfectividad: By.id('metricEfectividad'),

      // Antigüedad de Saldos
      chartAntiguedadSaldos: By.id('chartAntiguedadSaldos'),
      saldoAlDia: By.id('saldoAlDia'),
      saldo1_30: By.id('saldo1_30'),
      saldo31_60: By.id('saldo31_60'),
      saldo60Plus: By.id('saldo60Plus'),

      // Top 5 Clientes
      top5ClientesContainer: By.id('top5ClientesContainer'),
      top5Percentage: By.id('top5Percentage'),
      top5ProgressBar: By.id('top5ProgressBar'),
      top5Warning: By.id('top5Warning'),

      // Flujo de Caja
      chartFlujoCaja: By.id('chartFlujoCaja'),
      flujoCajaEsperado: By.id('flujoCajaEsperado'),
      flujoCajaProyectado: By.id('flujoCajaProyectado'),
      flujoCajaBrecha: By.id('flujoCajaBrecha'),

      // Gráficas de Análisis
      chartCobrosMensuales: By.id('chartCobrosMensuales'),
      chartAseguradoras: By.id('chartAseguradoras'),
    };
  }

  /**
   * Navega al Dashboard (ya está en la página inicial después del login)
   */
  async waitForPageLoad() {
    console.log('⏳ Esperando que cargue el Dashboard...');
    await waitForVisible(this.driver, this.locators.welcomeUser, 10000);
    await this.sleep(1000);
    console.log('✅ Dashboard cargado correctamente');
  }

  /**
   * Obtiene el nombre del usuario mostrado en el header
   */
  async getWelcomeUserName() {
    const element = await this.driver.findElement(this.locators.welcomeUser);
    return await element.getText();
  }

  /**
   * Verifica que las cards de atención urgente estén visibles
   */
  async areUrgentCardsVisible() {
    const cards = [
      this.locators.urgentVencenHoyCount,
      this.locators.urgentAtrasados30Count,
      this.locators.urgentRenovar30Count
    ];

    for (const locator of cards) {
      const isVisible = await this.isElementVisible(locator);
      if (!isVisible) return false;
    }
    return true;
  }

  /**
   * Obtiene los valores de las cards urgentes
   */
  async getUrgentCardValues() {
    return {
      vencenHoyCount: await this.getText(this.locators.urgentVencenHoyCount),
      vencenHoyMonto: await this.getText(this.locators.urgentVencenHoyMonto),
      atrasados30Count: await this.getText(this.locators.urgentAtrasados30Count),
      atrasados30Monto: await this.getText(this.locators.urgentAtrasados30Monto),
      renovar30Count: await this.getText(this.locators.urgentRenovar30Count),
      renovar30Riesgo: await this.getText(this.locators.urgentRenovar30Riesgo)
    };
  }

  /**
   * Verifica que las métricas de desempeño estén visibles
   */
  async arePerformanceMetricsVisible() {
    const metrics = [
      this.locators.metricCobradoMes,
      this.locators.metricPorCobrar,
      this.locators.metricMorosidad,
      this.locators.metricEfectividad
    ];

    for (const locator of metrics) {
      const isVisible = await this.isElementVisible(locator);
      if (!isVisible) return false;
    }
    return true;
  }

  /**
   * Obtiene el valor de "Cobrado Este Mes"
   */
  async getCobradoMesValue() {
    return await this.getText(this.locators.metricCobradoMes);
  }

  /**
   * Hace clic en un filtro de tiempo
   */
  async clickTimeFilter(days) {
    const filterMap = {
      7: this.locators.filterBtn7Days,
      30: this.locators.filterBtn30Days,
      90: this.locators.filterBtn90Days,
      365: this.locators.filterBtn1Year,
      all: this.locators.filterBtnAll
    };

    const locator = filterMap[days];
    if (!locator) {
      throw new Error(`Filtro de ${days} días no encontrado`);
    }

    console.log(`🔘 Haciendo clic en filtro de ${days} días`);
    await this.click(locator);
    await this.sleep(1000); // Esperar a que se actualicen los datos
  }

  /**
   * Abre el panel de rango personalizado
   */
  async openCustomRangePanel() {
    console.log('📅 Abriendo panel de rango personalizado');
    await this.click(this.locators.btnCustomRange);
    await waitForVisible(this.driver, this.locators.customRangePanel, 5000);
  }

  /**
   * Cierra el panel de rango personalizado
   */
  async closeCustomRangePanel() {
    console.log('❌ Cerrando panel de rango personalizado');
    await this.click(this.locators.btnCancelCustomRange);
    await this.sleep(500);
  }

  /**
   * Aplica un rango de fechas personalizado
   */
  async applyCustomDateRange(startDate, endDate) {
    console.log(`📅 Aplicando rango: ${startDate} - ${endDate}`);

    await this.openCustomRangePanel();

    // Limpiar y establecer fecha de inicio
    const startInput = await this.driver.findElement(this.locators.startDate);
    await startInput.clear();
    await startInput.sendKeys(startDate);

    // Limpiar y establecer fecha de fin
    const endInput = await this.driver.findElement(this.locators.endDate);
    await endInput.clear();
    await endInput.sendKeys(endDate);

    // Aplicar
    await this.click(this.locators.btnApplyCustomRange);
    await this.sleep(1000);
  }

  /**
   * Obtiene el texto del indicador de rango activo
   */
  async getActiveRangeIndicator() {
    return await this.getText(this.locators.activeRangeIndicator);
  }

  /**
   * Verifica si un filtro está activo (tiene la clase 'active')
   */
  async isFilterActive(days) {
    const filterMap = {
      7: this.locators.filterBtn7Days,
      30: this.locators.filterBtn30Days,
      90: this.locators.filterBtn90Days,
      365: this.locators.filterBtn1Year,
      all: this.locators.filterBtnAll
    };

    const locator = filterMap[days];
    const element = await this.driver.findElement(locator);
    const className = await element.getAttribute('class');
    return className.includes('active');
  }

  /**
   * Abre el panel de alertas
   */
  async openAlertsPanel() {
    console.log('🔔 Abriendo panel de alertas');
    await this.click(this.locators.btnAlerts);
    await waitForVisible(this.driver, this.locators.alertsPanel, 5000);
  }

  /**
   * Verifica si el panel de alertas está visible
   */
  async isAlertsPanelVisible() {
    return await this.isElementVisible(this.locators.alertsPanel);
  }

  /**
   * Verifica que las gráficas estén presentes
   */
  async areChartsVisible() {
    const charts = [
      this.locators.chartAntiguedadSaldos,
      this.locators.chartFlujoCaja,
      this.locators.chartCobrosMensuales,
      this.locators.chartAseguradoras
    ];

    for (const locator of charts) {
      const isVisible = await this.isElementVisible(locator);
      if (!isVisible) return false;
    }
    return true;
  }

  /**
   * Obtiene los valores de antigüedad de saldos
   */
  async getAntiguedadSaldosValues() {
    return {
      alDia: await this.getText(this.locators.saldoAlDia),
      dias1_30: await this.getText(this.locators.saldo1_30),
      dias31_60: await this.getText(this.locators.saldo31_60),
      dias60Plus: await this.getText(this.locators.saldo60Plus)
    };
  }

  /**
   * Obtiene los valores del flujo de caja
   */
  async getFlujoCajaValues() {
    return {
      esperado: await this.getText(this.locators.flujoCajaEsperado),
      proyectado: await this.getText(this.locators.flujoCajaProyectado),
      brecha: await this.getText(this.locators.flujoCajaBrecha)
    };
  }

  /**
   * Verifica si el elemento Top 5 Clientes está visible
   */
  async isTop5ClientesVisible() {
    return await this.isElementVisible(this.locators.top5ClientesContainer);
  }
}

module.exports = DashboardPage;
