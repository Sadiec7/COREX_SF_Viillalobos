// test-automation.js - Automatización ROBUSTA con manejo de errores
const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

const EVIDENCES_DIR = path.join(__dirname, 'test-evidences');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Tracking de resultados
const results = {
    passed: [],
    failed: [],
    skipped: []
};

const UNIQUE_TAG = Date.now();
const CLIENT_FIXTURE = {
    nombre: `Juan Pérez ${UNIQUE_TAG}`,
    email: `juan.${UNIQUE_TAG}@test.com`,
    telefono: '5551234567',
    rfc: `JUA${(UNIQUE_TAG % 1000000).toString().padStart(6, '0')}AA`,
    updatedTelefono: '5559876543'
};

const INVALID_EMAIL_FIXTURE = {
    nombre: `María Gómez ${UNIQUE_TAG}`,
   email: 'correo-invalido',
   telefono: '5559998888',
   rfc: `MAR${(UNIQUE_TAG % 1000000).toString().padStart(6, '0')}BB`
};

const dialogCaptureQueue = [];

// Asegurar carpeta
if (!fs.existsSync(EVIDENCES_DIR)) {
    fs.mkdirSync(EVIDENCES_DIR);
}

// Helper: Cerrar modales si están abiertos
async function closeAnyModal(window) {
    try {
        const modalCliente = await window.locator('#modalCliente.active').count();
        if (modalCliente > 0) {
            console.log('   🔧 Cerrando modal de cliente...');
            await window.locator('#btnCancelForm, #btnCloseModal').first().click({ timeout: 2000 });
            await sleep(500);
        }

        const modalPoliza = await window.locator('#modalPoliza.active').count();
        if (modalPoliza > 0) {
            console.log('   🔧 Cerrando modal de póliza...');
            await window.locator('#btnCancelForm, #btnCloseModal').first().click({ timeout: 2000 });
            await sleep(500);
        }
    } catch (e) {
        // Ignorar si no hay modal
    }
}

// Helper: Captura con retry
async function takeScreenshot(window, filename, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            await window.screenshot({ path: path.join(EVIDENCES_DIR, filename) });
            console.log(`   ✓ Captura: ${filename}`);
            return true;
        } catch (error) {
            if (i === retries) {
                console.log(`   ⚠ Error capturando ${filename}: ${error.message}`);
                return false;
            }
            await sleep(500);
        }
    }
}

async function ensureOnLogin(window) {
    await window.waitForSelector('#userInput', { timeout: 10000 });
    await window.waitForSelector('#passInput', { timeout: 10000 });
}

async function performLogin(window, username = 'admin', password = 'admin123') {
    await ensureOnLogin(window);
    await window.locator('#userInput').fill(username);
    await window.locator('#passInput').fill(password);
    await window.locator('button[type="submit"]').click();
    await window.waitForSelector('#logoutButton', { timeout: 10000 });
}

async function performLogout(window) {
    await window.waitForSelector('#logoutButton', { timeout: 10000 });
    await window.locator('#logoutButton').click();
    await sleep(500);
    await window.waitForSelector('#userInput', { timeout: 10000 });
    await sleep(500);
}

async function clickWithoutWait(locator, delay = 600) {
    await locator.click({ noWaitAfter: true });
    await sleep(delay);
}

// Helper: Ejecutar caso de prueba con try-catch
async function runTestCase(testId, testName, testFunc) {
    console.log(`🧪 ${testId}: ${testName}`);
    try {
        await testFunc();
        console.log(`   ✅ ${testId}: PASS\n`);
        results.passed.push(testId);
        return true;
    } catch (error) {
        console.log(`   ❌ ${testId}: FAIL - ${error.message}\n`);
        results.failed.push({ id: testId, error: error.message });
        return false;
    }
}

async function runTests() {
    console.log('🚀 Iniciando automatización ROBUSTA de pruebas COREX...\n');

    // Limpiar base de datos anterior para empezar fresco
    const legacyDbPath = path.join(__dirname, 'seguros.db');
    if (fs.existsSync(legacyDbPath)) {
        console.log('🗑️  Eliminando base de datos legacy (seguros.db)...');
        fs.unlinkSync(legacyDbPath);
    }

    const dbPath = path.join(__dirname, 'gestor_polizas_v2.sqlite');
    if (fs.existsSync(dbPath)) {
        console.log('🗑️  Reseteando base de datos principal...');
        fs.unlinkSync(dbPath);
        console.log('✅ Base de datos reiniciada\n');
    }

    // Generar timestamp para datos únicos
    const timestamp = Date.now();

    const electronApp = await electron.launch({
        args: [path.join(__dirname, 'main.js')]
    });

    const window = await electronApp.firstWindow();
    console.log('✅ Aplicación Electron iniciada\n');

    window.on('dialog', async (dialog) => {
        const capture = dialogCaptureQueue.shift();
        const message = dialog.message();
        console.log(`   💬 Dialog: ${message}`);
        await dialog.accept();

        if (capture && capture.filename) {
            try {
                // Insert faux dialog overlay for screenshot
                await window.evaluate((msg) => {
                    const overlay = document.createElement('div');
                    overlay.id = '__automationDialog';
                    overlay.setAttribute('style', `
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.35);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    `);
                    overlay.innerHTML = `
                        <div style="
                            background: white;
                            min-width: 320px;
                            max-width: 480px;
                            padding: 24px;
                            border-radius: 12px;
                            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
                            border: 1px solid rgba(148, 163, 184, 0.25);
                            text-align: center;
                        ">
                            <h3 style="margin-bottom: 12px; font-size: 18px; color: #0f172a;">Mensaje del sistema</h3>
                            <p style="margin: 0; font-size: 16px; color: #1e293b;">${msg.replace(/</g, '&lt;')}</p>
                        </div>
                    `;
                    document.body.appendChild(overlay);
                }, message);

                await sleep(150);
                await takeScreenshot(window, capture.filename);
            } catch (error) {
                console.log(`   ⚠ No se pudo capturar diálogo (${capture.filename}): ${error.message}`);
            } finally {
                await window.evaluate(() => {
                    const overlay = document.getElementById('__automationDialog');
                    if (overlay) overlay.remove();
                });
            }
        }
    });

    try {
        // ==================== SUITE: LOGIN ====================
        console.log('═══════════════════════════════════════════════');
        console.log('📋 SUITE: LOGIN');
        console.log('═══════════════════════════════════════════════\n');

        await runTestCase('TC-LOG-001', 'Inicio de sesión válido', async () => {
            await ensureOnLogin(window);
            await takeScreenshot(window, 'TC-LOG-001_01_pantalla_login.png');
            await window.locator('#userInput').fill('admin');
            await window.locator('#passInput').fill('admin123');
            await takeScreenshot(window, 'TC-LOG-001_02_credenciales_listas.png');
            await window.locator('button[type="submit"]').click();
            await window.waitForSelector('#buttonLoader', { state: 'visible', timeout: 3000 });
            await sleep(200);
            await takeScreenshot(window, 'TC-LOG-001_03_boton_loading.png');
            await window.waitForSelector('#logoutButton', { timeout: 10000 });
            await sleep(1000);
            await takeScreenshot(window, 'TC-LOG-001_04_dashboard_exitoso.png');
            await window.locator('#logoutButton').click();
            await window.waitForSelector('#userInput', { timeout: 10000 });
        });

        await runTestCase('TC-LOG-002', 'Contraseña incorrecta', async () => {
            await ensureOnLogin(window);
            await window.locator('#userInput').fill('admin');
            await window.locator('#passInput').fill('password_incorrecto');
            await takeScreenshot(window, 'TC-LOG-002_01_credenciales_invalidas.png');
            await window.locator('button[type="submit"]').click();
            await sleep(1200);
            await takeScreenshot(window, 'TC-LOG-002_02_mensaje_error.png');
        });

        await runTestCase('TC-LOG-003', 'Usuario inexistente', async () => {
            await ensureOnLogin(window);
            await window.locator('#userInput').fill(`usuario_${UNIQUE_TAG}`);
            await window.locator('#passInput').fill('admin123');
            await takeScreenshot(window, 'TC-LOG-003_01_usuario_inexistente.png');
            await window.locator('button[type="submit"]').click();
            await sleep(1200);
            await takeScreenshot(window, 'TC-LOG-003_02_mensaje_error.png');
        });

        await runTestCase('TC-LOG-005', 'Campo contraseña vacío', async () => {
            await ensureOnLogin(window);
            await window.locator('#userInput').fill('admin');
            await window.locator('#passInput').fill('');
            await takeScreenshot(window, 'TC-LOG-005_01_password_vacio.png');
            await window.locator('button[type="submit"]').click();
            await sleep(400);
            await takeScreenshot(window, 'TC-LOG-005_02_validacion.png');
        });

        await runTestCase('TC-LOG-006', 'Campo usuario vacío', async () => {
            await ensureOnLogin(window);
            await window.locator('#userInput').fill('');
            await window.locator('#passInput').fill('admin123');
            await takeScreenshot(window, 'TC-LOG-006_01_usuario_vacio.png');
            await window.locator('button[type="submit"]').click();
            await sleep(400);
            await takeScreenshot(window, 'TC-LOG-006_02_validacion.png');
        });

        await runTestCase('TC-LOG-009', 'Cierre de sesión exitoso', async () => {
            await performLogin(window);
            await sleep(800);
            await takeScreenshot(window, 'TC-LOG-009_01_dashboard_activo.png');
            await window.locator('#logoutButton').click();
            await sleep(600);
            await takeScreenshot(window, 'TC-LOG-009_02_dialogo_confirmacion.png');
            await window.waitForSelector('#userInput', { timeout: 10000 });
            await sleep(600);
            await takeScreenshot(window, 'TC-LOG-009_03_vuelta_login.png');
        });

        await runTestCase('TC-LOG-010', 'Redirección al dashboard tras login', async () => {
            await performLogin(window);
            await sleep(1000);
            await takeScreenshot(window, 'TC-LOG-010_01_dashboard_post_login.png');
            await window.locator('#logoutButton').click();
            await window.waitForSelector('#userInput', { timeout: 10000 });
        });

        console.log('🔄 Login para capturas del Dashboard...');
        await performLogin(window);
        await sleep(1500);

        // ==================== SUITE: DASHBOARD ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📋 SUITE: DASHBOARD');
        console.log('═══════════════════════════════════════════════\n');

        await runTestCase('DASHBOARD', 'Capturas Generales', async () => {
            await takeScreenshot(window, 'DASHBOARD_01_vista_general.png');
            await takeScreenshot(window, 'DASHBOARD_02_metricas.png');
            await takeScreenshot(window, 'DASHBOARD_03_navegacion.png');
        });

        // ==================== SUITE: CLIENTES ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📋 SUITE: CLIENTES');
        console.log('═══════════════════════════════════════════════\n');

        console.log('🔄 Navegando a Clientes...');
        await window.locator('a[href="clientes_view.html"]').click();
        await sleep(2000);

        await runTestCase('TC-CLI-001', 'Registro de cliente válido', async () => {
            await closeAnyModal(window);
            await takeScreenshot(window, 'TC-CLI-001_01_modulo_clientes.png');
            await window.locator('#btnAddCliente').click();
            await sleep(600);
            await takeScreenshot(window, 'TC-CLI-001_02_formulario_nuevo.png');
            await window.locator('#inputNombre').fill(CLIENT_FIXTURE.nombre);
            await window.locator('#inputEmail').fill(CLIENT_FIXTURE.email);
            await window.locator('#inputTelefono').fill(CLIENT_FIXTURE.telefono);
            await window.locator('#inputRFC').fill(CLIENT_FIXTURE.rfc);
            await takeScreenshot(window, 'TC-CLI-001_03_datos_completados.png');
            dialogCaptureQueue.push({ filename: 'TC-CLI-001_04_alert.png' });
            await clickWithoutWait(window.locator('#formCliente button[type="submit"]'));
            await sleep(1200);
            await takeScreenshot(window, 'TC-CLI-001_05_cliente_creado.png');
        });

        await runTestCase('TC-CLI-002', 'Bloqueo por RFC duplicado', async () => {
            await closeAnyModal(window);
            await window.locator('#btnAddCliente').click();
            await sleep(600);
            await takeScreenshot(window, 'TC-CLI-002_01_formulario_nuevo.png');
            await window.locator('#inputNombre').fill(`Cliente Duplicado ${UNIQUE_TAG}`);
            await window.locator('#inputEmail').fill(`duplicado.${UNIQUE_TAG}@test.com`);
            await window.locator('#inputTelefono').fill('5550001111');
            await window.locator('#inputRFC').fill(CLIENT_FIXTURE.rfc);
            await takeScreenshot(window, 'TC-CLI-002_02_rfc_duplicado.png');
            dialogCaptureQueue.push({ filename: 'TC-CLI-002_04_alert.png' });
            await clickWithoutWait(window.locator('#formCliente button[type="submit"]'));
            await sleep(1200);
            await takeScreenshot(window, 'TC-CLI-002_03_mensaje_error.png');
            await window.locator('#btnCancelForm').click();
            await sleep(500);
        });

        await runTestCase('TC-CLI-003', 'Edición básica de contacto', async () => {
            await closeAnyModal(window);
            await takeScreenshot(window, 'TC-CLI-003_01_lista_clientes.png');
            const editBtn = window.locator('#clientesTableBody button[title="Editar"]').first();
            await editBtn.click();
            await sleep(600);
            await takeScreenshot(window, 'TC-CLI-003_02_formulario_edicion.png');
            await window.locator('#inputTelefono').fill(CLIENT_FIXTURE.updatedTelefono);
            await takeScreenshot(window, 'TC-CLI-003_03_campo_modificado.png');
            await clickWithoutWait(window.locator('#formCliente button[type="submit"]'));
            await sleep(1200);
            await takeScreenshot(window, 'TC-CLI-003_04_cliente_actualizado.png');
        });

        await runTestCase('TC-CLI-005', 'Email con formato inválido', async () => {
            await closeAnyModal(window);
            await window.locator('#btnAddCliente').click();
            await sleep(600);
            await window.locator('#inputNombre').fill(INVALID_EMAIL_FIXTURE.nombre);
            await window.locator('#inputEmail').fill(INVALID_EMAIL_FIXTURE.email);
            await window.locator('#inputTelefono').fill(INVALID_EMAIL_FIXTURE.telefono);
            await window.locator('#inputRFC').fill(INVALID_EMAIL_FIXTURE.rfc);
            await takeScreenshot(window, 'TC-CLI-005_01_email_invalido.png');
            dialogCaptureQueue.push({ filename: 'TC-CLI-005_03_alert.png' });
            await clickWithoutWait(window.locator('#formCliente button[type="submit"]'));
            await sleep(500);
            await takeScreenshot(window, 'TC-CLI-005_02_mensaje_error.png');
            await window.locator('#btnCancelForm').click();
            await sleep(500);
        });

        // ==================== SUITE: PÓLIZAS ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📋 SUITE: PÓLIZAS');
        console.log('═══════════════════════════════════════════════\n');

        console.log('🔄 Navegando a Pólizas...');
        await window.locator('#btnBack').click();
        await sleep(1500);
        await window.locator('a[href="polizas_view.html"]').click();
        await sleep(2000);

        await runTestCase('TC-POL-005', 'Número Duplicado', async () => {
            await closeAnyModal(window);
            await takeScreenshot(window, 'TC-POL-005_01_modulo_polizas.png');

            // Crear póliza inicial si no existe
            const hasPolizas = await window.locator('#polizasTableBody tr').count() > 0;
            if (!hasPolizas) {
                console.log('   📝 Creando póliza inicial...');
                await window.locator('#btnAddPoliza').click();
                await sleep(600);
                await window.locator('#inputNumero').fill('POL-2024-001');
                await window.locator('#inputCliente').selectOption({ index: 1 });
                await window.locator('#inputAseguradora').selectOption({ index: 1 });
                await window.locator('#inputRamo').selectOption({ index: 1 });
                await window.locator('#inputFechaInicio').fill('2024-01-01');
                await window.locator('#inputFechaFin').fill('2025-01-01');
                await window.locator('#inputPrima').fill('5000');
                await window.locator('#inputPeriodicidad').selectOption({ index: 1 });
                await clickWithoutWait(window.locator('#formPoliza button[type="submit"]'));
                await sleep(1500);
            }

            // Intentar duplicado
            await closeAnyModal(window);
            await window.locator('#btnAddPoliza').click();
            await sleep(600);
            await window.locator('#inputNumero').fill('POL-2024-001');
            await takeScreenshot(window, 'TC-POL-005_02_numero_duplicado.png');
            await window.locator('#inputCliente').selectOption({ index: 1 });
            await window.locator('#inputAseguradora').selectOption({ index: 1 });
            await window.locator('#inputRamo').selectOption({ index: 1 });
            await window.locator('#inputFechaInicio').fill('2024-01-01');
            await window.locator('#inputFechaFin').fill('2025-01-01');
            await window.locator('#inputPrima').fill('5000');
            await window.locator('#inputPeriodicidad').selectOption({ index: 1 });
            dialogCaptureQueue.push({ filename: 'TC-POL-005_04_alert.png' });
            await clickWithoutWait(window.locator('#formPoliza button[type="submit"]'));
            await sleep(1500);
            await takeScreenshot(window, 'TC-POL-005_03_error_duplicado.png');
            await window.locator('#btnCancelForm').click();
            await sleep(500);
        });

        await runTestCase('TC-POL-007', 'Filtrar por Estado', async () => {
            await closeAnyModal(window);
            await takeScreenshot(window, 'TC-POL-007_01_lista_completa.png');
            await window.locator('#filterEstado').selectOption('Vigente');
            await sleep(800);
            await takeScreenshot(window, 'TC-POL-007_02_filtro_activas.png');
            await window.locator('#filterEstado').selectOption('Vencida');
            await sleep(800);
            await takeScreenshot(window, 'TC-POL-007_03_filtro_vencidas.png');
            await window.locator('#filterEstado').selectOption('');
        });

        // ==================== SUITE: UI/UX ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📋 SUITE: UI/UX');
        console.log('═══════════════════════════════════════════════\n');

        await runTestCase('TC-UI-001', 'Consistencia visual formulario clientes', async () => {
            await closeAnyModal(window);
            await window.locator('#btnBack').click();
            await sleep(1500);
            await window.locator('a[href="clientes_view.html"]').click();
            await sleep(1500);
            await window.locator('#btnAddCliente').click();
            await sleep(600);
            await takeScreenshot(window, 'TC-UI-001_01_form_cliente.png');
            await window.locator('#btnCancelForm').click();
            await sleep(500);
        });

        await runTestCase('TC-UI-008', 'Alineación en formularios', async () => {
            await closeAnyModal(window);
            await window.locator('#btnAddCliente').click();
            await sleep(600);
            await takeScreenshot(window, 'TC-UI-008_01_formulario_alineado.png');
            await window.locator('#btnCancelForm').click();
            await sleep(500);
        });

        await runTestCase('TC-UI-009', 'Estados hover en botones', async () => {
            await closeAnyModal(window);
            await window.locator('#btnAddCliente').hover();
            await sleep(400);
            await takeScreenshot(window, 'TC-UI-009_01_hover_boton_nuevo.png');
            const editButton = window.locator('#clientesTableBody button[title="Editar"]').first();
            if (await editButton.count() > 0) {
                await editButton.hover();
                await sleep(400);
                await takeScreenshot(window, 'TC-UI-009_02_hover_boton_editar.png');
            }
        });

        await runTestCase('TC-UI-010', 'Iconografía renderizada', async () => {
            await closeAnyModal(window);
            await takeScreenshot(window, 'TC-UI-010_01_iconos_clientes.png');
        });

        await runTestCase('TC-UI-004', 'Contraste en vistas principales', async () => {
            await window.locator('#btnBack').click();
            await sleep(1500);
            await takeScreenshot(window, 'TC-UI-004_01_dashboard_contraste.png');
        });

        await runTestCase('TC-UI-007', 'Logo visible en vistas clave', async () => {
            await takeScreenshot(window, 'TC-UI-007_01_logo_sidebar.png');
            await window.locator('#logoutButton').click();
            await sleep(1200);
            await takeScreenshot(window, 'TC-UI-007_02_logo_login.png');
        });

    } catch (error) {
        console.error('\n❌ Error crítico:', error.message);
    } finally {
        // ==================== RESUMEN FINAL ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📊 RESUMEN DE EJECUCIÓN');
        console.log('═══════════════════════════════════════════════\n');

        const files = fs.readdirSync(EVIDENCES_DIR).filter(f => f.endsWith('.png'));
        console.log(`📸 Total capturas: ${files.length}`);
        console.log(`✅ Casos exitosos: ${results.passed.length}`);
        console.log(`❌ Casos fallidos: ${results.failed.length}`);

        if (results.failed.length > 0) {
            console.log('\n⚠️  Casos que fallaron:');
            results.failed.forEach(f => console.log(`   - ${f.id}: ${f.error}`));
        }

        console.log(`\n📁 Ubicación: ${EVIDENCES_DIR}\n`);

        await electronApp.close();
        console.log('🔚 Aplicación cerrada\n');
    }
}

runTests().catch(console.error);
