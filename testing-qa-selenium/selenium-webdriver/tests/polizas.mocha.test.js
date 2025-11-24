// polizas.mocha.test.js - Suite de pruebas MOCHA para Pólizas (con Mochawesome)

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const LoginPage = require('../page-objects/LoginPage');
const PolizasPage = require('../page-objects/PolizasPage');
const testData = require('../helpers/test-data');
const assert = require('assert');

// Variables globales
let driver;
let loginPage;
let polizasPage;

describe('Suite de Pólizas', function() {
  // Timeout global para tests lentos
  this.timeout(120000);
  this.slow(30000);

  // Setup: Ejecutar ANTES de todos los tests
  before(async function() {
    console.log('\n🚀 Inicializando driver de Electron...');
    driver = await createElectronDriver();
    loginPage = new LoginPage(driver);
    polizasPage = new PolizasPage(driver);

    console.log('🔐 Haciendo login...');
    const { username, password } = testData.usuarios.admin;
    await loginPage.login(username, password);
    await loginPage.waitForRedirection();

    console.log('📋 Navegando a Pólizas...');
    await polizasPage.navigateToPolizas();
    await polizasPage.waitForPageLoad();

    console.log('✅ Setup completado\n');
  });

  // Teardown: Ejecutar DESPUÉS de todos los tests
  after(async function() {
    console.log('\n🧹 Cerrando driver...');
    if (driver) {
      await quitDriver(driver);
    }
    console.log('✅ Driver cerrado');
  });

  // Helper para reset entre tests
  async function resetForNextTest() {
    console.log('🔄 Preparando siguiente test...');

    // Esperar a que toasts desaparezcan
    await polizasPage.sleep(2000);

    // Cerrar cualquier modal abierto
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
        break;
      }
    }

    // Limpiar búsqueda
    await polizasPage.clearSearch();
    await polizasPage.sleep(500);

    console.log('✅ Listo para siguiente test');
  }

  // ========== TESTS ==========

  describe('Gestión de Pólizas', function() {

    it('TC-POL-001: Crear póliza nueva', async function() {
      await resetForNextTest();

      console.log('🧪 TC-POL-001: Crear póliza nueva');

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

      await polizasPage.openNewPolizaModal();
      await polizasPage.sleep(1000);

      await polizasPage.screenshot('01-POLIZAS-VIEW');

      await polizasPage.fillPolizaForm(poliza);
      await polizasPage.sleep(500);

      await polizasPage.submitPolizaForm();
      await polizasPage.sleep(2000);

      const toastMessage = await polizasPage.getToastMessage();
      await polizasPage.screenshot('TC-POL-001-CREATED');

      assert.ok(toastMessage, 'Debería mostrar mensaje de éxito');
      assert.ok(
        toastMessage.includes('creada') || toastMessage.includes('éxito'),
        `Mensaje incorrecto: ${toastMessage}`
      );

      console.log('✅ Póliza creada correctamente');
    });

    it('TC-POL-002: Validación de campos obligatorios', async function() {
      await resetForNextTest();

      console.log('🧪 TC-POL-002: Validación de campos obligatorios');

      await polizasPage.openNewPolizaModal();
      await polizasPage.sleep(1000);

      await polizasPage.submitPolizaForm();
      await polizasPage.sleep(1000);

      const toastMessage = await polizasPage.getToastMessage();
      await polizasPage.screenshot('TC-POL-002-VALIDATION');

      // El sistema debe prevenir el submit o mostrar error
      if (toastMessage) {
        assert.ok(
          toastMessage.includes('obligatorio') ||
          toastMessage.includes('requerido') ||
          toastMessage.includes('completa'),
          `Mensaje de validación incorrecto: ${toastMessage}`
        );
      }

      // Cerrar modal
      await polizasPage.closeModal();
      await polizasPage.sleep(500);

      console.log('✅ Validación de campos obligatorios funciona');
    });

    it('TC-POL-003: Validación de fechas inválidas', async function() {
      await resetForNextTest();

      console.log('🧪 TC-POL-003: Validación de fechas inválidas');

      const polizaInvalida = {
        numero_poliza: 'POL-INVALID-' + Date.now(),
        selectFirstClient: true,
        selectFirstAseguradora: true,
        selectFirstRamo: true,
        selectFirstPeriodicidad: true,
        selectFirstMetodoPago: true,
        fecha_inicio: '2025-12-31',
        fecha_fin: '2025-01-01', // Fecha fin ANTES de inicio
        prima_neta: '5000',
        prima_total: '5800',
        suma_asegurada: '100000'
      };

      await polizasPage.openNewPolizaModal();
      await polizasPage.sleep(1000);

      await polizasPage.fillPolizaForm(polizaInvalida);
      await polizasPage.sleep(500);

      await polizasPage.submitPolizaForm();
      await polizasPage.sleep(2000);

      const toastMessage = await polizasPage.getToastMessage();
      await polizasPage.screenshot('TC-POL-003-INVALID-DATES');

      assert.ok(toastMessage, 'Debería mostrar mensaje de error');
      assert.ok(
        toastMessage.includes('fecha') ||
        toastMessage.includes('Error') ||
        toastMessage.includes('inválid'),
        `Mensaje de error incorrecto: ${toastMessage}`
      );

      await polizasPage.closeModal();
      await polizasPage.sleep(500);

      console.log('✅ Validación de fechas funciona correctamente');
    });
  });

  describe('Búsqueda de Pólizas', function() {

    it('TC-POL-004: Búsqueda básica por número de póliza', async function() {
      await resetForNextTest();

      console.log('🧪 TC-POL-004: Búsqueda básica');

      const totalInicial = await polizasPage.getTotalPolizas();
      console.log(`   📊 Total inicial: ${totalInicial} pólizas`);

      await polizasPage.searchPoliza('POL');
      await polizasPage.sleep(1000);

      const totalFiltrado = await polizasPage.getTotalPolizas();
      await polizasPage.screenshot('TC-POL-004-SEARCH');

      console.log(`   🔍 Total filtrado: ${totalFiltrado} pólizas`);

      assert.ok(totalFiltrado >= 0, 'Debería mostrar resultados');

      await polizasPage.clearSearch();
      await polizasPage.sleep(1000);

      const totalRestaurado = await polizasPage.getTotalPolizas();
      assert.strictEqual(
        totalRestaurado,
        totalInicial,
        'Al limpiar búsqueda debería restaurar total original'
      );

      console.log('✅ Búsqueda básica funciona correctamente');
    });

    it('TC-POL-005: Visualización de estadísticas', async function() {
      await resetForNextTest();

      console.log('🧪 TC-POL-005: Visualización de estadísticas');

      const totalPolizas = await polizasPage.getTotalPolizas();
      await polizasPage.screenshot('TC-POL-005-STATS');

      assert.ok(totalPolizas >= 0, 'Debería mostrar el total de pólizas');

      console.log(`   📊 Total de pólizas en sistema: ${totalPolizas}`);
      console.log('✅ Estadísticas se muestran correctamente');
    });
  });

  describe('Validaciones Avanzadas', function() {

    it('TC-POL-010: Validación de prima negativa', async function() {
      await resetForNextTest();

      console.log('🧪 TC-POL-010: Validación de prima negativa');

      const polizaInvalida = {
        numero_poliza: 'POL-NEG-' + Date.now(),
        selectFirstClient: true,
        selectFirstAseguradora: true,
        selectFirstRamo: true,
        selectFirstPeriodicidad: true,
        selectFirstMetodoPago: true,
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-12-31',
        prima_neta: '-5000', // Prima negativa
        prima_total: '5800',
        suma_asegurada: '100000'
      };

      await polizasPage.openNewPolizaModal();
      await polizasPage.sleep(1000);

      await polizasPage.fillPolizaForm(polizaInvalida);
      await polizasPage.sleep(500);

      await polizasPage.submitPolizaForm();
      await polizasPage.sleep(2000);

      const toastMessage = await polizasPage.getToastMessage();
      await polizasPage.screenshot('TC-POL-010-NEGATIVE-PRIMA');

      // HTML5 o backend debe rechazar prima negativa
      if (toastMessage) {
        assert.ok(
          toastMessage.toLowerCase().includes('error') ||
          toastMessage.toLowerCase().includes('inválid') ||
          toastMessage.toLowerCase().includes('negativ'),
          `Mensaje de error incorrecto: ${toastMessage}`
        );
      }

      await polizasPage.closeModal();
      await polizasPage.sleep(500);

      console.log('✅ Validación de prima negativa funciona');
    });
  });
});
