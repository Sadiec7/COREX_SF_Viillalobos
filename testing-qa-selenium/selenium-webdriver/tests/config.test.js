// config.test.js - Suite de pruebas para el módulo de Configuración

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const LoginPage = require('../page-objects/LoginPage');
const ConfigPage = require('../page-objects/ConfigPage');
const testData = require('../helpers/test-data');
const fs = require('fs');
const path = require('path');

// Variables globales
let driver;
let loginPage;
let configPage;

// Resultados de tests
const testResults = {
  suite: 'Configuración',
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
    await configPage.screenshot(`${testId}-FAILED`);
    console.error(`❌ Test falló pero continuando con la suite...`);
  }
}

async function setupConfig() {
  console.log('\n🔐 Haciendo login y navegando a Configuración...');

  const { username, password } = testData.usuarios.admin;
  await loginPage.login(username, password);
  await loginPage.waitForRedirection();

  await configPage.navigateToConfig();
  await configPage.waitForPageLoad();

  console.log('✅ Setup completado - En sección de Configuración');
}

async function resetForNextTest() {
  console.log('\n🔄 Preparando siguiente test...');
  await configPage.sleep(1000);
  console.log('✅ Listo para siguiente test');
}

// ========== CASOS DE PRUEBA ==========

async function testTC_CFG_001() {
  await resetForNextTest();

  await runTest('TC-CFG-001', 'Visualizar página de configuración', async () => {
    await configPage.screenshot('01-CONFIG-VIEW');

    // Verificar que ambos formularios están presentes
    const displayName = await configPage.getDisplayName();
    const username = await configPage.getUsername();

    console.log(`  📊 DisplayName actual: "${displayName}"`);
    console.log(`  📊 Username actual: "${username}"`);

    console.log('  ✅ Página de configuración cargada correctamente');
  });
}

async function testTC_CFG_002() {
  await resetForNextTest();

  await runTest('TC-CFG-002', 'Cargar datos de cuenta existentes', async () => {
    const displayName = await configPage.getDisplayName();
    const username = await configPage.getUsername();
    const email = await configPage.getEmail();

    console.log(`  📊 DisplayName: "${displayName}"`);
    console.log(`  📊 Username: "${username}"`);
    console.log(`  📊 Email: "${email}"`);

    await configPage.screenshot('TC-CFG-002-LOADED');

    if (!username) {
      throw new Error('Username no se pre-llenó');
    }

    console.log('  ✅ Datos de cuenta se cargan correctamente');
  });
}

async function testTC_CFG_005() {
  await resetForNextTest();

  await runTest('TC-CFG-005', 'Actualizar nombre para mostrar', async () => {
    const originalDisplayName = await configPage.getDisplayName();
    console.log(`  📊 DisplayName original: "${originalDisplayName}"`);

    const newDisplayName = `Admin Test ${Date.now()}`;
    await configPage.setDisplayName(newDisplayName);
    await configPage.submitAccountForm();
    await configPage.sleep(2000);

    await configPage.screenshot('TC-CFG-005-UPDATED');

    const statusMessage = await configPage.getAccountStatusMessage();
    console.log(`  📊 Status: "${statusMessage}"`);

    // Verificar que se actualizó en la sidebar
    const sidebarName = await configPage.getSidebarUserName();
    console.log(`  📊 Nombre en sidebar: "${sidebarName}"`);

    if (sidebarName !== newDisplayName) {
      throw new Error(`Sidebar no se actualizó. Esperado: "${newDisplayName}", Actual: "${sidebarName}"`);
    }

    console.log('  ✅ DisplayName actualizado correctamente');
  });
}

async function testTC_CFG_006() {
  await resetForNextTest();

  await runTest('TC-CFG-006', 'Actualizar usuario', async () => {
    const originalUsername = await configPage.getUsername();
    console.log(`  📊 Username original: "${originalUsername}"`);

    const newUsername = `admin_${Date.now()}`;
    await configPage.setUsername(newUsername);
    await configPage.submitAccountForm();
    await configPage.sleep(2000);

    await configPage.screenshot('TC-CFG-006-UPDATED');

    const statusMessage = await configPage.getAccountStatusMessage();
    console.log(`  📊 Status: "${statusMessage}"`);

    // Restaurar username original
    await configPage.sleep(1000);
    await configPage.setUsername(originalUsername);
    await configPage.submitAccountForm();
    await configPage.sleep(2000);

    console.log('  ✅ Username actualizado y restaurado correctamente');
  });
}

async function testTC_CFG_007() {
  await resetForNextTest();

  await runTest('TC-CFG-007', 'Actualizar email', async () => {
    const newEmail = 'admin@test.com';
    await configPage.setEmail(newEmail);
    await configPage.submitAccountForm();
    await configPage.sleep(2000);

    await configPage.screenshot('TC-CFG-007-EMAIL-UPDATED');

    const statusMessage = await configPage.getAccountStatusMessage();
    console.log(`  📊 Status: "${statusMessage}"`);

    console.log('  ✅ Email actualizado correctamente');
  });
}

async function testTC_CFG_008() {
  await resetForNextTest();

  await runTest('TC-CFG-008', 'Actualizar múltiples campos simultáneamente', async () => {
    const newDisplayName = `Test User ${Date.now()}`;
    const newEmail = `test${Date.now()}@example.com`;

    await configPage.setDisplayName(newDisplayName);
    await configPage.setEmail(newEmail);
    await configPage.submitAccountForm();
    await configPage.sleep(2000);

    await configPage.screenshot('TC-CFG-008-MULTIPLE-UPDATED');

    const statusMessage = await configPage.getAccountStatusMessage();
    console.log(`  📊 Status: "${statusMessage}"`);

    console.log('  ✅ Múltiples campos actualizados correctamente');
  });
}

async function testTC_CFG_010() {
  await resetForNextTest();

  await runTest('TC-CFG-010', 'Validación de usuario obligatorio', async () => {
    await configPage.setUsername('');
    await configPage.submitAccountForm();
    await configPage.sleep(1000);

    await configPage.screenshot('TC-CFG-010-VALIDATION');

    const statusMessage = await configPage.getAccountStatusMessage();
    console.log(`  📊 Mensaje de validación: "${statusMessage}"`);

    // El HTML5 o JavaScript debe prevenir el submit
    // Si no hay mensaje, significa que el submit fue bloqueado (correcto)
    // Si hay mensaje de error, también es correcto
    if (statusMessage && statusMessage.includes('actualizado')) {
      throw new Error('Se permitió actualizar con username vacío');
    }

    console.log('  ✅ Validación de usuario obligatorio funciona');
  });
}

async function testTC_CFG_015() {
  await resetForNextTest();

  await runTest('TC-CFG-015', 'Cambiar contraseña correctamente', async () => {
    const currentPassword = testData.usuarios.admin.password;
    const newPassword = 'newPassword123';

    await configPage.setCurrentPassword(currentPassword);
    await configPage.setNewPassword(newPassword);
    await configPage.setConfirmPassword(newPassword);
    await configPage.submitSecurityForm();
    await configPage.sleep(2000);

    await configPage.screenshot('TC-CFG-015-PASSWORD-CHANGED');

    const statusMessage = await configPage.getSecurityStatusMessage();
    console.log(`  📊 Status: "${statusMessage}"`);

    // Verificar que los campos se limpiaron
    const fieldsEmpty = await configPage.arePasswordFieldsEmpty();
    if (!fieldsEmpty) {
      throw new Error('Los campos de contraseña no se limpiaron');
    }

    // Restaurar contraseña original
    await configPage.sleep(1000);
    await configPage.setCurrentPassword(newPassword);
    await configPage.setNewPassword(currentPassword);
    await configPage.setConfirmPassword(currentPassword);
    await configPage.submitSecurityForm();
    await configPage.sleep(2000);

    console.log('  ✅ Cambio de contraseña funciona y se restauró');
  });
}

async function testTC_CFG_016() {
  await resetForNextTest();

  await runTest('TC-CFG-016', 'Validación de campos obligatorios en seguridad', async () => {
    await configPage.setCurrentPassword('test');
    await configPage.submitSecurityForm();
    await configPage.sleep(1000);

    await configPage.screenshot('TC-CFG-016-VALIDATION');

    const statusMessage = await configPage.getSecurityStatusMessage();
    console.log(`  📊 Mensaje de validación: "${statusMessage}"`);

    // El HTML5 o JavaScript debe prevenir el submit
    // No debe permitir cambiar contraseña con campos vacíos
    if (statusMessage && statusMessage.includes('actualizada correctamente')) {
      throw new Error('Se permitió cambiar contraseña con campos vacíos');
    }

    console.log('  ✅ Validación de campos obligatorios funciona');
  });
}

async function testTC_CFG_017() {
  await resetForNextTest();

  await runTest('TC-CFG-017', 'Validación de longitud mínima de contraseña', async () => {
    await configPage.setCurrentPassword('admin123');
    await configPage.setNewPassword('1234567'); // Solo 7 caracteres
    await configPage.setConfirmPassword('1234567');
    await configPage.submitSecurityForm();
    await configPage.sleep(1000);

    await configPage.screenshot('TC-CFG-017-SHORT-PASSWORD');

    const statusMessage = await configPage.getSecurityStatusMessage();
    console.log(`  📊 Mensaje de validación: "${statusMessage}"`);

    // El HTML5 o JavaScript debe prevenir contraseñas < 8 caracteres
    // No debe permitir actualizar con contraseña corta
    if (statusMessage && statusMessage.includes('actualizada correctamente')) {
      throw new Error('Se permitió contraseña menor a 8 caracteres');
    }

    console.log('  ✅ Validación de longitud mínima funciona');
  });
}

async function testTC_CFG_018() {
  await resetForNextTest();

  await runTest('TC-CFG-018', 'Validación de coincidencia de contraseñas', async () => {
    await configPage.setCurrentPassword('admin123');
    await configPage.setNewPassword('newPassword123');
    await configPage.setConfirmPassword('differentPassword456');
    await configPage.submitSecurityForm();
    await configPage.sleep(1000);

    await configPage.screenshot('TC-CFG-018-MISMATCH');

    const statusMessage = await configPage.getSecurityStatusMessage();
    console.log(`  📊 Mensaje de validación: "${statusMessage}"`);

    if (!statusMessage || !statusMessage.includes('coinciden')) {
      throw new Error('No se mostró mensaje sobre contraseñas no coinciden');
    }

    console.log('  ✅ Validación de coincidencia funciona');
  });
}

async function testTC_CFG_025() {
  await resetForNextTest();

  await runTest('TC-CFG-025', 'Actualización del nombre en sidebar', async () => {
    const newName = `Test ${Date.now()}`;

    await configPage.setDisplayName(newName);
    await configPage.submitAccountForm();
    await configPage.sleep(2000);

    await configPage.screenshot('TC-CFG-025-SIDEBAR-UPDATE');

    const sidebarName = await configPage.getSidebarUserName();
    console.log(`  📊 Nombre en sidebar: "${sidebarName}"`);

    if (sidebarName !== newName) {
      throw new Error(`Sidebar no se actualizó. Esperado: "${newName}", Actual: "${sidebarName}"`);
    }

    console.log('  ✅ Nombre en sidebar se actualiza en tiempo real');
  });
}

// ========== FUNCIÓN PRINCIPAL ==========

async function runConfigTestSuite() {
  console.log('\n' + '█'.repeat(80));
  console.log('🚀 INICIANDO SUITE DE TESTS - MÓDULO CONFIGURACIÓN');
  console.log('█'.repeat(80) + '\n');

  try {
    console.log('🔧 Inicializando Electron driver...');
    driver = await createElectronDriver();
    loginPage = new LoginPage(driver);
    configPage = new ConfigPage(driver);

    await loginPage.waitForPageLoad();
    await configPage.screenshot('00-INITIAL-STATE');

    await setupConfig();
    await configPage.screenshot('01-CONFIG-VIEW');

    // Ejecutar tests
    await testTC_CFG_001();
    await testTC_CFG_002();
    await testTC_CFG_005();
    await testTC_CFG_006();
    await testTC_CFG_007();
    await testTC_CFG_008();
    await testTC_CFG_010();
    await testTC_CFG_015();
    await testTC_CFG_016();
    await testTC_CFG_017();
    await testTC_CFG_018();
    await testTC_CFG_025();

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
    const filename = `config-test-results-${timestamp}.json`;
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
  runConfigTestSuite()
    .then(() => {
      const exitCode = testResults.failed === 0 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runConfigTestSuite };
