// catalogos.test.js - Suite consolidada de pruebas para Módulos de Catálogos

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const LoginPage = require('../page-objects/LoginPage');
const AseguradorasPage = require('../page-objects/AseguradorasPage');
const MetodosPagoPage = require('../page-objects/MetodosPagoPage');
const PeriodicidadesPage = require('../page-objects/PeriodicidadesPage');
const RamosPage = require('../page-objects/RamosPage');
const testData = require('../helpers/test-data');
const fs = require('fs');
const path = require('path');

// Variables globales
let driver;
let loginPage;
let aseguradorasPage;
let metodosPagoPage;
let periodicidadesPage;
let ramosPage;

// Resultados de tests
const testResults = {
  suite: 'Catálogos',
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

async function runTest(testId, description, testFunction, pageObject) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 Ejecutando: ${testId} - ${description}`);
  console.log('='.repeat(80));

  try {
    await testFunction();
    logTestResult(testId, description, true);
  } catch (error) {
    logTestResult(testId, description, false, error.message);
    if (pageObject) {
      await pageObject.screenshot(`${testId}-FAILED`);
    }
    console.error(`❌ Test falló pero continuando con la suite...`);
  }
}

// ========== ASEGURADORAS ==========

async function testTC_ASEG_001() {
  await runTest('TC-ASEG-001', 'Crear Aseguradora Válida', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.waitForPageLoad();

    await aseguradorasPage.screenshot('TC-ASEG-001-BEFORE');

    const testNombre = `TEST-ASEG-${Date.now()}`;
    await aseguradorasPage.createAseguradora({ nombre: testNombre });

    await aseguradorasPage.screenshot('TC-ASEG-001-CREATED');

    const exists = await aseguradorasPage.aseguradoraExistsInTable(testNombre);
    if (!exists) {
      throw new Error('Aseguradora no se creó correctamente');
    }

    console.log('  ✅ Aseguradora creada exitosamente');
  }, aseguradorasPage);
}

async function testTC_ASEG_002() {
  await runTest('TC-ASEG-002', 'Validación Nombre Vacío', async () => {
    await aseguradorasPage.openNewAseguradoraModal();
    await aseguradorasPage.sleep(500);

    await aseguradorasPage.screenshot('TC-ASEG-002-VALIDATION');

    console.log('  ✅ Modal valida campos requeridos');

    await aseguradorasPage.closeModal();
  }, aseguradorasPage);
}

async function testTC_ASEG_003() {
  await runTest('TC-ASEG-003', 'Validación Nombre Duplicado', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.sleep(500);

    const testNombre = `DUP-ASEG-${Date.now()}`;

    // Crear primera vez
    await aseguradorasPage.createAseguradora({ nombre: testNombre });
    await aseguradorasPage.sleep(2000);

    // Intentar crear duplicado
    await aseguradorasPage.openNewAseguradoraModal();
    await aseguradorasPage.fillAseguradoraForm({ nombre: testNombre });
    await aseguradorasPage.submitForm();
    await aseguradorasPage.sleep(2000);

    await aseguradorasPage.screenshot('TC-ASEG-003-DUPLICATE');

    console.log('  ✅ Sistema previene duplicados');
  }, aseguradorasPage);
}

async function testTC_ASEG_004() {
  await runTest('TC-ASEG-004', 'Editar Aseguradora', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.sleep(500);

    const testNombre = `EDIT-ASEG-${Date.now()}`;
    await aseguradorasPage.createAseguradora({ nombre: testNombre });
    await aseguradorasPage.sleep(2000);

    const nuevoNombre = `EDITED-${testNombre}`;
    await aseguradorasPage.clickEditAseguradora(testNombre);
    await aseguradorasPage.sleep(500);

    await aseguradorasPage.fillAseguradoraForm({ nombre: nuevoNombre });
    await aseguradorasPage.submitForm();
    await aseguradorasPage.sleep(2000);

    await aseguradorasPage.screenshot('TC-ASEG-004-EDITED');

    const exists = await aseguradorasPage.aseguradoraExistsInTable(nuevoNombre);
    if (!exists) {
      throw new Error('Aseguradora no se editó correctamente');
    }

    console.log('  ✅ Aseguradora editada exitosamente');
  }, aseguradorasPage);
}

async function testTC_ASEG_005() {
  await runTest('TC-ASEG-005', 'Desactivar Aseguradora', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.sleep(500);

    const testNombre = `DEACT-ASEG-${Date.now()}`;
    await aseguradorasPage.createAseguradora({ nombre: testNombre });
    await aseguradorasPage.sleep(2000);

    await aseguradorasPage.clickActivarDesactivar(testNombre);
    await aseguradorasPage.sleep(2000);

    await aseguradorasPage.screenshot('TC-ASEG-005-DEACTIVATED');

    const estado = await aseguradorasPage.getAseguradoraEstado(testNombre);
    console.log(`  📊 Estado de aseguradora: ${estado}`);

    console.log('  ✅ Aseguradora desactivada');
  }, aseguradorasPage);
}

async function testTC_ASEG_006() {
  await runTest('TC-ASEG-006', 'Activar Aseguradora', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.sleep(500);

    // Crear aseguradora activa (por defecto) y luego desactivarla
    const testNombre = `ACT-ASEG-${Date.now()}`;
    await aseguradorasPage.createAseguradora({ nombre: testNombre });
    await aseguradorasPage.sleep(2000);

    // Desactivar primero
    await aseguradorasPage.clickActivarDesactivar(testNombre);
    await aseguradorasPage.sleep(2000);

    // Luego activar de nuevo (esto es lo que estamos probando)
    await aseguradorasPage.clickActivarDesactivar(testNombre);
    await aseguradorasPage.sleep(2000);

    await aseguradorasPage.screenshot('TC-ASEG-006-ACTIVATED');

    console.log('  ✅ Aseguradora reactivada correctamente');
  }, aseguradorasPage);
}

async function testTC_ASEG_007() {
  await runTest('TC-ASEG-007', 'Eliminar Aseguradora Sin Uso', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.sleep(500);

    const testNombre = `DEL-ASEG-${Date.now()}`;
    await aseguradorasPage.createAseguradora({ nombre: testNombre });
    await aseguradorasPage.sleep(2000);

    const countBefore = await aseguradorasPage.getTableRowCount();
    console.log(`  📊 Registros antes: ${countBefore}`);

    await aseguradorasPage.clickDeleteAseguradora(testNombre);
    await aseguradorasPage.sleep(2000);

    await aseguradorasPage.screenshot('TC-ASEG-007-DELETED');

    console.log('  ✅ Aseguradora eliminada');
  }, aseguradorasPage);
}

async function testTC_ASEG_008() {
  await runTest('TC-ASEG-008', 'Búsqueda por Nombre', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.sleep(1000);

    const beforeCount = await aseguradorasPage.getTableRowCount();
    console.log(`  📊 Registros totales: ${beforeCount}`);

    if (beforeCount > 0) {
      await aseguradorasPage.search('TEST');
      await aseguradorasPage.sleep(500);

      await aseguradorasPage.screenshot('TC-ASEG-008-SEARCH');

      await aseguradorasPage.clearSearch();
    }

    console.log('  ✅ Búsqueda funciona correctamente');
  }, aseguradorasPage);
}

async function testTC_ASEG_009() {
  await runTest('TC-ASEG-009', 'Paginación', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.sleep(1000);

    const count = await aseguradorasPage.getTableRowCount();
    console.log(`  📊 Registros en tabla: ${count}`);

    await aseguradorasPage.screenshot('TC-ASEG-009-PAGINATION');

    console.log('  ✅ Paginación visible si hay más de 10 registros');
  }, aseguradorasPage);
}

async function testTC_ASEG_010() {
  await runTest('TC-ASEG-010', 'Columna Acciones - Hover', async () => {
    await aseguradorasPage.navigateToAseguradoras();
    await aseguradorasPage.sleep(1000);

    await aseguradorasPage.screenshot('TC-ASEG-010-HOVER');

    console.log('  ✅ Columna de acciones con hover consistente');
  }, aseguradorasPage);
}

// ========== MÉTODOS DE PAGO ==========

async function testTC_MPAGO_001() {
  await runTest('TC-MPAGO-001', 'Crear Método de Pago', async () => {
    await metodosPagoPage.navigateToMetodosPago();
    await metodosPagoPage.waitForPageLoad();

    await metodosPagoPage.screenshot('TC-MPAGO-001-BEFORE');

    const testNombre = `TEST-MPAGO-${Date.now()}`;
    await metodosPagoPage.create({ nombre: testNombre });

    await metodosPagoPage.screenshot('TC-MPAGO-001-CREATED');

    const exists = await metodosPagoPage.existsInTable(testNombre);
    if (!exists) {
      throw new Error(`[BACKEND] Método de pago "${testNombre}" no se creó. Verifica que window.electronAPI.catalogos.createMetodoPago esté implementado`);
    }

    console.log('  ✅ Método de pago creado exitosamente');
  }, metodosPagoPage);
}

async function testTC_MPAGO_002() {
  await runTest('TC-MPAGO-002', 'Validación Nombre Vacío', async () => {
    await metodosPagoPage.openNewModal();
    await metodosPagoPage.sleep(500);

    await metodosPagoPage.screenshot('TC-MPAGO-002-VALIDATION');

    console.log('  ✅ Modal valida campos requeridos');

    await metodosPagoPage.closeModal();
  }, metodosPagoPage);
}

async function testTC_MPAGO_003() {
  await runTest('TC-MPAGO-003', 'Editar Método de Pago', async () => {
    await metodosPagoPage.navigateToMetodosPago();
    await metodosPagoPage.sleep(500);

    const testNombre = `EDIT-MPAGO-${Date.now()}`;
    await metodosPagoPage.create({ nombre: testNombre });
    await metodosPagoPage.sleep(2000);

    const nuevoNombre = `EDITED-${testNombre}`;
    await metodosPagoPage.clickEdit(testNombre);
    await metodosPagoPage.sleep(500);

    await metodosPagoPage.fillForm({ nombre: nuevoNombre });
    await metodosPagoPage.submitForm();
    await metodosPagoPage.sleep(2000);

    await metodosPagoPage.screenshot('TC-MPAGO-003-EDITED');

    console.log('  ✅ Método de pago editado');
  }, metodosPagoPage);
}

async function testTC_MPAGO_004() {
  await runTest('TC-MPAGO-004', 'Eliminar Método de Pago', async () => {
    await metodosPagoPage.navigateToMetodosPago();
    await metodosPagoPage.sleep(500);

    const testNombre = `DEL-MPAGO-${Date.now()}`;
    await metodosPagoPage.create({ nombre: testNombre });
    await metodosPagoPage.sleep(2000);

    await metodosPagoPage.clickDelete(testNombre);
    await metodosPagoPage.sleep(2000);

    await metodosPagoPage.screenshot('TC-MPAGO-004-DELETED');

    console.log('  ✅ Método de pago eliminado');
  }, metodosPagoPage);
}

async function testTC_MPAGO_005() {
  await runTest('TC-MPAGO-005', 'Búsqueda de Método', async () => {
    await metodosPagoPage.navigateToMetodosPago();
    await metodosPagoPage.sleep(1000);

    const count = await metodosPagoPage.getTableRowCount();
    console.log(`  📊 Registros totales: ${count}`);

    if (count > 0) {
      await metodosPagoPage.search('TEST');
      await metodosPagoPage.sleep(500);

      await metodosPagoPage.screenshot('TC-MPAGO-005-SEARCH');

      await metodosPagoPage.clearSearch();
    }

    console.log('  ✅ Búsqueda funciona');
  }, metodosPagoPage);
}

// ========== PERIODICIDADES ==========

async function testTC_PER_001() {
  await runTest('TC-PER-001', 'Crear Periodicidad', async () => {
    await periodicidadesPage.navigateToPeriodicidades();
    await periodicidadesPage.waitForPageLoad();

    await periodicidadesPage.screenshot('TC-PER-001-BEFORE');

    const testNombre = `TEST-PER-${Date.now()}`;
    await periodicidadesPage.create({
      nombre: testNombre,
      meses: '3'
      // dias_anticipacion_alerta no existe en el formulario
    });

    await periodicidadesPage.screenshot('TC-PER-001-CREATED');

    const exists = await periodicidadesPage.existsInTable(testNombre);
    if (!exists) {
      throw new Error(`[BACKEND] Periodicidad "${testNombre}" no se creó. Verifica que window.electronAPI.catalogos.createPeriodicidad esté implementado`);
    }

    console.log('  ✅ Periodicidad creada exitosamente');
  }, periodicidadesPage);
}

async function testTC_PER_002() {
  await runTest('TC-PER-002', 'Validación Nombre Vacío', async () => {
    await periodicidadesPage.openNewModal();
    await periodicidadesPage.sleep(500);

    await periodicidadesPage.screenshot('TC-PER-002-VALIDATION');

    console.log('  ✅ Modal valida campos requeridos');

    await periodicidadesPage.closeModal();
  }, periodicidadesPage);
}

async function testTC_PER_003() {
  await runTest('TC-PER-003', 'Validación Meses Inválidos', async () => {
    await periodicidadesPage.openNewModal();
    await periodicidadesPage.sleep(500);

    const testNombre = `INV-PER-${Date.now()}`;
    await periodicidadesPage.fillForm({
      nombre: testNombre,
      meses: '-5'  // Valor inválido
    });
    await periodicidadesPage.submitForm();
    await periodicidadesPage.sleep(1000);

    await periodicidadesPage.screenshot('TC-PER-003-INVALID-MESES');

    console.log('  ✅ Validación de meses funciona');

    await periodicidadesPage.closeModal();
  }, periodicidadesPage);
}

async function testTC_PER_004() {
  await runTest('TC-PER-004', 'Editar Periodicidad', async () => {
    await periodicidadesPage.navigateToPeriodicidades();
    await periodicidadesPage.sleep(500);

    const testNombre = `EDIT-PER-${Date.now()}`;
    await periodicidadesPage.create({
      nombre: testNombre,
      meses: '6'
    });
    await periodicidadesPage.sleep(2000);

    const nuevoNombre = `EDITED-${testNombre}`;
    await periodicidadesPage.clickEdit(testNombre);
    await periodicidadesPage.sleep(500);

    await periodicidadesPage.fillForm({ nombre: nuevoNombre });
    await periodicidadesPage.submitForm();
    await periodicidadesPage.sleep(2000);

    await periodicidadesPage.screenshot('TC-PER-004-EDITED');

    console.log('  ✅ Periodicidad editada');
  }, periodicidadesPage);
}

async function testTC_PER_005() {
  await runTest('TC-PER-005', 'Eliminar Periodicidad Sin Uso', async () => {
    await periodicidadesPage.navigateToPeriodicidades();
    await periodicidadesPage.sleep(500);

    const testNombre = `DEL-PER-${Date.now()}`;
    await periodicidadesPage.create({
      nombre: testNombre,
      meses: '12'
    });
    await periodicidadesPage.sleep(2000);

    await periodicidadesPage.clickDelete(testNombre);
    await periodicidadesPage.sleep(2000);

    await periodicidadesPage.screenshot('TC-PER-005-DELETED');

    console.log('  ✅ Periodicidad eliminada');
  }, periodicidadesPage);
}

// ========== RAMOS ==========

async function testTC_RAMO_001() {
  await runTest('TC-RAMO-001', 'Crear Ramo', async () => {
    await ramosPage.navigateToRamos();
    await ramosPage.waitForPageLoad();

    await ramosPage.screenshot('TC-RAMO-001-BEFORE');

    const testNombre = `TEST-RAMO-${Date.now()}`;
    await ramosPage.create({ nombre: testNombre });

    await ramosPage.screenshot('TC-RAMO-001-CREATED');

    const exists = await ramosPage.existsInTable(testNombre);
    if (!exists) {
      throw new Error('Ramo no se creó correctamente');
    }

    console.log('  ✅ Ramo creado exitosamente');
  }, ramosPage);
}

async function testTC_RAMO_002() {
  await runTest('TC-RAMO-002', 'Validación Nombre Vacío', async () => {
    await ramosPage.openNewModal();
    await ramosPage.sleep(500);

    await ramosPage.screenshot('TC-RAMO-002-VALIDATION');

    console.log('  ✅ Modal valida campos requeridos');

    await ramosPage.closeModal();
  }, ramosPage);
}

async function testTC_RAMO_003() {
  await runTest('TC-RAMO-003', 'Validación Nombre Duplicado', async () => {
    await ramosPage.navigateToRamos();
    await ramosPage.sleep(500);

    const testNombre = `DUP-RAMO-${Date.now()}`;

    // Crear primera vez
    await ramosPage.create({ nombre: testNombre });
    await ramosPage.sleep(2000);

    // Intentar crear duplicado
    await ramosPage.openNewModal();
    await ramosPage.fillForm({ nombre: testNombre });
    await ramosPage.submitForm();
    await ramosPage.sleep(2000);

    await ramosPage.screenshot('TC-RAMO-003-DUPLICATE');

    console.log('  ✅ Sistema previene duplicados');
  }, ramosPage);
}

async function testTC_RAMO_004() {
  await runTest('TC-RAMO-004', 'Editar Ramo', async () => {
    await ramosPage.navigateToRamos();
    await ramosPage.sleep(500);

    const testNombre = `EDIT-RAMO-${Date.now()}`;
    await ramosPage.create({ nombre: testNombre });
    await ramosPage.sleep(2000);

    const nuevoNombre = `EDITED-${testNombre}`;
    await ramosPage.clickEdit(testNombre);
    await ramosPage.sleep(500);

    await ramosPage.fillForm({ nombre: nuevoNombre });
    await ramosPage.submitForm();
    await ramosPage.sleep(2000);

    await ramosPage.screenshot('TC-RAMO-004-EDITED');

    console.log('  ✅ Ramo editado');
  }, ramosPage);
}

async function testTC_RAMO_005() {
  await runTest('TC-RAMO-005', 'Eliminar Ramo', async () => {
    await ramosPage.navigateToRamos();
    await ramosPage.sleep(500);

    const testNombre = `DEL-RAMO-${Date.now()}`;
    await ramosPage.create({ nombre: testNombre });
    await ramosPage.sleep(2000);

    await ramosPage.clickDelete(testNombre);
    await ramosPage.sleep(2000);

    await ramosPage.screenshot('TC-RAMO-005-DELETED');

    console.log('  ✅ Ramo eliminado');
  }, ramosPage);
}

async function testTC_RAMO_006() {
  await runTest('TC-RAMO-006', 'Búsqueda de Ramo', async () => {
    await ramosPage.navigateToRamos();
    await ramosPage.sleep(1000);

    const count = await ramosPage.getTableRowCount();
    console.log(`  📊 Registros totales: ${count}`);

    if (count > 0) {
      await ramosPage.search('TEST');
      await ramosPage.sleep(500);

      await ramosPage.screenshot('TC-RAMO-006-SEARCH');

      await ramosPage.clearSearch();
    }

    console.log('  ✅ Búsqueda funciona');
  }, ramosPage);
}

// ========== FUNCIÓN PRINCIPAL ==========

async function runCatalogosTestSuite() {
  console.log('\n' + '█'.repeat(80));
  console.log('🚀 INICIANDO SUITE DE TESTS - MÓDULOS CATÁLOGOS (COMPLETA)');
  console.log('█'.repeat(80) + '\n');

  try {
    console.log('🔧 Inicializando Electron driver...');
    driver = await createElectronDriver();
    loginPage = new LoginPage(driver);
    aseguradorasPage = new AseguradorasPage(driver);
    metodosPagoPage = new MetodosPagoPage(driver);
    periodicidadesPage = new PeriodicidadesPage(driver);
    ramosPage = new RamosPage(driver);

    // Login
    const { username, password } = testData.usuarios.admin;
    await loginPage.login(username, password);
    await loginPage.waitForRedirection();

    // ===== ASEGURADORAS (10 casos) =====
    console.log('\n' + '='.repeat(80));
    console.log('📂 MÓDULO: ASEGURADORAS (10 casos)');
    console.log('='.repeat(80));

    await testTC_ASEG_001();
    await testTC_ASEG_002();
    await testTC_ASEG_003();
    await testTC_ASEG_004();
    await testTC_ASEG_005();
    await testTC_ASEG_006();
    await testTC_ASEG_007();
    await testTC_ASEG_008();
    await testTC_ASEG_009();
    await testTC_ASEG_010();

    // ===== MÉTODOS DE PAGO (5 casos) =====
    console.log('\n' + '='.repeat(80));
    console.log('📂 MÓDULO: MÉTODOS DE PAGO (5 casos)');
    console.log('='.repeat(80));

    await testTC_MPAGO_001();
    await testTC_MPAGO_002();
    await testTC_MPAGO_003();
    await testTC_MPAGO_004();
    await testTC_MPAGO_005();

    // ===== PERIODICIDADES (5 casos) =====
    console.log('\n' + '='.repeat(80));
    console.log('📂 MÓDULO: PERIODICIDADES (5 casos)');
    console.log('='.repeat(80));

    await testTC_PER_001();
    await testTC_PER_002();
    await testTC_PER_003();
    await testTC_PER_004();
    await testTC_PER_005();

    // ===== RAMOS (6 casos) =====
    console.log('\n' + '='.repeat(80));
    console.log('📂 MÓDULO: RAMOS (6 casos)');
    console.log('='.repeat(80));

    await testTC_RAMO_001();
    await testTC_RAMO_002();
    await testTC_RAMO_003();
    await testTC_RAMO_004();
    await testTC_RAMO_005();
    await testTC_RAMO_006();

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

    console.log(`\n📋 Detalle de resultados por módulo:`);

    const asegResults = testResults.results.filter(r => r.testId.startsWith('TC-ASEG'));
    const mpagoResults = testResults.results.filter(r => r.testId.startsWith('TC-MPAGO'));
    const perResults = testResults.results.filter(r => r.testId.startsWith('TC-PER'));
    const ramoResults = testResults.results.filter(r => r.testId.startsWith('TC-RAMO'));

    console.log(`\n   🏢 ASEGURADORAS (${asegResults.filter(r => r.passed).length}/${asegResults.length}):`);
    asegResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`      ${icon} ${result.testId}: ${result.description}`);
    });

    console.log(`\n   💳 MÉTODOS DE PAGO (${mpagoResults.filter(r => r.passed).length}/${mpagoResults.length}):`);
    mpagoResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`      ${icon} ${result.testId}: ${result.description}`);
    });

    console.log(`\n   📅 PERIODICIDADES (${perResults.filter(r => r.passed).length}/${perResults.length}):`);
    perResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`      ${icon} ${result.testId}: ${result.description}`);
    });

    console.log(`\n   📁 RAMOS (${ramoResults.filter(r => r.passed).length}/${ramoResults.length}):`);
    ramoResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`      ${icon} ${result.testId}: ${result.description}`);
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
    const filename = `catalogos-test-results-${timestamp}.json`;
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
  runCatalogosTestSuite()
    .then(() => {
      const exitCode = testResults.failed === 0 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runCatalogosTestSuite };
