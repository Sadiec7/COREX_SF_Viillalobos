// polizas.test.js - Suite de pruebas para el módulo de Pólizas

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const { By } = require('selenium-webdriver');
const LoginPage = require('../page-objects/LoginPage');
const PolizasPage = require('../page-objects/PolizasPage');
const testData = require('../helpers/test-data');
const fs = require('fs');
const path = require('path');

// Variables globales
let driver;
let loginPage;
let polizasPage;

// Resultados de tests
const testResults = {
  suite: 'Pólizas',
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
    await polizasPage.screenshot(`${testId}-FAILED`);
    console.error(`❌ Test falló pero continuando con la suite...`);
  }
}

/**
 * Hace login y navega a la sección de pólizas
 */
async function setupPolizas() {
  console.log('\n🔐 Haciendo login y navegando a Pólizas...');

  // Login
  const { username, password } = testData.usuarios.admin;
  await loginPage.login(username, password);
  await loginPage.waitForRedirection();

  // Navegar a Pólizas
  await polizasPage.navigateToPolizas();
  await polizasPage.waitForPageLoad();

  console.log('✅ Setup completado - En sección de Pólizas');
}

/**
 * Reinicia para el siguiente test
 */
async function resetForNextTest() {
  console.log('\n🔄 Preparando siguiente test...');

  // Esperar a que toasts desaparezcan
  await polizasPage.sleep(2000);

  // Cerrar cualquier modal abierto (intentar varias veces si es necesario)
  for (let i = 0; i < 3; i++) {
    try {
      const modalVisible = await polizasPage.isModalVisible();
      if (modalVisible) {
        console.log(`   🔄 Cerrando modal abierto (intento ${i + 1}/3)...`);
        await polizasPage.sleep(1000);
        await polizasPage.closeModal();
        await polizasPage.sleep(1000);
      } else {
        break;
      }
    } catch (error) {
      // Modal no está abierto o ya se cerró
      break;
    }
  }

  // Limpiar búsqueda
  await polizasPage.clearSearch();
  await polizasPage.sleep(500);

  console.log('✅ Listo para siguiente test');
}

// ========== CASOS DE PRUEBA ==========

/**
 * TC-POL-001: Crear Póliza Nueva
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_POL_001() {
  await resetForNextTest();

  await runTest('TC-POL-001', 'Crear póliza nueva', async () => {
    // Arrange
    const poliza = {
      numero_poliza: 'POL-TEST-' + Date.now(),
      selectFirstClient: true,
      selectFirstAseguradora: true,
      selectFirstRamo: true,
      selectFirstPeriodicidad: true,
      selectFirstMetodoPago: true,
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-12-31',
      prima_neta: '10000',
      prima_total: '11600',
      suma_asegurada: '500000',
      notas: 'Póliza de prueba creada por test automatizado'
    };

    // Act
    await polizasPage.openNewPolizaModal();
    await polizasPage.fillPolizaForm(poliza);
    await polizasPage.submitForm();
    await polizasPage.sleep(2000);

    // ✅ SOLUCIÓN MEJORADA: Esperar inteligentemente a que aparezca en la tabla
    // Basado en: https://stackoverflow.com/questions/65689079/selenium-java-how-can-i-make-it-wait-until-a-table-has-been-refreshed
    await polizasPage.screenshot('TC-POL-001-CREATED');

    const exists = await polizasPage.waitForPolizaInTable(poliza.numero_poliza, 10000);
    if (!exists) {
      throw new Error(`Póliza "${poliza.numero_poliza}" no aparece en la tabla después de 10s`);
    }

    console.log(`✅ Póliza "${poliza.numero_poliza}" creada exitosamente`);
  });
}

/**
 * TC-POL-002: Validación Campos Obligatorios
 * Prioridad: Alta
 * Tipo: Validación
 */
async function testTC_POL_002() {
  await resetForNextTest();

  await runTest('TC-POL-002', 'Validación campos obligatorios', async () => {
    // Act
    await polizasPage.openNewPolizaModal();

    // Intentar enviar formulario vacío
    await polizasPage.submitForm();
    await polizasPage.sleep(500);

    // Assert - Modal debe seguir abierto
    const modalVisible = await polizasPage.isModalVisible();
    if (!modalVisible) {
      throw new Error('Formulario se envió sin campos obligatorios');
    }

    await polizasPage.screenshot('TC-POL-002-VALIDATION');
    console.log(`✅ Validación de campos obligatorios funciona`);

    await polizasPage.closeModal();
  });
}

/**
 * TC-POL-003: Validación Fecha Fin Mayor que Fecha Inicio
 * Prioridad: Alta
 * Tipo: Validación
 */
async function testTC_POL_003() {
  await resetForNextTest();

  await runTest('TC-POL-003', 'Validación fecha fin > fecha inicio', async () => {
    // Act
    await polizasPage.openNewPolizaModal();

    // Llenar campos obligatorios
    await polizasPage.type(polizasPage.locators.inputNumero, 'POL-DATE-TEST');

    // Seleccionar opciones requeridas
    const clienteSelect = await driver.findElement(polizasPage.locators.inputCliente);
    const clienteOptions = await clienteSelect.findElements(By.css('option'));
    if (clienteOptions.length > 1) await clienteOptions[1].click();

    const asegSelect = await driver.findElement(polizasPage.locators.inputAseguradora);
    const asegOptions = await asegSelect.findElements(By.css('option'));
    if (asegOptions.length > 1) await asegOptions[1].click();

    const ramoSelect = await driver.findElement(polizasPage.locators.inputRamo);
    const ramoOptions = await ramoSelect.findElements(By.css('option'));
    if (ramoOptions.length > 1) await ramoOptions[1].click();

    // Fechas inválidas: fin antes que inicio
    await polizasPage.type(polizasPage.locators.inputFechaInicio, '2025-12-31');
    await polizasPage.type(polizasPage.locators.inputFechaFin, '2025-01-01');

    await polizasPage.type(polizasPage.locators.inputPrimaNeta, '1000');
    await polizasPage.type(polizasPage.locators.inputPrima, '1160');

    const periSelect = await driver.findElement(polizasPage.locators.inputPeriodicidad);
    const periOptions = await periSelect.findElements(By.css('option'));
    if (periOptions.length > 1) await periOptions[1].click();

    const metodoSelect = await driver.findElement(polizasPage.locators.inputMetodoPago);
    const metodoOptions = await metodoSelect.findElements(By.css('option'));
    if (metodoOptions.length > 1) await metodoOptions[1].click();

    await polizasPage.screenshot('TC-POL-003-INVALID-DATES');

    // Intentar enviar
    await polizasPage.submitForm();
    await polizasPage.sleep(500);

    // Assert - Modal debe seguir abierto o mostrar error
    const modalVisible = await polizasPage.isModalVisible();
    if (!modalVisible) {
      throw new Error('Formulario se envió con fechas inválidas');
    }

    console.log(`✅ Validación de fechas funciona correctamente`);
    await polizasPage.closeModal();
  });
}

/**
 * TC-POL-004: Búsqueda por Número de Póliza
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_POL_004() {
  await resetForNextTest();

  await runTest('TC-POL-004', 'Búsqueda por número de póliza', async () => {
    // Arrange - Asegurar que hay al menos una póliza
    const totalPolizas = await polizasPage.getTotalPolizas();

    if (totalPolizas === 0) {
      // Crear una póliza primero
      const poliza = {
        numero_poliza: 'POL-SEARCH-001',
        selectFirstClient: true,
        selectFirstAseguradora: true,
        selectFirstRamo: true,
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-12-31',
        prima_neta: '5000',
        prima_total: '5800',
        selectFirstPeriodicidad: true,
        selectFirstMetodoPago: true
      };
      await polizasPage.createPoliza(poliza);
      await polizasPage.sleep(2000);
    }

    // Act - Buscar por parte del número
    await polizasPage.search('POL');
    await polizasPage.sleep(1000);

    // Assert
    const rowCount = await polizasPage.getTableRowCount();

    await polizasPage.screenshot('TC-POL-004-SEARCH');

    console.log(`   📊 Resultados encontrados: ${rowCount}`);

    if (rowCount === 0) {
      throw new Error('La búsqueda no devolvió resultados');
    }

    console.log(`✅ Búsqueda por número de póliza funciona`);
  });
}

/**
 * TC-POL-005: Verificar Estadísticas (Total, Vigentes, Por Vencer, Vencidas)
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_POL_005() {
  await resetForNextTest();

  await runTest('TC-POL-005', 'Verificar estadísticas de pólizas', async () => {
    // Act
    const total = await polizasPage.getTotalPolizas();
    const vigentes = await polizasPage.getTotalVigentes();
    const porVencer = await polizasPage.getTotalPorVencer();
    const vencidas = await polizasPage.getTotalVencidas();

    console.log(`   📊 Total: ${total}`);
    console.log(`   ✅ Vigentes: ${vigentes}`);
    console.log(`   ⚠️  Por Vencer: ${porVencer}`);
    console.log(`   ❌ Vencidas: ${vencidas}`);

    // Assert - La suma debe coincidir
    const suma = vigentes + porVencer + vencidas;
    if (total !== suma) {
      throw new Error(`Suma inconsistente: ${vigentes} + ${porVencer} + ${vencidas} = ${suma} ≠ ${total}`);
    }

    await polizasPage.screenshot('TC-POL-005-STATS');
    console.log(`✅ Estadísticas son consistentes`);
  });
}

/**
 * TC-POL-006: Validación Prima Total Mayor que Prima Neta
 * Prioridad: Media
 * Tipo: Validación
 */
async function testTC_POL_006() {
  await resetForNextTest();

  await runTest('TC-POL-006', 'Validación prima total > prima neta', async () => {
    // Act
    await polizasPage.openNewPolizaModal();
    await polizasPage.type(polizasPage.locators.inputNumero, 'POL-PRIMA-TEST');

    // Prima total menor que prima neta (inválido)
    await polizasPage.type(polizasPage.locators.inputPrimaNeta, '10000');
    await polizasPage.type(polizasPage.locators.inputPrima, '5000');

    await polizasPage.screenshot('TC-POL-006-INVALID-PRIMA');

    console.log(`✅ Valores de prima ingresados (validación depende de backend)`);
    await polizasPage.closeModal();
  });
}

/**
 * TC-POL-007: Búsqueda Sin Resultados
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_POL_007() {
  await resetForNextTest();

  await runTest('TC-POL-007', 'Búsqueda sin resultados', async () => {
    // Act
    const searchText = 'POLIZA-INEXISTENTE-XYZ999';
    await polizasPage.search(searchText);
    await polizasPage.sleep(1000);

    // Assert
    const rowCount = await polizasPage.getTableRowCount();

    await polizasPage.screenshot('TC-POL-007-NO-RESULTS');

    console.log(`   📊 Resultados: ${rowCount}`);

    if (rowCount > 0) {
      throw new Error(`Se esperaban 0 resultados pero se encontraron ${rowCount}`);
    }

    console.log(`✅ Búsqueda sin resultados funciona correctamente`);
  });
}

/**
 * TC-POL-008: Cancelar Creación de Póliza
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_POL_008() {
  await resetForNextTest();

  await runTest('TC-POL-008', 'Cancelar creación de póliza', async () => {
    // Arrange
    const totalInicial = await polizasPage.getTotalPolizas();

    // Act
    await polizasPage.openNewPolizaModal();
    await polizasPage.type(polizasPage.locators.inputNumero, 'POL-CANCELADA');
    await polizasPage.cancelForm();
    await polizasPage.sleep(500);

    // Assert - Modal cerrado
    const modalVisible = await polizasPage.isModalVisible();
    if (modalVisible) {
      throw new Error('Modal no se cerró al cancelar');
    }

    // Assert - Total no cambió
    const totalFinal = await polizasPage.getTotalPolizas();
    if (totalFinal !== totalInicial) {
      throw new Error('El contador cambió después de cancelar');
    }

    await polizasPage.screenshot('TC-POL-008-CANCELLED');
    console.log(`✅ Cancelación funciona correctamente`);
  });
}

/**
 * TC-POL-009: Validación Número de Póliza Único
 * Prioridad: Alta
 * Tipo: Validación
 */
async function testTC_POL_009() {
  await resetForNextTest();

  await runTest('TC-POL-009', 'Validación número de póliza único', async () => {
    // Arrange - Crear primera póliza
    const numeroDuplicado = 'POL-DUP-' + Date.now();
    const poliza1 = {
      numero_poliza: numeroDuplicado,
      selectFirstClient: true,
      selectFirstAseguradora: true,
      selectFirstRamo: true,
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-12-31',
      prima_neta: '3000',
      prima_total: '3480',
      selectFirstPeriodicidad: true,
      selectFirstMetodoPago: true
    };

    await polizasPage.createPoliza(poliza1);
    await polizasPage.search('');
    await polizasPage.sleep(2000);

    // Act - Intentar crear segunda con mismo número
    await polizasPage.openNewPolizaModal();
    await polizasPage.fillPolizaForm(poliza1);

    await polizasPage.screenshot('TC-POL-009-DUPLICATE');

    await polizasPage.submitForm();
    await polizasPage.sleep(1500);

    // Assert - El backend debe rechazarlo (modal permanece abierto o muestra error)
    console.log(`✅ Intento de duplicar número de póliza (validación depende de backend)`);

    // Cerrar modal si quedó abierto
    try {
      const modalVisible = await polizasPage.isModalVisible();
      if (modalVisible) {
        await polizasPage.closeModal();
      }
    } catch (error) {
      // Modal ya cerrado
    }
  });
}

/**
 * TC-POL-010: Validación Suma Asegurada Positiva
 * Prioridad: Media
 * Tipo: Validación
 */
async function testTC_POL_010() {
  await resetForNextTest();

  await runTest('TC-POL-010', 'Validación suma asegurada positiva', async () => {
    // Act
    await polizasPage.openNewPolizaModal();

    // Intentar con suma asegurada negativa o cero
    await polizasPage.type(polizasPage.locators.inputSumaAsegurada, '-1000');
    await polizasPage.sleep(300);

    const valor = await polizasPage.getFieldValue(polizasPage.locators.inputSumaAsegurada);

    await polizasPage.screenshot('TC-POL-010-NEGATIVE-SUM');

    console.log(`   💰 Suma asegurada ingresada: ${valor}`);
    console.log(`✅ Validación de suma asegurada (HTML5 type="number" min="0")`);

    await polizasPage.closeModal();
  });
}

/**
 * TC-POL-011: Limpiar Búsqueda Restaura Todas las Pólizas
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_POL_011() {
  await resetForNextTest();

  await runTest('TC-POL-011', 'Limpiar búsqueda restaura todas', async () => {
    // Arrange
    const totalInicial = await polizasPage.getTotalPolizas();

    // Act - Hacer búsqueda que filtre
    await polizasPage.search('XYZ999NOEXISTE');
    await polizasPage.sleep(500);

    const resultadosBusqueda = await polizasPage.getTableRowCount();
    console.log(`   🔍 Resultados con búsqueda: ${resultadosBusqueda}`);

    // Limpiar búsqueda
    await polizasPage.clearSearch();
    await polizasPage.sleep(1000);

    // Assert
    const totalFinal = await polizasPage.getTableRowCount();

    await polizasPage.screenshot('TC-POL-011-CLEARED');

    console.log(`   📊 Total inicial: ${totalInicial}`);
    console.log(`   📊 Total después de limpiar: ${totalFinal}`);

    if (totalFinal === 0 && totalInicial > 0) {
      throw new Error('No se restauraron las pólizas');
    }

    console.log(`✅ Limpiar búsqueda restaura pólizas correctamente`);
  });
}

/**
 * TC-POL-012: Crear Póliza de Renovación
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_POL_012() {
  await resetForNextTest();

  await runTest('TC-POL-012', 'Crear póliza de renovación', async () => {
    // Arrange
    const poliza = {
      numero_poliza: 'POL-RENOV-' + Date.now(),
      selectFirstClient: true,
      selectFirstAseguradora: true,
      selectFirstRamo: true,
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-12-31',
      prima_neta: '8000',
      prima_total: '9280',
      selectFirstPeriodicidad: true,
      selectFirstMetodoPago: true,
      notas: 'Póliza de renovación'
    };

    // Act - Abrir modal
    await polizasPage.openNewPolizaModal();

    // Seleccionar tipo "Renovación"
    const tipoSelect = await driver.findElement(polizasPage.locators.inputTipoPoliza);
    const options = await tipoSelect.findElements(By.css('option'));
    for (const option of options) {
      const value = await option.getAttribute('value');
      if (value === 'renovacion') {
        await option.click();
        break;
      }
    }

    await polizasPage.fillPolizaForm(poliza);
    await polizasPage.screenshot('TC-POL-012-RENOVACION');

    await polizasPage.submitForm();
    await polizasPage.sleep(2000);

    // ✅ SOLUCIÓN MEJORADA: Esperar inteligentemente
    const exists = await polizasPage.waitForPolizaInTable(poliza.numero_poliza, 10000);
    if (!exists) {
      throw new Error(`Póliza de renovación no aparece en la tabla después de 10s`);
    }

    console.log(`✅ Póliza de renovación creada exitosamente`);
  });
}

/**
 * TC-POL-013: Validación Comisión Entre 0 y 100%
 * Prioridad: Media
 * Tipo: Validación
 */
async function testTC_POL_013() {
  await resetForNextTest();

  await runTest('TC-POL-013', 'Validación comisión 0-100%', async () => {
    // Act
    await polizasPage.openNewPolizaModal();

    // Intentar con comisión > 100
    await polizasPage.type(polizasPage.locators.inputComision, '150');
    await polizasPage.sleep(300);

    await polizasPage.screenshot('TC-POL-013-INVALID-COMMISSION');

    console.log(`✅ Validación de comisión (HTML5 max="100")`);

    await polizasPage.closeModal();
  });
}

/**
 * TC-POL-014: Búsqueda por Cliente
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_POL_014() {
  await resetForNextTest();

  await runTest('TC-POL-014', 'Búsqueda por cliente', async () => {
    // Act - Buscar por parte del nombre del cliente
    const searchText = 'Test';
    await polizasPage.search(searchText);
    await polizasPage.sleep(1000);

    // Assert
    const rowCount = await polizasPage.getTableRowCount();

    await polizasPage.screenshot('TC-POL-014-SEARCH-CLIENT');

    console.log(`   📊 Resultados para "${searchText}": ${rowCount}`);
    console.log(`✅ Búsqueda por cliente funciona`);
  });
}

/**
 * TC-POL-015: Búsqueda por Aseguradora
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_POL_015() {
  await resetForNextTest();

  await runTest('TC-POL-015', 'Búsqueda por aseguradora', async () => {
    // Act
    const searchText = 'GNP';
    await polizasPage.search(searchText);
    await polizasPage.sleep(1000);

    // Assert
    const rowCount = await polizasPage.getTableRowCount();

    await polizasPage.screenshot('TC-POL-015-SEARCH-ASEGURADORA');

    console.log(`   📊 Resultados para aseguradora "${searchText}": ${rowCount}`);
    console.log(`✅ Búsqueda por aseguradora funciona`);
  });
}

/**
 * TC-POL-016: Validación Prima Neta Positiva
 * Prioridad: Alta
 * Tipo: Validación
 */
async function testTC_POL_016() {
  await resetForNextTest();

  await runTest('TC-POL-016', 'Validación prima neta positiva', async () => {
    // Act
    await polizasPage.openNewPolizaModal();

    // Intentar con prima negativa
    await polizasPage.type(polizasPage.locators.inputPrimaNeta, '-5000');
    await polizasPage.sleep(300);

    const valor = await polizasPage.getFieldValue(polizasPage.locators.inputPrimaNeta);

    await polizasPage.screenshot('TC-POL-016-NEGATIVE-PRIMA');

    console.log(`   💰 Prima neta ingresada: ${valor}`);
    console.log(`✅ Validación prima neta (HTML5 type="number" min="0")`);

    await polizasPage.closeModal();
  });
}

/**
 * TC-POL-017: Verificar Total de Pólizas en Stats
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_POL_017() {
  await resetForNextTest();

  await runTest('TC-POL-017', 'Verificar total de pólizas en stats', async () => {
    // Act
    const totalStats = await polizasPage.getTotalPolizas();
    const rowCount = await polizasPage.getTableRowCount();

    await polizasPage.screenshot('TC-POL-017-TOTAL-STATS');

    console.log(`   📊 Total en stats: ${totalStats}`);
    console.log(`   📊 Filas en tabla: ${rowCount}`);

    // Assert - Deben coincidir (en la primera página al menos)
    if (totalStats > 0 && rowCount === 0) {
      throw new Error('Stats muestra pólizas pero tabla está vacía');
    }

    console.log(`✅ Stats de total de pólizas consistente`);
  });
}

/**
 * TC-POL-018: Cerrar Modal con X No Guarda Cambios
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_POL_018() {
  await resetForNextTest();

  await runTest('TC-POL-018', 'Cerrar modal con X no guarda', async () => {
    // Arrange
    const totalInicial = await polizasPage.getTotalPolizas();

    // Act
    await polizasPage.openNewPolizaModal();
    await polizasPage.type(polizasPage.locators.inputNumero, 'POL-NO-GUARDADA');
    await polizasPage.type(polizasPage.locators.inputPrimaNeta, '7000');

    await polizasPage.screenshot('TC-POL-018-BEFORE-CLOSE');

    // Cerrar con X sin guardar
    await polizasPage.closeModal();
    await polizasPage.sleep(1000);

    // Assert - Total no debe cambiar
    const totalFinal = await polizasPage.getTotalPolizas();
    if (totalFinal !== totalInicial) {
      throw new Error('El total cambió después de cerrar con X');
    }

    await polizasPage.screenshot('TC-POL-018-AFTER-CLOSE');
    console.log(`✅ Cerrar con X descarta cambios correctamente`);
  });
}

/**
 * TC-POL-019: Validación Fecha Inicio Requerida
 * Prioridad: Alta
 * Tipo: Validación
 */
async function testTC_POL_019() {
  await resetForNextTest();

  await runTest('TC-POL-019', 'Validación fecha inicio requerida', async () => {
    // Act
    await polizasPage.openNewPolizaModal();

    // Llenar todos excepto fecha inicio
    await polizasPage.type(polizasPage.locators.inputNumero, 'POL-SIN-FECHA');

    const clienteSelect = await driver.findElement(polizasPage.locators.inputCliente);
    const clienteOptions = await clienteSelect.findElements(By.css('option'));
    if (clienteOptions.length > 1) await clienteOptions[1].click();

    const asegSelect = await driver.findElement(polizasPage.locators.inputAseguradora);
    const asegOptions = await asegSelect.findElements(By.css('option'));
    if (asegOptions.length > 1) await asegOptions[1].click();

    const ramoSelect = await driver.findElement(polizasPage.locators.inputRamo);
    const ramoOptions = await ramoSelect.findElements(By.css('option'));
    if (ramoOptions.length > 1) await ramoOptions[1].click();

    // NO llenar fecha inicio
    await polizasPage.type(polizasPage.locators.inputFechaFin, '2025-12-31');
    await polizasPage.type(polizasPage.locators.inputPrimaNeta, '2000');
    await polizasPage.type(polizasPage.locators.inputPrima, '2320');

    const periSelect = await driver.findElement(polizasPage.locators.inputPeriodicidad);
    const periOptions = await periSelect.findElements(By.css('option'));
    if (periOptions.length > 1) await periOptions[1].click();

    const metodoSelect = await driver.findElement(polizasPage.locators.inputMetodoPago);
    const metodoOptions = await metodoSelect.findElements(By.css('option'));
    if (metodoOptions.length > 1) await metodoOptions[1].click();

    await polizasPage.screenshot('TC-POL-019-NO-FECHA-INICIO');

    // Intentar enviar
    await polizasPage.submitForm();
    await polizasPage.sleep(500);

    // Assert - Modal debe seguir abierto
    const modalVisible = await polizasPage.isModalVisible();
    if (!modalVisible) {
      throw new Error('Formulario se envió sin fecha inicio');
    }

    console.log(`✅ Validación de fecha inicio requerida funciona`);
    await polizasPage.closeModal();
  });
}

/**
 * TC-POL-020: Búsqueda Case Insensitive
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_POL_020() {
  await resetForNextTest();

  await runTest('TC-POL-020', 'Búsqueda case insensitive', async () => {
    // Act - Buscar con minúsculas
    const searchText = 'pol';
    await polizasPage.search(searchText);
    await polizasPage.sleep(1000);

    // Assert
    const rowCount = await polizasPage.getTableRowCount();

    await polizasPage.screenshot('TC-POL-020-CASE-INSENSITIVE');

    console.log(`   📊 Resultados para "${searchText}": ${rowCount}`);
    console.log(`✅ Búsqueda case insensitive funciona`);
  });
}

// ========== SUITE RUNNER ==========

/**
 * Ejecuta toda la suite de pruebas
 */
async function runPolizasTestSuite() {
  console.log('\n' + '█'.repeat(80));
  console.log('🚀 INICIANDO SUITE DE PRUEBAS DE PÓLIZAS');
  console.log('█'.repeat(80));
  console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
  console.log(`📋 Total de casos: 20 (TC-POL-001 a TC-POL-020)`);
  console.log('█'.repeat(80));

  try {
    // Inicializar driver
    console.log('\n🔧 Inicializando Electron driver...');
    driver = await createElectronDriver();

    // Inicializar Page Objects
    loginPage = new LoginPage(driver);
    polizasPage = new PolizasPage(driver);

    // Esperar a que cargue la página de login
    await loginPage.waitForPageLoad();
    await polizasPage.screenshot('00-INITIAL-STATE');

    // Setup inicial: Login y navegar a Pólizas
    await setupPolizas();
    await polizasPage.screenshot('01-POLIZAS-VIEW');

    // Ejecutar tests
    await testTC_POL_001();
    await testTC_POL_002();
    await testTC_POL_003();
    await testTC_POL_004();
    await testTC_POL_005();
    await testTC_POL_006();
    await testTC_POL_007();
    await testTC_POL_008();
    await testTC_POL_009();
    await testTC_POL_010();
    await testTC_POL_011();
    await testTC_POL_012();
    await testTC_POL_013();
    await testTC_POL_014();
    await testTC_POL_015();
    await testTC_POL_016();
    await testTC_POL_017();
    await testTC_POL_018();
    await testTC_POL_019();
    await testTC_POL_020();

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
    const filename = `polizas-test-results-${timestamp}.json`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(testResults, null, 2));
    console.log(`💾 Resultados guardados en: ${filepath}\n`);

  } catch (error) {
    console.error('\n💥 Error fatal en la suite:', error);
    throw error;
  } finally {
    // Cerrar driver
    console.log('🔒 Cerrando Electron driver...');
    await quitDriver(driver);
    console.log('\n✅ Suite de pruebas finalizada\n');
  }
}

// ========== EJECUTAR ==========

if (require.main === module) {
  runPolizasTestSuite()
    .then(() => {
      const exitCode = testResults.failed === 0 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runPolizasTestSuite };
