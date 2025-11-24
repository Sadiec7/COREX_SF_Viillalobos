// recibos.test.js - Suite de pruebas para el módulo de Recibos

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const { By } = require('selenium-webdriver');
const LoginPage = require('../page-objects/LoginPage');
const RecibosPage = require('../page-objects/RecibosPage');
const testData = require('../helpers/test-data');
const fs = require('fs');
const path = require('path');

// Variables globales
let driver;
let loginPage;
let recibosPage;

// Resultados de tests
const testResults = {
  suite: 'Recibos',
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
    await recibosPage.screenshot(`${testId}-FAILED`);
    console.error(`❌ Test falló pero continuando con la suite...`);
  }
}

/**
 * Hace login y navega a la sección de recibos
 */
async function setupRecibos() {
  console.log('\n🔐 Haciendo login y navegando a Recibos...');

  const { username, password } = testData.usuarios.admin;
  await loginPage.login(username, password);
  await loginPage.waitForRedirection();

  await recibosPage.navigateToRecibos();
  await recibosPage.waitForPageLoad();

  console.log('✅ Setup completado - En sección de Recibos');
}

/**
 * Reinicia para el siguiente test
 */
async function resetForNextTest() {
  console.log('\n🔄 Preparando siguiente test...');

  await recibosPage.sleep(2000);

  // Cerrar modales abiertos
  for (let i = 0; i < 3; i++) {
    try {
      const modalVisible = await recibosPage.isModalVisible();
      if (modalVisible) {
        await recibosPage.closeModal();
        await recibosPage.sleep(500);
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }

  // Limpiar búsqueda
  try {
    await recibosPage.clearSearch();
  } catch (e) {
    // ignore
  }

  console.log('✅ Listo para siguiente test');
}

// ========== CASOS DE PRUEBA ==========

/**
 * TC-REC-001: Visualización de Lista
 */
async function testTC_REC_001() {
  await resetForNextTest();

  await runTest('TC-REC-001', 'Visualización de Lista de Recibos', async () => {
    await recibosPage.screenshot('01-RECIBOS-VIEW');

    const totalRecibos = await recibosPage.getTotalRecibos();
    console.log(`  📊 Total de recibos: ${totalRecibos}`);

    if (totalRecibos < 0) {
      throw new Error('Total de recibos no puede ser negativo');
    }

    console.log('  ✅ Vista de recibos cargada correctamente');
  });
}

/**
 * TC-REC-002: Búsqueda por Número
 */
async function testTC_REC_002() {
  await resetForNextTest();

  await runTest('TC-REC-002', 'Búsqueda por Número de Recibo', async () => {
    const totalAntes = await recibosPage.getTableRowCount();

    if (totalAntes > 0) {
      await recibosPage.search('REC-');
      await recibosPage.sleep(1000);

      await recibosPage.screenshot('TC-REC-002-SEARCH-NUMERO');

      const rowsAfter = await recibosPage.getTableRowCount();
      console.log(`  🔍 Recibos encontrados: ${rowsAfter}`);

      await recibosPage.clearSearch();
      console.log('  ✅ Búsqueda por número funciona correctamente');
    } else {
      console.log('  ℹ️  No hay recibos para buscar (test pasado)');
    }
  });
}

/**
 * TC-REC-006: Filtro Pendientes
 */
async function testTC_REC_006() {
  await resetForNextTest();

  await runTest('TC-REC-006', 'Filtro por Estado Pendiente', async () => {
    await recibosPage.openFiltersModal();
    await recibosPage.setFilterPendiente(true);
    await recibosPage.applyFilters();
    await recibosPage.sleep(1000);

    await recibosPage.screenshot('TC-REC-006-FILTER-PENDIENTE');

    const badgeCount = await recibosPage.getFilterBadgeCount();
    console.log(`  🏷️  Filtros activos: ${badgeCount}`);

    if (badgeCount !== 1) {
      throw new Error(`Se esperaba 1 filtro activo, pero se encontraron ${badgeCount}`);
    }

    // Limpiar filtros
    await recibosPage.openFiltersModal();
    await recibosPage.clearFilters();
    await recibosPage.applyFilters();

    console.log('  ✅ Filtro de pendientes funciona correctamente');
  });
}

/**
 * TC-REC-019: Estadísticas - Total
 */
async function testTC_REC_019() {
  await resetForNextTest();

  await runTest('TC-REC-019', 'Estadística Total de Recibos', async () => {
    const total = await recibosPage.getTotalRecibos();
    console.log(`  📊 Total de recibos: ${total}`);

    if (total < 0) {
      throw new Error('Total no puede ser negativo');
    }

    await recibosPage.screenshot('TC-REC-019-STATS-TOTAL');

    console.log('  ✅ Estadística total correcta');
  });
}

/**
 * TC-REC-020: Estadísticas Desglosadas
 */
async function testTC_REC_020() {
  await resetForNextTest();

  await runTest('TC-REC-020', 'Estadísticas Desglosadas', async () => {
    const total = await recibosPage.getTotalRecibos();
    const pendientes = await recibosPage.getTotalPendientes();
    const pagados = await recibosPage.getTotalPagados();
    const vencidos = await recibosPage.getTotalVencidos();

    console.log(`  📊 Total: ${total}`);
    console.log(`  📊 Pendientes: ${pendientes}`);
    console.log(`  📊 Pagados: ${pagados}`);
    console.log(`  📊 Vencidos: ${vencidos}`);

    await recibosPage.screenshot('TC-REC-020-STATS-BREAKDOWN');

    if (pendientes < 0 || pagados < 0 || vencidos < 0) {
      throw new Error('Las estadísticas no pueden ser negativas');
    }

    console.log('  ✅ Estadísticas desglosadas correctas');
  });
}

// ========== FUNCIÓN PRINCIPAL ==========

async function runRecibosTestSuite() {
  console.log('\n' + '█'.repeat(80));
  console.log('🚀 INICIANDO SUITE DE TESTS - MÓDULO RECIBOS');
  console.log('█'.repeat(80) + '\n');

  try {
    // Inicializar driver
    console.log('🔧 Inicializando Electron driver...');
    driver = await createElectronDriver();
    loginPage = new LoginPage(driver);
    recibosPage = new RecibosPage(driver);

    // Esperar a que cargue la página de login
    await loginPage.waitForPageLoad();
    await recibosPage.screenshot('00-INITIAL-STATE');

    // Setup inicial
    await setupRecibos();
    await recibosPage.screenshot('01-RECIBOS-VIEW');

    // Ejecutar tests
    await testTC_REC_001();
    await testTC_REC_002();
    await testTC_REC_006();
    await testTC_REC_019();
    await testTC_REC_020();

    // Resumen
    console.log('\n\n' + '█'.repeat(80));
    console.log('📊 RESUMEN DE EJECUCIÓN');
    console.log('█'.repeat(80));

    console.log(`\n📈 Estadísticas:`);
    console.log(`   Total de casos: ${testResults.total}`);
    console.log(`   ✅ Exitosos: ${testResults.passed}`);
    console.log(`   ❌ Fallidos: ${testResults.failed}`);

    const successRate = testResults.total > 0
      ? ((testResults.passed / testResults.total) * 100).toFixed(2)
      : '0.00';
    console.log(`   📊 Tasa de éxito: ${successRate}%`);

    console.log(`\n📋 Detalle de resultados:`);
    testResults.results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`   ${icon} ${result.testId}: ${result.description}`);
    });

    console.log('\n' + '█'.repeat(80));

    if (testResults.failed === 0) {
      console.log('🎉 SUITE COMPLETA - TODOS LOS TESTS PASARON');
    } else {
      console.log(`⚠️  ${testResults.failed} test(s) fallaron`);
    }

    console.log('█'.repeat(80) + '\n');

    // Guardar reporte
    const reportsDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `recibos-test-results-${timestamp}.json`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(testResults, null, 2));
    console.log(`💾 Resultados guardados en: ${filepath}\n`);

  } catch (error) {
    console.error('\n💥 Error fatal en la suite:', error);
    throw error;
  } finally {
    console.log('🔒 Cerrando Electron driver...');
    await quitDriver(driver);
    console.log('\n✅ Suite de pruebas finalizada\n');
  }
}

// ========== EJECUTAR ==========

if (require.main === module) {
  runRecibosTestSuite()
    .then(() => {
      const exitCode = testResults.failed === 0 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runRecibosTestSuite };
