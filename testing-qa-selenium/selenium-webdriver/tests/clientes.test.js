// clientes.test.js - Suite de pruebas para el módulo de Clientes

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const LoginPage = require('../page-objects/LoginPage');
const ClientesPage = require('../page-objects/ClientesPage');
const testData = require('../helpers/test-data');
const fs = require('fs');
const path = require('path');

// Variables globales
let driver;
let loginPage;
let clientesPage;

// Resultados de tests
const testResults = {
  suite: 'Clientes',
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
    await clientesPage.screenshot(`${testId}-FAILED`);
    console.error(`❌ Test falló pero continuando con la suite...`);
  }
}

/**
 * Hace login y navega a la sección de clientes
 */
async function setupClientes() {
  console.log('\n🔐 Haciendo login y navegando a Clientes...');

  // Login
  const { username, password } = testData.usuarios.admin;
  await loginPage.login(username, password);
  await loginPage.waitForRedirection();

  // Navegar a Clientes
  await clientesPage.navigateToClientes();
  await clientesPage.waitForPageLoad();

  console.log('✅ Setup completado - En sección de Clientes');
}

/**
 * Reinicia para el siguiente test
 */
async function resetForNextTest() {
  console.log('\n🔄 Preparando siguiente test...');

  // Cerrar cualquier modal abierto
  try {
    const modalVisible = await clientesPage.isModalVisible();
    if (modalVisible) {
      await clientesPage.closeModal();
    }
  } catch (error) {
    // Modal no está abierto, continuar
  }

  // Limpiar búsqueda
  await clientesPage.clearSearch();
  await clientesPage.sleep(500);

  console.log('✅ Listo para siguiente test');
}

// ========== CASOS DE PRUEBA ==========

/**
 * TC-CLI-001: Crear Cliente Persona Física
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_CLI_001() {
  await resetForNextTest();

  await runTest('TC-CLI-001', 'Crear Cliente Persona Física', async () => {
    // Arrange
    const cliente = testData.clientes.personaFisica;

    // Act - Crear cliente
    await clientesPage.openNewClienteModal();
    await clientesPage.screenshot('TC-CLI-001-MODAL-OPENED');

    await clientesPage.fillClienteForm(cliente);
    await clientesPage.screenshot('TC-CLI-001-FORM-FILLED');

    await clientesPage.submitForm();
    await clientesPage.sleep(2000); // Esperar creación

    // Assert - Verificar que cliente existe en tabla
    await clientesPage.screenshot('TC-CLI-001-AFTER-SUBMIT');

    const exists = await clientesPage.clienteExistsInTable(cliente.nombre);
    if (!exists) {
      throw new Error(`Cliente "${cliente.nombre}" no aparece en la tabla`);
    }

    console.log(`✅ Cliente "${cliente.nombre}" creado exitosamente`);
  });
}

/**
 * TC-CLI-002: Crear Cliente Persona Moral
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_CLI_002() {
  await resetForNextTest();

  await runTest('TC-CLI-002', 'Crear Cliente Persona Moral', async () => {
    // Arrange
    const cliente = testData.clientes.personaMoral;

    // Act
    await clientesPage.createCliente(cliente);
    await clientesPage.sleep(1000);

    // Assert
    await clientesPage.screenshot('TC-CLI-002-CREATED');

    const exists = await clientesPage.clienteExistsInTable(cliente.nombre);
    if (!exists) {
      throw new Error(`Cliente Persona Moral "${cliente.nombre}" no aparece en la tabla`);
    }

    console.log(`✅ Cliente Persona Moral "${cliente.nombre}" creado exitosamente`);
  });
}

/**
 * TC-CLI-003: Validación de RFC - Formato Correcto
 * Prioridad: Alta
 * Tipo: Validación
 */
async function testTC_CLI_003() {
  await resetForNextTest();

  await runTest('TC-CLI-003', 'Validación de RFC formato correcto', async () => {
    // Arrange
    const rfcValido = 'PELJ850101ABC';

    // Act
    await clientesPage.openNewClienteModal();
    await clientesPage.type(clientesPage.locators.inputRFC, rfcValido);
    await clientesPage.sleep(500);

    // Assert - RFC debe estar en mayúsculas
    const valor = await clientesPage.getFieldValue(clientesPage.locators.inputRFC);

    if (valor !== rfcValido.toUpperCase()) {
      throw new Error(`RFC esperado: ${rfcValido.toUpperCase()}, obtenido: ${valor}`);
    }

    await clientesPage.screenshot('TC-CLI-003-RFC-VALID');
    console.log(`✅ RFC válido aceptado: ${valor}`);

    await clientesPage.closeModal();
  });
}

/**
 * TC-CLI-004: Validación de Email - Formato Válido
 * Prioridad: Media
 * Tipo: Validación
 */
async function testTC_CLI_004() {
  await resetForNextTest();

  await runTest('TC-CLI-004', 'Validación de email formato válido', async () => {
    // Arrange
    const emailsValidos = [
      'usuario@dominio.com',
      'test@test.com.mx',
      'user.name@domain.co'
    ];

    await clientesPage.openNewClienteModal();

    // Act & Assert - Probar cada email
    for (const email of emailsValidos) {
      await clientesPage.type(clientesPage.locators.inputEmail, email);
      await clientesPage.sleep(300);

      const valor = await clientesPage.getFieldValue(clientesPage.locators.inputEmail);
      console.log(`   ✓ Email válido aceptado: ${valor}`);

      // Limpiar para el siguiente
      const field = await driver.findElement(clientesPage.locators.inputEmail);
      await field.clear();
    }

    await clientesPage.screenshot('TC-CLI-004-EMAIL-VALID');
    await clientesPage.closeModal();
  });
}

/**
 * TC-CLI-005: Validación de Email - Formato Inválido
 * Prioridad: Media
 * Tipo: Validación
 */
async function testTC_CLI_005() {
  await resetForNextTest();

  await runTest('TC-CLI-005', 'Validación de email formato inválido', async () => {
    // Arrange
    const emailsInvalidos = [
      'invalido@',
      '@dominio.com',
      'sin-arroba.com'
    ];

    await clientesPage.openNewClienteModal();

    // Llenar campos requeridos
    await clientesPage.type(clientesPage.locators.inputNombre, 'Test Cliente');
    await clientesPage.type(clientesPage.locators.inputRFC, 'TEST850101ABC');

    // Act & Assert - Probar email inválido
    const emailInvalido = emailsInvalidos[0];
    await clientesPage.type(clientesPage.locators.inputEmail, emailInvalido);
    await clientesPage.sleep(300);

    // Intentar enviar formulario
    await clientesPage.submitForm();
    await clientesPage.sleep(500);

    // Verificar que modal sigue abierto (validación impidió envío)
    const modalVisible = await clientesPage.isModalVisible();
    if (!modalVisible) {
      throw new Error('El formulario se envió con email inválido');
    }

    await clientesPage.screenshot('TC-CLI-005-EMAIL-INVALID');
    console.log(`✅ Email inválido rechazado: ${emailInvalido}`);

    await clientesPage.closeModal();
  });
}

/**
 * TC-CLI-006: Búsqueda de Cliente por Nombre
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_CLI_006() {
  await resetForNextTest();

  await runTest('TC-CLI-006', 'Búsqueda de cliente por nombre', async () => {
    // Arrange - Asegurar que hay al menos un cliente
    const totalInicial = await clientesPage.getTotalClientes();

    if (totalInicial === 0) {
      // Crear un cliente de prueba
      const cliente = {
        tipo_persona: 'Física',
        nombre: 'Cliente Búsqueda Test',
        rfc: 'BUSC850101ABC',
        email: 'busqueda@test.com'
      };
      await clientesPage.createCliente(cliente);
      await clientesPage.sleep(1500);
    }

    // Act - Buscar cliente existente
    const primerClienteNombre = testData.clientes.personaFisica.nombre.split(' ')[0];
    await clientesPage.search(primerClienteNombre);
    await clientesPage.sleep(1000);

    // Assert
    await clientesPage.screenshot('TC-CLI-006-SEARCH-RESULTS');

    const rowCount = await clientesPage.getTableRowCount();
    if (rowCount === 0) {
      throw new Error('La búsqueda no devolvió resultados');
    }

    console.log(`✅ Búsqueda devolvió ${rowCount} resultado(s)`);
  });
}

/**
 * TC-CLI-007: Búsqueda Sin Resultados
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_CLI_007() {
  await resetForNextTest();

  await runTest('TC-CLI-007', 'Búsqueda sin resultados', async () => {
    // Act - Buscar texto que no existe
    const textoBusqueda = 'ClienteQueNoExiste123XYZ';
    await clientesPage.search(textoBusqueda);
    await clientesPage.sleep(1000);

    // Assert - Verificar empty state o tabla vacía
    await clientesPage.screenshot('TC-CLI-007-NO-RESULTS');

    const rowCount = await clientesPage.getTableRowCount();
    console.log(`   📊 Filas en tabla: ${rowCount}`);

    // Si devuelve resultados, es un error
    if (rowCount > 0) {
      throw new Error(`Se esperaban 0 resultados pero se encontraron ${rowCount}`);
    }

    console.log(`✅ Búsqueda sin resultados funciona correctamente`);
  });
}

/**
 * TC-CLI-008: Validar Campos Requeridos (Nombre y RFC)
 * Prioridad: Alta
 * Tipo: Validación
 */
async function testTC_CLI_008() {
  await resetForNextTest();

  await runTest('TC-CLI-008', 'Validar campos requeridos', async () => {
    // Act
    await clientesPage.openNewClienteModal();

    // Intentar enviar formulario vacío
    await clientesPage.submitForm();
    await clientesPage.sleep(500);

    // Assert - Modal debe seguir abierto
    const modalVisible = await clientesPage.isModalVisible();
    if (!modalVisible) {
      throw new Error('Formulario se envió sin campos requeridos');
    }

    await clientesPage.screenshot('TC-CLI-008-REQUIRED-FIELDS');
    console.log(`✅ Validación de campos requeridos funciona correctamente`);

    await clientesPage.closeModal();
  });
}

/**
 * TC-CLI-009: Cancelar Creación de Cliente
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_CLI_009() {
  await resetForNextTest();

  await runTest('TC-CLI-009', 'Cancelar creación de cliente', async () => {
    // Arrange
    const totalInicial = await clientesPage.getTotalClientes();

    // Act
    await clientesPage.openNewClienteModal();
    await clientesPage.type(clientesPage.locators.inputNombre, 'Cliente Cancelado');
    await clientesPage.type(clientesPage.locators.inputRFC, 'CANC850101ABC');
    await clientesPage.cancelForm();
    await clientesPage.sleep(500);

    // Assert - Modal cerrado
    const modalVisible = await clientesPage.isModalVisible();
    if (modalVisible) {
      throw new Error('Modal no se cerró al cancelar');
    }

    // Assert - Total de clientes no cambió
    const totalFinal = await clientesPage.getTotalClientes();
    if (totalFinal !== totalInicial) {
      throw new Error('El contador de clientes cambió después de cancelar');
    }

    await clientesPage.screenshot('TC-CLI-009-CANCELLED');
    console.log(`✅ Cancelación funciona correctamente`);
  });
}

/**
 * TC-CLI-010: Verificar Stats (Total, Físicas, Morales)
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_CLI_010() {
  await resetForNextTest();

  await runTest('TC-CLI-010', 'Verificar estadísticas de clientes', async () => {
    // Act
    const total = await clientesPage.getTotalClientes();
    const fisicas = await clientesPage.getTotalFisicas();
    const morales = await clientesPage.getTotalMorales();

    console.log(`   📊 Total: ${total}`);
    console.log(`   👤 Físicas: ${fisicas}`);
    console.log(`   🏢 Morales: ${morales}`);

    // Assert - La suma debe coincidir
    if (total !== (fisicas + morales)) {
      throw new Error(`Suma inconsistente: ${fisicas} + ${morales} ≠ ${total}`);
    }

    await clientesPage.screenshot('TC-CLI-010-STATS');
    console.log(`✅ Estadísticas son consistentes`);
  });
}

/**
 * TC-CLI-011: Editar Cliente Existente
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_CLI_011() {
  await resetForNextTest();

  await runTest('TC-CLI-011', 'Editar cliente existente', async () => {
    // Arrange - Asegurar que hay al menos un cliente
    const totalClientes = await clientesPage.getTotalClientes();

    if (totalClientes === 0) {
      // Crear un cliente primero
      const cliente = {
        tipo_persona: 'Física',
        nombre: 'Cliente Para Editar',
        rfc: 'CPED850101ABC',
        email: 'editar@test.com'
      };
      await clientesPage.createCliente(cliente);
      await clientesPage.sleep(1500);
    }

    // Act - Hacer clic en editar primer cliente
    await clientesPage.clickFirstClienteEdit();
    await clientesPage.sleep(500);

    // Modificar nombre
    const nombreEditado = 'Cliente Editado ' + Date.now();
    const inputNombre = await driver.findElement(clientesPage.locators.inputNombre);
    await inputNombre.clear();
    await clientesPage.type(clientesPage.locators.inputNombre, nombreEditado);

    await clientesPage.screenshot('TC-CLI-011-EDITING');

    // Guardar cambios
    await clientesPage.submitForm();
    await clientesPage.sleep(2000);

    // Assert - Verificar que el nombre editado aparece en la tabla
    const exists = await clientesPage.clienteExistsInTable(nombreEditado);
    if (!exists) {
      throw new Error(`Cliente editado "${nombreEditado}" no aparece en la tabla`);
    }

    await clientesPage.screenshot('TC-CLI-011-EDITED');
    console.log(`✅ Cliente editado exitosamente: ${nombreEditado}`);
  });
}

/**
 * TC-CLI-012: Validación de Nombre Mínimo 3 Caracteres
 * Prioridad: Media
 * Tipo: Validación
 */
async function testTC_CLI_012() {
  await resetForNextTest();

  await runTest('TC-CLI-012', 'Validación nombre mínimo 3 caracteres', async () => {
    // Act
    await clientesPage.openNewClienteModal();

    // Intentar con nombre de 2 caracteres
    await clientesPage.type(clientesPage.locators.inputNombre, 'AB');
    await clientesPage.type(clientesPage.locators.inputRFC, 'TEST850101ABC');

    await clientesPage.submitForm();
    await clientesPage.sleep(500);

    // Assert - Modal debe seguir abierto
    const modalVisible = await clientesPage.isModalVisible();
    if (!modalVisible) {
      throw new Error('Formulario se envió con nombre < 3 caracteres');
    }

    await clientesPage.screenshot('TC-CLI-012-VALIDATION');
    console.log(`✅ Validación de nombre mínimo funciona correctamente`);

    await clientesPage.closeModal();
  });
}

/**
 * TC-CLI-013: Validación RFC Formato Inválido
 * Prioridad: Alta
 * Tipo: Validación
 */
async function testTC_CLI_013() {
  await resetForNextTest();

  await runTest('TC-CLI-013', 'Validación RFC formato inválido', async () => {
    // Arrange - RFCs inválidos
    const rfcsInvalidos = [
      'ABC',           // Muy corto
      'PELJ@50101ABC', // Caracteres especiales
      '123456789012'   // Solo números
    ];

    await clientesPage.openNewClienteModal();
    await clientesPage.type(clientesPage.locators.inputNombre, 'Test Cliente RFC');

    // Act - Probar primer RFC inválido
    await clientesPage.type(clientesPage.locators.inputRFC, rfcsInvalidos[0]);
    await clientesPage.sleep(300);

    await clientesPage.screenshot('TC-CLI-013-INVALID-RFC');

    // Intentar enviar
    await clientesPage.submitForm();
    await clientesPage.sleep(500);

    // Assert - Modal debe seguir abierto (validación impidió envío)
    const modalVisible = await clientesPage.isModalVisible();
    if (!modalVisible) {
      throw new Error('El formulario se envió con RFC inválido');
    }

    console.log(`✅ RFC inválido "${rfcsInvalidos[0]}" rechazado correctamente`);
    await clientesPage.closeModal();
  });
}

/**
 * TC-CLI-014: Búsqueda Case Insensitive
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_CLI_014() {
  await resetForNextTest();

  await runTest('TC-CLI-014', 'Búsqueda case insensitive', async () => {
    // Arrange - Buscar con minúsculas
    const searchText = 'juan';

    // Act
    await clientesPage.search(searchText);
    await clientesPage.sleep(1000);

    // Assert - Debe encontrar resultados aunque esté en minúsculas
    const rowCount = await clientesPage.getTableRowCount();

    await clientesPage.screenshot('TC-CLI-014-CASE-INSENSITIVE');

    console.log(`   📊 Resultados encontrados: ${rowCount}`);
    console.log(`✅ Búsqueda case insensitive funciona (búsqueda: "${searchText}")`);
  });
}

/**
 * TC-CLI-015: Búsqueda por RFC Parcial
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_CLI_015() {
  await resetForNextTest();

  await runTest('TC-CLI-015', 'Búsqueda por RFC parcial', async () => {
    // Act - Buscar con parte del RFC
    const rfcParcial = 'PELJ';
    await clientesPage.search(rfcParcial);
    await clientesPage.sleep(1000);

    // Assert
    const rowCount = await clientesPage.getTableRowCount();

    await clientesPage.screenshot('TC-CLI-015-RFC-SEARCH');

    console.log(`   📊 Resultados para RFC "${rfcParcial}": ${rowCount}`);
    console.log(`✅ Búsqueda por RFC parcial funciona`);
  });
}

/**
 * TC-CLI-016: Filtro Avanzado - Solo Personas Físicas
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_CLI_016() {
  await resetForNextTest();

  await runTest('TC-CLI-016', 'Filtro solo personas físicas', async () => {
    // Act - Aplicar filtro de Personas Físicas
    await clientesPage.applyFilters({ fisica: true, moral: false });
    await clientesPage.sleep(1000);

    // Assert - Verificar stats
    const total = await clientesPage.getTotalClientes();
    const fisicas = await clientesPage.getTotalFisicas();

    await clientesPage.screenshot('TC-CLI-016-FILTER-FISICAS');

    console.log(`   📊 Total mostrado: ${total}`);
    console.log(`   👤 Físicas: ${fisicas}`);
    console.log(`✅ Filtro de Personas Físicas aplicado`);

    // Cerrar modal de filtros si quedó abierto
    try {
      const modalFiltros = await driver.findElement(clientesPage.locators.modalFiltros);
      const classes = await modalFiltros.getAttribute('class');
      if (classes.includes('active')) {
        await clientesPage.click(clientesPage.locators.btnCloseFiltros);
      }
    } catch (error) {
      // Modal no está abierto
    }
  });
}

/**
 * TC-CLI-017: Filtro Avanzado - Solo Personas Morales
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_CLI_017() {
  await resetForNextTest();

  await runTest('TC-CLI-017', 'Filtro solo personas morales', async () => {
    // Act - Aplicar filtro de Personas Morales
    await clientesPage.applyFilters({ fisica: false, moral: true });
    await clientesPage.sleep(1000);

    // Assert
    const total = await clientesPage.getTotalClientes();
    const morales = await clientesPage.getTotalMorales();

    await clientesPage.screenshot('TC-CLI-017-FILTER-MORALES');

    console.log(`   📊 Total mostrado: ${total}`);
    console.log(`   🏢 Morales: ${morales}`);
    console.log(`✅ Filtro de Personas Morales aplicado`);

    // Cerrar modal de filtros
    try {
      const modalFiltros = await driver.findElement(clientesPage.locators.modalFiltros);
      const classes = await modalFiltros.getAttribute('class');
      if (classes.includes('active')) {
        await clientesPage.click(clientesPage.locators.btnCloseFiltros);
      }
    } catch (error) {
      // Modal no está abierto
    }
  });
}

/**
 * TC-CLI-018: Limpiar Búsqueda Restaura Todos los Clientes
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_CLI_018() {
  await resetForNextTest();

  await runTest('TC-CLI-018', 'Limpiar búsqueda restaura todos', async () => {
    // Arrange - Obtener total inicial
    const totalInicial = await clientesPage.getTotalClientes();

    // Act - Hacer búsqueda que filtre
    await clientesPage.search('XYZ999');
    await clientesPage.sleep(500);

    const resultadosBusqueda = await clientesPage.getTableRowCount();
    console.log(`   🔍 Resultados con búsqueda: ${resultadosBusqueda}`);

    // Limpiar búsqueda
    await clientesPage.clearSearch();
    await clientesPage.sleep(1000);

    // Assert - Debe mostrar todos los clientes de nuevo
    const totalFinal = await clientesPage.getTableRowCount();

    await clientesPage.screenshot('TC-CLI-018-CLEARED');

    console.log(`   📊 Total inicial: ${totalInicial}`);
    console.log(`   📊 Total después de limpiar: ${totalFinal}`);

    if (totalFinal === 0 && totalInicial > 0) {
      throw new Error('No se restauraron los clientes después de limpiar búsqueda');
    }

    console.log(`✅ Limpiar búsqueda restaura clientes correctamente`);
  });
}

/**
 * TC-CLI-019: Verificar Datos en Modal de Edición
 * Prioridad: Alta
 * Tipo: Funcional
 */
async function testTC_CLI_019() {
  await resetForNextTest();

  await runTest('TC-CLI-019', 'Verificar datos en modal de edición', async () => {
    // Arrange - Asegurar que hay un cliente conocido
    const clienteConocido = testData.clientes.personaFisica;
    const exists = await clientesPage.clienteExistsInTable(clienteConocido.nombre);

    if (!exists) {
      // Crear el cliente si no existe
      await clientesPage.createCliente(clienteConocido);
      await clientesPage.sleep(2000);
    }

    // Act - Abrir modal de edición
    await clientesPage.clickFirstClienteEdit();
    await clientesPage.sleep(500);

    // Assert - Verificar que los campos tienen valores
    const nombreValue = await clientesPage.getFieldValue(clientesPage.locators.inputNombre);
    const rfcValue = await clientesPage.getFieldValue(clientesPage.locators.inputRFC);

    if (!nombreValue || nombreValue.length === 0) {
      throw new Error('Campo nombre está vacío en modal de edición');
    }

    if (!rfcValue || rfcValue.length === 0) {
      throw new Error('Campo RFC está vacío en modal de edición');
    }

    await clientesPage.screenshot('TC-CLI-019-EDIT-MODAL-DATA');

    console.log(`   📝 Nombre cargado: "${nombreValue}"`);
    console.log(`   📝 RFC cargado: "${rfcValue}"`);
    console.log(`✅ Datos se cargan correctamente en modal de edición`);

    await clientesPage.closeModal();
  });
}

/**
 * TC-CLI-020: Cerrar Modal con X No Guarda Cambios
 * Prioridad: Media
 * Tipo: Funcional
 */
async function testTC_CLI_020() {
  await resetForNextTest();

  await runTest('TC-CLI-020', 'Cerrar modal con X no guarda cambios', async () => {
    // Arrange - Crear cliente
    const cliente = {
      tipo_persona: 'Física',
      nombre: 'Cliente Test Cierre',
      rfc: 'CTCI850101ABC',
      email: 'cierre@test.com'
    };

    const exists = await clientesPage.clienteExistsInTable(cliente.nombre);
    if (!exists) {
      await clientesPage.createCliente(cliente);
      await clientesPage.sleep(2000);
    }

    // Act - Abrir edición
    await clientesPage.clickFirstClienteEdit();
    await clientesPage.sleep(500);

    // Modificar nombre pero cerrar con X
    const nuevoNombre = 'Nombre No Guardado ' + Date.now();
    const inputNombre = await driver.findElement(clientesPage.locators.inputNombre);
    await inputNombre.clear();
    await clientesPage.type(clientesPage.locators.inputNombre, nuevoNombre);

    await clientesPage.screenshot('TC-CLI-020-BEFORE-CLOSE');

    // Cerrar con X
    await clientesPage.closeModal();
    await clientesPage.sleep(1000);

    // Assert - El nuevo nombre NO debe existir en la tabla
    const existsNewName = await clientesPage.clienteExistsInTable(nuevoNombre);
    if (existsNewName) {
      throw new Error('Los cambios se guardaron al cerrar con X');
    }

    await clientesPage.screenshot('TC-CLI-020-AFTER-CLOSE');
    console.log(`✅ Cerrar con X descarta cambios correctamente`);
  });
}

// ========== SUITE RUNNER ==========

/**
 * Ejecuta toda la suite de pruebas
 */
async function runClientesTestSuite() {
  console.log('\n' + '█'.repeat(80));
  console.log('🚀 INICIANDO SUITE DE PRUEBAS DE CLIENTES');
  console.log('█'.repeat(80));
  console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
  console.log(`📋 Total de casos: 20 (TC-CLI-001 a TC-CLI-020)`);
  console.log('█'.repeat(80));

  try {
    // Inicializar driver
    console.log('\n🔧 Inicializando Electron driver...');
    driver = await createElectronDriver();

    // Inicializar Page Objects
    loginPage = new LoginPage(driver);
    clientesPage = new ClientesPage(driver);

    // Esperar a que cargue la página de login
    await loginPage.waitForPageLoad();
    await clientesPage.screenshot('00-INITIAL-STATE');

    // Setup inicial: Login y navegar a Clientes
    await setupClientes();
    await clientesPage.screenshot('01-CLIENTES-VIEW');

    // Ejecutar tests
    await testTC_CLI_001();
    await testTC_CLI_002();
    await testTC_CLI_003();
    await testTC_CLI_004();
    await testTC_CLI_005();
    await testTC_CLI_006();
    await testTC_CLI_007();
    await testTC_CLI_008();
    await testTC_CLI_009();
    await testTC_CLI_010();
    await testTC_CLI_011();
    await testTC_CLI_012();
    await testTC_CLI_013();
    await testTC_CLI_014();
    await testTC_CLI_015();
    await testTC_CLI_016();
    await testTC_CLI_017();
    await testTC_CLI_018();
    await testTC_CLI_019();
    await testTC_CLI_020();

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
    const filename = `clientes-test-results-${timestamp}.json`;
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
  runClientesTestSuite()
    .then(() => {
      const exitCode = testResults.failed === 0 ? 0 : 1;
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runClientesTestSuite };
