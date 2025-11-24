// dashboard.test.js - Suite de pruebas para el Dashboard

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const LoginPage = require('../page-objects/LoginPage');
const DashboardPage = require('../page-objects/DashboardPage');
const testData = require('../helpers/test-data');
const fs = require('fs');
const path = require('path');

// Variables globales
let driver;
let loginPage;
let dashboardPage;

// Resultados de tests
const testResults = {
  suite: 'Dashboard',
  timestamp: new Date().toISOString(),
  total: 0,
  passed: 0,
  failed: 0,
  results: []
};

/**
 * Registra el resultado de un test
 */
function logTestResult(testId, description, passed, message = '') {
  const result = {
    testId,
    description,
    passed,
    message,
    timestamp: new Date().toISOString()
  };

  testResults.results.push(result);
  testResults.total++;

  if (passed) {
    testResults.passed++;
    console.log(`\n✅ PASS - ${testId}: ${description}\n`);
  } else {
    testResults.failed++;
    console.error(`\n❌ FAIL - ${testId}: ${description}`);
    console.error(`   💬 ${message}\n`);
  }
}

/**
 * Ejecuta un test y captura errores
 */
async function runTest(testId, description, testFunction) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Ejecutando: ${testId} - ${description}`);
  console.log('='.repeat(80));

  try {
    await testFunction();
    logTestResult(testId, description, true);
  } catch (error) {
    logTestResult(testId, description, false, error.message);
    await dashboardPage.screenshot(`${testId}-FAILED`);
    console.error(`❌ Test falló pero continuando con la suite...`);
  }
}

/**
 * Hace login y espera que cargue el dashboard
 */
async function setupDashboard() {
  console.log('\n🔐 Haciendo login y esperando dashboard...');

  const { username, password } = testData.usuarios.admin;
  await loginPage.login(username, password);
  await loginPage.waitForRedirection();
  await dashboardPage.waitForPageLoad();

  await dashboardPage.screenshot('00-DASHBOARD-INITIAL');
  console.log('✅ Dashboard cargado');
}

/**
 * Reinicia para el siguiente test
 */
async function resetForNextTest() {
  console.log('\n🔄 Preparando siguiente test...');
  await dashboardPage.sleep(500);
}

/**
 * Guarda los resultados en un archivo JSON
 */
function saveResults() {
  const resultsDir = path.join(__dirname, '../../reports');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `dashboard-test-results-${timestamp}.json`;
  const filepath = path.join(resultsDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Resultados guardados en: ${filename}`);
}

// ============================================
// TC-DASH-001: Verificar elementos principales
// ============================================
async function testTC_DASH_001() {
  await resetForNextTest();

  await runTest('TC-DASH-001', 'Verificar elementos principales del Dashboard', async () => {
    // Verificar header
    const userName = await dashboardPage.getWelcomeUserName();
    if (userName !== 'admin') {
      throw new Error(`Nombre de usuario incorrecto: ${userName}`);
    }

    // Verificar cards urgentes
    const urgentVisible = await dashboardPage.areUrgentCardsVisible();
    if (!urgentVisible) {
      throw new Error('Cards de atención urgente no están visibles');
    }

    // Verificar métricas de desempeño
    const metricsVisible = await dashboardPage.arePerformanceMetricsVisible();
    if (!metricsVisible) {
      throw new Error('Métricas de desempeño no están visibles');
    }

    await dashboardPage.screenshot('TC-DASH-001-ELEMENTS');
    console.log('✓ Todos los elementos principales están visibles');
  });
}

// ============================================
// TC-DASH-002: Verificar valores de cards urgentes
// ============================================
async function testTC_DASH_002() {
  await resetForNextTest();

  await runTest('TC-DASH-002', 'Verificar valores en cards urgentes', async () => {
    const values = await dashboardPage.getUrgentCardValues();

    console.log('   📊 Valores urgentes:', values);

    // Verificar que todos los valores existan (aunque sean 0)
    if (!values.vencenHoyCount) throw new Error('Falta valor: Vencen Hoy Count');
    if (!values.vencenHoyMonto) throw new Error('Falta valor: Vencen Hoy Monto');
    if (!values.atrasados30Count) throw new Error('Falta valor: Atrasados Count');
    if (!values.atrasados30Monto) throw new Error('Falta valor: Atrasados Monto');
    if (!values.renovar30Count) throw new Error('Falta valor: Renovar Count');
    if (!values.renovar30Riesgo) throw new Error('Falta valor: Renovar Riesgo');

    await dashboardPage.screenshot('TC-DASH-002-URGENT-VALUES');
    console.log('✓ Valores de cards urgentes verificados');
  });
}

// ============================================
// TC-DASH-003: Verificar gráficas
// ============================================
async function testTC_DASH_003() {
  await resetForNextTest();

  await runTest('TC-DASH-003', 'Verificar presencia de gráficas', async () => {
    const chartsVisible = await dashboardPage.areChartsVisible();

    if (!chartsVisible) {
      throw new Error('No todas las gráficas están visibles');
    }

    await dashboardPage.screenshot('TC-DASH-003-CHARTS');
    console.log('✓ Todas las gráficas están visibles');
  });
}

// ============================================
// TC-DASH-004: Verificar antigüedad de saldos
// ============================================
async function testTC_DASH_004() {
  await resetForNextTest();

  await runTest('TC-DASH-004', 'Verificar antigüedad de saldos', async () => {
    const saldos = await dashboardPage.getAntiguedadSaldosValues();

    console.log('   💰 Antigüedad de saldos:', saldos);

    if (!saldos.alDia) throw new Error('Falta valor: Al día');
    if (!saldos.dias1_30) throw new Error('Falta valor: 1-30 días');
    if (!saldos.dias31_60) throw new Error('Falta valor: 31-60 días');
    if (!saldos.dias60Plus) throw new Error('Falta valor: +60 días');

    await dashboardPage.screenshot('TC-DASH-004-SALDOS');
    console.log('✓ Valores de antigüedad de saldos verificados');
  });
}

// ============================================
// TC-DASH-005: Verificar flujo de caja
// ============================================
async function testTC_DASH_005() {
  await resetForNextTest();

  await runTest('TC-DASH-005', 'Verificar flujo de caja', async () => {
    const flujoCaja = await dashboardPage.getFlujoCajaValues();

    console.log('   📈 Flujo de caja:', flujoCaja);

    if (!flujoCaja.esperado) throw new Error('Falta valor: Esperado');
    if (!flujoCaja.proyectado) throw new Error('Falta valor: Proyectado');
    if (!flujoCaja.brecha) throw new Error('Falta valor: Brecha');

    await dashboardPage.screenshot('TC-DASH-005-FLUJO-CAJA');
    console.log('✓ Valores de flujo de caja verificados');
  });
}

// ============================================
// TC-DASH-006: Verificar Top 5 Clientes
// ============================================
async function testTC_DASH_006() {
  await resetForNextTest();

  await runTest('TC-DASH-006', 'Verificar Top 5 Clientes', async () => {
    const isVisible = await dashboardPage.isTop5ClientesVisible();

    if (!isVisible) {
      throw new Error('Sección Top 5 Clientes no está visible');
    }

    await dashboardPage.screenshot('TC-DASH-006-TOP5');
    console.log('✓ Sección Top 5 Clientes visible');
  });
}

// ============================================
// TC-DASH-007: Verificar filtro de 7 días
// ============================================
async function testTC_DASH_007() {
  await resetForNextTest();

  await runTest('TC-DASH-007', 'Aplicar filtro de 7 días', async () => {
    await dashboardPage.clickTimeFilter(7);

    const isActive = await dashboardPage.isFilterActive(7);
    if (!isActive) {
      throw new Error('Filtro de 7 días no está activo');
    }

    const indicator = await dashboardPage.getActiveRangeIndicator();
    console.log(`   📅 Indicador: ${indicator}`);

    await dashboardPage.screenshot('TC-DASH-007-FILTER-7DAYS');
    console.log('✓ Filtro de 7 días aplicado correctamente');
  });
}

// ============================================
// TC-DASH-008: Verificar filtro de 30 días
// ============================================
async function testTC_DASH_008() {
  await resetForNextTest();

  await runTest('TC-DASH-008', 'Aplicar filtro de 30 días', async () => {
    await dashboardPage.clickTimeFilter(30);

    const isActive = await dashboardPage.isFilterActive(30);
    if (!isActive) {
      throw new Error('Filtro de 30 días no está activo');
    }

    const indicator = await dashboardPage.getActiveRangeIndicator();
    console.log(`   📅 Indicador: ${indicator}`);

    await dashboardPage.screenshot('TC-DASH-008-FILTER-30DAYS');
    console.log('✓ Filtro de 30 días aplicado correctamente');
  });
}

// ============================================
// TC-DASH-009: Verificar filtro de 90 días
// ============================================
async function testTC_DASH_009() {
  await resetForNextTest();

  await runTest('TC-DASH-009', 'Aplicar filtro de 90 días', async () => {
    await dashboardPage.clickTimeFilter(90);

    const isActive = await dashboardPage.isFilterActive(90);
    if (!isActive) {
      throw new Error('Filtro de 90 días no está activo');
    }

    const indicator = await dashboardPage.getActiveRangeIndicator();
    console.log(`   📅 Indicador: ${indicator}`);

    await dashboardPage.screenshot('TC-DASH-009-FILTER-90DAYS');
    console.log('✓ Filtro de 90 días aplicado correctamente');
  });
}

// ============================================
// TC-DASH-010: Abrir panel de rango personalizado
// ============================================
async function testTC_DASH_010() {
  await resetForNextTest();

  await runTest('TC-DASH-010', 'Abrir panel de rango personalizado', async () => {
    await dashboardPage.openCustomRangePanel();

    const isVisible = await dashboardPage.isElementVisible(dashboardPage.locators.customRangePanel);
    if (!isVisible) {
      throw new Error('Panel de rango personalizado no está visible');
    }

    await dashboardPage.screenshot('TC-DASH-010-CUSTOM-PANEL-OPEN');
    console.log('✓ Panel de rango personalizado abierto');
  });
}

// ============================================
// TC-DASH-011: Cerrar panel de rango personalizado
// ============================================
async function testTC_DASH_011() {
  await resetForNextTest();

  await runTest('TC-DASH-011', 'Cerrar panel de rango personalizado', async () => {
    // El panel puede estar abierto del test anterior, intentar abrirlo con toggle
    console.log('   🔓 Verificando que el panel se puede abrir...');
    await dashboardPage.click(dashboardPage.locators.btnCustomRange);
    await dashboardPage.sleep(500);

    // Verificar si está visible ahora
    let isVisible = await dashboardPage.isElementVisible(dashboardPage.locators.customRangePanel);

    // Si no está visible, significa que estaba abierto y se cerró al hacer clic
    // Hacemos clic de nuevo para abrirlo
    if (!isVisible) {
      console.log('   🔁 Panel estaba abierto, toggle lo cerró. Abriendo de nuevo...');
      await dashboardPage.click(dashboardPage.locators.btnCustomRange);
      await dashboardPage.sleep(500);
    }

    // Ahora cerrarlo con el botón de toggle
    console.log('   🔒 Cerrando el panel con toggle...');
    await dashboardPage.click(dashboardPage.locators.btnCustomRange);
    await dashboardPage.sleep(500);

    isVisible = await dashboardPage.isElementVisible(dashboardPage.locators.customRangePanel);
    if (isVisible) {
      throw new Error('Panel de rango personalizado todavía está visible');
    }

    await dashboardPage.screenshot('TC-DASH-011-CUSTOM-PANEL-CLOSED');
    console.log('✓ Panel de rango personalizado cerrado');
  });
}

// ========== FUNCIÓN PRINCIPAL ==========

async function runDashboardTestSuite() {
  console.log('\n' + '█'.repeat(80));
  console.log('🚀 INICIANDO SUITE DE PRUEBAS - DASHBOARD');
  console.log('█'.repeat(80));
  console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
  console.log(`📋 Total de casos: 11`);
  console.log('█'.repeat(80));

  try {
    // Inicializar driver
    console.log('\n🔧 Inicializando Electron driver...');
    driver = await createElectronDriver();

    // Inicializar Page Objects
    loginPage = new LoginPage(driver);
    dashboardPage = new DashboardPage(driver);

    // Esperar a que cargue la página de login
    await loginPage.waitForPageLoad();
    await dashboardPage.screenshot('00-INITIAL-STATE');

    // Setup inicial: Login
    await setupDashboard();

    // Ejecutar tests
    await testTC_DASH_001();
    await testTC_DASH_002();
    await testTC_DASH_003();
    await testTC_DASH_004();
    await testTC_DASH_005();
    await testTC_DASH_006();
    await testTC_DASH_007();
    await testTC_DASH_008();
    await testTC_DASH_009();
    await testTC_DASH_010();
    await testTC_DASH_011();

  } catch (error) {
    console.error('\n💥 ERROR CRÍTICO EN LA SUITE:', error.message);
    console.error(error.stack);
  } finally {
    // Resumen final
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN DE PRUEBAS - DASHBOARD');
    console.log('='.repeat(80));
    console.log(`Total de pruebas: ${testResults.total}`);
    console.log(`✅ Exitosas: ${testResults.passed}`);
    console.log(`❌ Fallidas: ${testResults.failed}`);
    console.log(`📈 Tasa de éxito: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
    console.log('='.repeat(80) + '\n');

    saveResults();

    // Cerrar driver
    if (driver) {
      await quitDriver(driver);
    }
  }
}

// Ejecutar la suite
runDashboardTestSuite().catch(console.error);
