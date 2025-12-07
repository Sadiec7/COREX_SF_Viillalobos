// export-excel.test.js - Suite de pruebas para Exportación a Excel

const { createElectronDriver, quitDriver } = require('../helpers/electron-driver');
const LoginPage = require('../page-objects/LoginPage');
const ClientesPage = require('../page-objects/ClientesPage');
const PolizasPage = require('../page-objects/PolizasPage');
const RecibosPage = require('../page-objects/RecibosPage');
const testData = require('../helpers/test-data');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Variables globales
let driver;
let loginPage;
let clientesPage;
let polizasPage;
let recibosPage;

// Directorio de exportaciones
const EXPORTS_DIR = path.join(os.homedir(), 'Documents', 'Exports_VILLALOBOS');

// Resultados de tests
const testResults = {
    suite: 'Export Excel',
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
async function runTest(testId, description, testFunction, page) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🧪 Ejecutando: ${testId} - ${description}`);
    console.log('='.repeat(80));

    try {
        await testFunction();
        logTestResult(testId, description, true);
    } catch (error) {
        logTestResult(testId, description, false, error.message);
        if (page && page.screenshot) {
            await page.screenshot(`${testId}-FAILED`);
        }
        console.error(`❌ Test falló pero continuando con la suite...`);
    }
}

/**
 * Obtiene archivos recientes en el directorio de exportación
 */
function getRecentExportFiles(prefix, withinSeconds = 30) {
    if (!fs.existsSync(EXPORTS_DIR)) {
        return [];
    }

    const now = Date.now();
    const files = fs.readdirSync(EXPORTS_DIR)
        .filter(f => f.startsWith(prefix) && f.endsWith('.xlsx'))
        .map(f => ({
            name: f,
            path: path.join(EXPORTS_DIR, f),
            mtime: fs.statSync(path.join(EXPORTS_DIR, f)).mtime.getTime()
        }))
        .filter(f => (now - f.mtime) < withinSeconds * 1000)
        .sort((a, b) => b.mtime - a.mtime);

    return files;
}

/**
 * Limpia archivos de prueba antiguos
 */
function cleanOldTestFiles() {
    if (!fs.existsSync(EXPORTS_DIR)) return;

    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const files = fs.readdirSync(EXPORTS_DIR);

    files.forEach(f => {
        const filePath = path.join(EXPORTS_DIR, f);
        const stat = fs.statSync(filePath);
        if (stat.mtime.getTime() < oneHourAgo) {
            // No eliminamos archivos viejos en producción
        }
    });
}

/**
 * Cierra cualquier modal o toast abierto
 */
async function closeAnyOverlay(page) {
    try {
        // Esperar a que se cierre cualquier toast visible
        await page.sleep(500);

        // Intentar cerrar el modal de confirmación si está abierto
        try {
            const confirmModal = await driver.findElement({ id: 'confirm-modal' });
            const isHidden = await confirmModal.getAttribute('class').then(cls => cls.includes('hidden'));

            if (!isHidden) {
                // Click en el backdrop para cerrar
                const backdrop = await driver.findElement({ id: 'confirm-modal-backdrop' });
                await backdrop.click();
                await page.sleep(500);
            }
        } catch (e) { }

        // Intentar cerrar toasts haciendo clic en el backdrop general
        try {
            const toastContainers = await driver.findElements({ css: '.fixed.inset-0:not(#confirm-modal)' });
            for (const container of toastContainers) {
                try {
                    const isDisplayed = await container.isDisplayed();
                    if (isDisplayed) {
                        // Usar JavaScript para remover el elemento
                        await driver.executeScript('arguments[0].remove()', container);
                    }
                } catch (e) { }
            }
        } catch (e) { }

        await page.sleep(300);
    } catch (e) {
        // Ignorar errores
    }
}

/**
 * Maneja el modal de exportación y hace clic en "Exportar Todas"
 */
async function handleExportModal(page) {
    try {
        await page.sleep(800);

        // Verificar si el modal está visible
        const confirmModal = await driver.findElement({ id: 'confirm-modal' });
        const isHidden = await confirmModal.getAttribute('class').then(cls => cls.includes('hidden'));

        if (!isHidden) {
            console.log('   📋 Modal de exportación detectado');
            // Hacer clic en "Exportar Todas" (botón de confirmar)
            const confirmBtn = await driver.findElement({ id: 'confirm-modal-confirm' });
            await confirmBtn.click();
            console.log('   ✅ Clic en "Exportar Todas"');
            await page.sleep(500);
        }
    } catch (e) {
        // No hay modal visible, continuar normalmente
    }
}

/**
 * Espera a que desaparezcan todos los overlays
 */
async function waitForOverlaysToClear(page, maxWaitMs = 5000) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
        try {
            // Verificar si hay algún overlay bloqueando
            const overlays = await driver.findElements({ css: '.fixed.inset-0:not(.hidden)' });
            let hasBlockingOverlay = false;

            for (const overlay of overlays) {
                try {
                    const isDisplayed = await overlay.isDisplayed();
                    const zIndex = await overlay.getCssValue('z-index');
                    if (isDisplayed && parseInt(zIndex) > 100) {
                        hasBlockingOverlay = true;
                        break;
                    }
                } catch (e) { }
            }

            if (!hasBlockingOverlay) {
                return true;
            }

            await page.sleep(200);
        } catch (e) {
            return true;
        }
    }

    console.log('   ⚠️ Timeout esperando que se cierren overlays');
    return false;
}

// ==================== SUITE DE TESTS ====================

async function runExportExcelTests() {
    console.log('\n' + '🚀'.repeat(40));
    console.log('   SUITE DE TESTS: EXPORTACIÓN A EXCEL');
    console.log('🚀'.repeat(40) + '\n');

    try {
        // ==================== SETUP ====================
        console.log('📦 Iniciando driver de Electron...');
        driver = await createElectronDriver();
        console.log('✅ Driver creado');

        // Inicializar page objects
        loginPage = new LoginPage(driver);
        clientesPage = new ClientesPage(driver);
        polizasPage = new PolizasPage(driver);
        recibosPage = new RecibosPage(driver);

        // Esperar a que cargue la app
        await loginPage.waitForPageLoad();
        console.log('✅ Aplicación cargada');

        // Login
        console.log('\n🔐 Haciendo login...');
        const { username, password } = testData.usuarios.admin;
        await loginPage.login(username, password);
        await loginPage.waitForRedirection();
        console.log('✅ Login exitoso');

        // ==================== TEST: Botón Export visible en Clientes ====================
        await runTest('TC-EXP-001', 'Botón Exportar visible en módulo Clientes', async () => {
            await clientesPage.navigateToClientes();
            await clientesPage.waitForPageLoad();

            const isVisible = await clientesPage.isExportButtonVisible();
            if (!isVisible) {
                throw new Error('El botón de exportar no está visible en Clientes');
            }

            await clientesPage.screenshot('TC-EXP-001-EXPORT-BTN-VISIBLE');
        }, clientesPage);

        // ==================== TEST: Exportar Clientes ====================
        await runTest('TC-EXP-002', 'Exportar Clientes a Excel', async () => {
            // Click en exportar
            await clientesPage.clickExportExcel();

            // Manejar modal si aparece
            await handleExportModal(clientesPage);

            // Esperar a que se genere el archivo
            await clientesPage.sleep(3000);

            // Verificar que se creó un archivo nuevo
            const filesAfter = getRecentExportFiles('Clientes', 15);

            if (filesAfter.length === 0) {
                throw new Error('No se generó archivo de exportación de Clientes');
            }

            const newFile = filesAfter[0];
            const fileSize = fs.statSync(newFile.path).size;

            console.log(`   📄 Archivo generado: ${newFile.name}`);
            console.log(`   📊 Tamaño: ${(fileSize / 1024).toFixed(2)} KB`);

            if (fileSize < 1000) {
                throw new Error('El archivo generado parece estar vacío o corrupto');
            }

            await clientesPage.screenshot('TC-EXP-002-CLIENTES-EXPORTED');
        }, clientesPage);

        // Esperar a que se cierren overlays antes de continuar
        await waitForOverlaysToClear(clientesPage);
        await closeAnyOverlay(clientesPage);
        await clientesPage.sleep(1500);

        // ==================== TEST: Botón Export visible en Pólizas ====================
        await runTest('TC-EXP-003', 'Botón Exportar visible en módulo Pólizas', async () => {
            // Navegar a Pólizas usando JavaScript click para evitar interceptación
            const navItem = await driver.findElement({ css: 'a[data-view="polizas"]' });
            await driver.executeScript('arguments[0].click()', navItem);
            await polizasPage.waitForPageLoad();
            await polizasPage.sleep(1000);

            const btnExport = await driver.findElement({ id: 'btnExportExcel' });
            const isVisible = await btnExport.isDisplayed();

            if (!isVisible) {
                throw new Error('El botón de exportar no está visible en Pólizas');
            }

            await polizasPage.screenshot('TC-EXP-003-POLIZAS-EXPORT-BTN');
        }, polizasPage);

        // ==================== TEST: Exportar Pólizas ====================
        await runTest('TC-EXP-004', 'Exportar Pólizas a Excel', async () => {
            // Click en exportar usando JavaScript para evitar interceptación
            const btnExport = await driver.findElement({ id: 'btnExportExcel' });
            await driver.executeScript('arguments[0].click()', btnExport);

            // Manejar modal si aparece
            await handleExportModal(polizasPage);

            // Esperar a que se genere el archivo
            await polizasPage.sleep(3000);

            // Verificar archivo
            const filesAfter = getRecentExportFiles('Polizas', 20);

            if (filesAfter.length === 0) {
                throw new Error('No se generó archivo de exportación de Pólizas');
            }

            const newFile = filesAfter[0];
            const fileSize = fs.statSync(newFile.path).size;

            console.log(`   📄 Archivo generado: ${newFile.name}`);
            console.log(`   📊 Tamaño: ${(fileSize / 1024).toFixed(2)} KB`);

            if (fileSize < 1000) {
                throw new Error('El archivo generado parece estar vacío o corrupto');
            }

            await polizasPage.screenshot('TC-EXP-004-POLIZAS-EXPORTED');
        }, polizasPage);

        // Esperar a que se cierren overlays
        await waitForOverlaysToClear(polizasPage);
        await closeAnyOverlay(polizasPage);
        await polizasPage.sleep(1500);

        // ==================== TEST: Botón Export visible en Recibos ====================
        await runTest('TC-EXP-005', 'Botón Exportar visible en módulo Recibos', async () => {
            // Navegar a Recibos usando JavaScript click para evitar interceptación
            const navItem = await driver.findElement({ css: 'a[data-view="recibos"]' });
            await driver.executeScript('arguments[0].click()', navItem);
            await recibosPage.waitForPageLoad();
            await recibosPage.sleep(1000);

            const btnExport = await driver.findElement({ id: 'btnExportExcel' });
            const isVisible = await btnExport.isDisplayed();

            if (!isVisible) {
                throw new Error('El botón de exportar no está visible en Recibos');
            }

            await recibosPage.screenshot('TC-EXP-005-RECIBOS-EXPORT-BTN');
        }, recibosPage);

        // ==================== TEST: Exportar Recibos ====================
        await runTest('TC-EXP-006', 'Exportar Recibos a Excel', async () => {
            // Click en exportar usando JavaScript para evitar interceptación
            const btnExport = await driver.findElement({ id: 'btnExportExcel' });
            await driver.executeScript('arguments[0].click()', btnExport);

            // Manejar modal si aparece
            await handleExportModal(recibosPage);

            // Esperar a que se genere el archivo (recibos puede tomar más tiempo)
            await recibosPage.sleep(5000);

            // Verificar archivo
            const filesAfter = getRecentExportFiles('Recibos', 30);

            if (filesAfter.length === 0) {
                throw new Error('No se generó archivo de exportación de Recibos');
            }

            const newFile = filesAfter[0];
            const fileSize = fs.statSync(newFile.path).size;

            console.log(`   📄 Archivo generado: ${newFile.name}`);
            console.log(`   📊 Tamaño: ${(fileSize / 1024).toFixed(2)} KB`);

            if (fileSize < 1000) {
                throw new Error('El archivo generado parece estar vacío o corrupto');
            }

            await recibosPage.screenshot('TC-EXP-006-RECIBOS-EXPORTED');
        }, recibosPage);

        // ==================== TEST: Verificar estructura de archivos ====================
        await runTest('TC-EXP-007', 'Verificar directorio de exportaciones', async () => {
            if (!fs.existsSync(EXPORTS_DIR)) {
                throw new Error(`El directorio ${EXPORTS_DIR} no existe`);
            }

            const files = fs.readdirSync(EXPORTS_DIR).filter(f => f.endsWith('.xlsx'));
            console.log(`   📁 Directorio: ${EXPORTS_DIR}`);
            console.log(`   📊 Total archivos Excel: ${files.length}`);

            if (files.length < 3) {
                throw new Error('Deberían existir al menos 3 archivos de exportación');
            }

            // Listar archivos recientes
            const recentFiles = getRecentExportFiles('', 60);
            console.log(`   📄 Archivos recientes (último minuto):`);
            recentFiles.forEach(f => {
                console.log(`      - ${f.name}`);
            });

            await clientesPage.screenshot('TC-EXP-007-EXPORTS-VERIFIED');
        }, clientesPage);

    } catch (error) {
        console.error('\n💥 Error fatal en la suite:', error.message);
        testResults.results.push({
            testId: 'SUITE-ERROR',
            description: 'Error fatal en la suite',
            passed: false,
            message: error.message,
            timestamp: new Date().toISOString()
        });
    } finally {
        // ==================== CLEANUP ====================
        console.log('\n🧹 Limpiando...');

        if (driver) {
            await quitDriver(driver);
            console.log('✅ Driver cerrado');
        }

        // ==================== REPORTE FINAL ====================
        console.log('\n' + '='.repeat(80));
        console.log('📊 RESUMEN DE RESULTADOS - EXPORTACIÓN A EXCEL');
        console.log('='.repeat(80));
        console.log(`   Total tests:    ${testResults.total}`);
        console.log(`   ✅ Pasados:      ${testResults.passed}`);
        console.log(`   ❌ Fallidos:     ${testResults.failed}`);
        console.log(`   📈 Tasa éxito:   ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
        console.log('='.repeat(80));

        // Guardar resultados
        const resultsPath = path.join(
            __dirname,
            '..',
            '..',
            'reports',
            `export-excel-test-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        );

        try {
            fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
            console.log(`\n📄 Resultados guardados en: ${resultsPath}`);
        } catch (err) {
            console.error('Error guardando resultados:', err.message);
        }

        // Listar archivos generados
        console.log('\n📁 Archivos Excel generados:');
        const allExports = getRecentExportFiles('', 300);
        allExports.forEach(f => {
            const size = (fs.statSync(f.path).size / 1024).toFixed(2);
            console.log(`   📊 ${f.name} (${size} KB)`);
        });

        console.log('\n✨ Suite de tests completada\n');
    }
}

// Ejecutar tests
runExportExcelTests();
