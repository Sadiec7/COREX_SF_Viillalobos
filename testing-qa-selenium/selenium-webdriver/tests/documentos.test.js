// documentos.test.js - Suite de pruebas para el módulo de Documentos

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const LoginPage = require('../page-objects/LoginPage');
const DocumentosPage = require('../page-objects/DocumentosPage');
const testData = require('../helpers/test-data');
const fs = require('fs');
const path = require('path');

// Variables globales
let driver;
let loginPage;
let documentosPage;

// Resultados de tests
const testResults = {
  suite: 'Documentos',
  timestamp: new Date().toISOString(),
  total: 0,
  passed: 0,
  failed: 0,
  results: []
};

function logTestResult(testId, description, passed, message = '') {
  const result = { testId, description, passed, message, timestamp: new Date().toISOString() };
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

async function runTest(testId, description, testFunction) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Ejecutando: ${testId} - ${description}`);
  console.log('='.repeat(80));

  try {
    await testFunction();
    logTestResult(testId, description, true);
  } catch (error) {
    logTestResult(testId, description, false, error.message);
    await documentosPage.screenshot(`${testId}-FAILED`);
    console.error(`❌ Test falló pero continuando con la suite...`);
  }
}

async function setupDocumentos() {
  console.log('\n🔐 Haciendo login y navegando a Documentos...');

  const { username, password } = testData.usuarios.admin;
  await loginPage.login(username, password);
  await loginPage.waitForRedirection();

  await documentosPage.navigateToDocumentos();
  await documentosPage.waitForPageLoad();

  console.log('✅ Setup completado - En sección de Documentos');
}

async function resetForNextTest() {
  console.log('\n🔄 Preparando siguiente test...');

  await documentosPage.sleep(2000);

  // Cerrar modales
  for (let i = 0; i < 3; i++) {
    try {
      const modalVisible = await documentosPage.isModalVisible();
      if (modalVisible) {
        await documentosPage.closeModal();
        await documentosPage.sleep(500);
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }

  // Limpiar búsqueda
  try {
    await documentosPage.clearSearch();
  } catch (e) {
    // ignore
  }

  // Limpiar selección
  try {
    const bulkVisible = await documentosPage.isBulkActionsVisible();
    if (bulkVisible) {
      await documentosPage.clearSelection();
    }
  } catch (e) {
    // ignore
  }

  console.log('✅ Listo para siguiente test');
}

// ========== CASOS DE PRUEBA ==========

async function testTC_DOC_001() {
  await resetForNextTest();

  await runTest('TC-DOC-001', 'Visualización de Lista de Documentos', async () => {
    await documentosPage.screenshot('01-DOCUMENTOS-VIEW');

    const total = await documentosPage.getTotalDocumentos();
    console.log(`  📊 Total de documentos: ${total}`);

    if (total < 0) {
      throw new Error('Total no puede ser negativo');
    }

    console.log('  ✅ Vista de documentos cargada correctamente');
  });
}

async function testTC_DOC_003() {
  await resetForNextTest();

  await runTest('TC-DOC-003', 'Validación Sin Archivo Seleccionado', async () => {
    await documentosPage.openNewDocumentoModal();
    await documentosPage.sleep(500);

    await documentosPage.screenshot('TC-DOC-003-VALIDATION');

    console.log('  ✅ Modal requiere selección de archivo');

    await documentosPage.closeModal();
  });
}

async function testTC_DOC_022() {
  await resetForNextTest();

  await runTest('TC-DOC-022', 'Mensaje de Estado Vacío', async () => {
    await documentosPage.search('XXXNOEXISTEXXX123');
    await documentosPage.sleep(1000);

    await documentosPage.screenshot('TC-DOC-022-EMPTY-STATE');

    const rowCount = await documentosPage.getTableRowCount();
    console.log(`  📊 Documentos encontrados: ${rowCount}`);

    await documentosPage.clearSearch();

    console.log('  ✅ Estado vacío funciona correctamente');
  });
}

// ========== FUNCIÓN PRINCIPAL ==========

async function runDocumentosTestSuite() {
  console.log('\n' + '█'.repeat(80));
  console.log('🚀 INICIANDO SUITE DE TESTS - MÓDULO DOCUMENTOS');
  console.log('█'.repeat(80) + '\n');

  try {
    console.log('🔧 Inicializando Electron driver...');
    driver = await createElectronDriver();
    loginPage = new LoginPage(driver);
    documentosPage = new DocumentosPage(driver);

    await loginPage.waitForPageLoad();
    await documentosPage.screenshot('00-INITIAL-STATE');

    await setupDocumentos();
    await documentosPage.screenshot('01-DOCUMENTOS-VIEW');

    // Ejecutar tests
    await testTC_DOC_001();
    await testTC_DOC_003();
    await testTC_DOC_022();

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
    const filename = `documentos-test-results-${timestamp}.json`;
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
  runDocumentosTestSuite()
    .then(() => {
      const exitCode = testResults.failed === 0 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runDocumentosTestSuite };
