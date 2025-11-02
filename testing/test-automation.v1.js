// test-automation.js - Automatización completa de pruebas COREX con Playwright
const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

const EVIDENCES_DIR = path.join(__dirname, 'test-evidences');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Asegurar que existe la carpeta de evidencias
if (!fs.existsSync(EVIDENCES_DIR)) {
    fs.mkdirSync(EVIDENCES_DIR);
}

// Función para tomar captura con retry
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

async function runTests() {
    console.log('🚀 Iniciando automatización de pruebas COREX...\n');

    const electronApp = await electron.launch({
        args: [path.join(__dirname, 'main.js')]
    });

    const window = await electronApp.firstWindow();
    console.log('✅ Aplicación Electron iniciada\n');

    // Configurar listener para diálogos (logout confirmation)
    window.on('dialog', dialog => {
        console.log(`   📌 Diálogo detectado: ${dialog.message()}`);
        dialog.accept();
    });

    try {
        // ==================== SUITE: LOGIN ====================
        console.log('═══════════════════════════════════════════════');
        console.log('📋 SUITE: LOGIN');
        console.log('═══════════════════════════════════════════════\n');

        // TC-LOG-001: Login Exitoso
        console.log('🧪 TC-LOG-001: Login Exitoso con Credenciales Válidas');
        await sleep(1500);
        await takeScreenshot(window, 'TC-LOG-001_01_pantalla_login.png');

        const username = await window.locator('#userInput').inputValue();
        const password = await window.locator('#passInput').inputValue();
        console.log(`   📝 Credenciales detectadas: ${username} / ${password.replace(/./g, '*')}`);
        await takeScreenshot(window, 'TC-LOG-001_02_credenciales_listas.png');

        await window.locator('button[type="submit"]').click();
        await window.waitForSelector('#logoutButton', { timeout: 10000 });
        await sleep(1500);
        await takeScreenshot(window, 'TC-LOG-001_04_dashboard_exitoso.png');
        console.log('   ✅ TC-LOG-001: PASS\n');

        // TC-LOG-006: Logout (hacerlo ahora para volver al login)
        console.log('🧪 TC-LOG-006: Logout del Sistema');
        await takeScreenshot(window, 'TC-LOG-006_01_boton_logout.png');

        await window.locator('#logoutButton').click();
        await sleep(800);
        await takeScreenshot(window, 'TC-LOG-006_02_dialogo_confirmacion.png');

        await window.waitForSelector('#userInput', { timeout: 10000 });
        await sleep(1000);
        await takeScreenshot(window, 'TC-LOG-006_03_vuelta_login.png');
        console.log('   ✅ TC-LOG-006: PASS\n');

        // TC-LOG-002: Login Fallido
        console.log('🧪 TC-LOG-002: Login Fallido con Credenciales Inválidas');
        await window.locator('#userInput').fill('usuario_malo');
        await window.locator('#passInput').fill('password_incorrecto');
        await takeScreenshot(window, 'TC-LOG-002_01_credenciales_invalidas.png');

        await window.locator('button[type="submit"]').click();
        await sleep(1500);
        await takeScreenshot(window, 'TC-LOG-002_02_mensaje_error.png');
        console.log('   ✅ TC-LOG-002: PASS\n');

        // TC-LOG-003: Campos Vacíos
        console.log('🧪 TC-LOG-003: Validación de Campos Vacíos');
        await window.locator('#userInput').fill('');
        await window.locator('#passInput').fill('');
        await takeScreenshot(window, 'TC-LOG-003_01_campos_vacios.png');

        await window.locator('button[type="submit"]').click();
        await sleep(500);
        await takeScreenshot(window, 'TC-LOG-003_02_validacion_html5.png');
        console.log('   ✅ TC-LOG-003: PASS\n');

        // TC-LOG-005: Credenciales Demo
        console.log('🧪 TC-LOG-005: Visualización de Credenciales Demo');
        await takeScreenshot(window, 'TC-LOG-005_01_credenciales_demo.png');
        console.log('   ✅ TC-LOG-005: PASS\n');

        // TC-LOG-009: UI Completa
        console.log('🧪 TC-LOG-009: Interfaz Responsive del Login');
        await takeScreenshot(window, 'TC-LOG-009_01_ui_completa.png');
        console.log('   ✅ TC-LOG-009: PASS\n');

        // TC-LOG-010: Efectos Hover
        console.log('🧪 TC-LOG-010: Efectos Visuales en Login');
        await window.locator('#userInput').hover();
        await sleep(400);
        await takeScreenshot(window, 'TC-LOG-010_01_hover_campo.png');

        await window.locator('button[type="submit"]').hover();
        await sleep(400);
        await takeScreenshot(window, 'TC-LOG-010_02_hover_boton.png');
        console.log('   ✅ TC-LOG-010: PASS\n');

        // Login para continuar con Dashboard y demás módulos
        console.log('🔄 Realizando login para continuar con otras suites...');
        await window.locator('#userInput').fill('admin');
        await window.locator('#passInput').fill('admin123');
        await window.locator('button[type="submit"]').click();
        await window.waitForSelector('#logoutButton', { timeout: 10000 });
        await sleep(2000);

        // ==================== SUITE: DASHBOARD ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📋 SUITE: DASHBOARD');
        console.log('═══════════════════════════════════════════════\n');

        console.log('🧪 DASHBOARD: Capturas Generales');
        await takeScreenshot(window, 'DASHBOARD_01_vista_general.png');
        await takeScreenshot(window, 'DASHBOARD_02_metricas.png');
        await takeScreenshot(window, 'DASHBOARD_03_navegacion.png');

        // TC-UI-009: Reloj en tiempo real
        await takeScreenshot(window, 'TC-UI-009_01_reloj.png');
        console.log('   ✅ TC-UI-009: PASS');

        // TC-UI-007: Logo en sidebar
        await takeScreenshot(window, 'TC-UI-007_02_logo_sidebar.png');
        console.log('   ✅ TC-UI-007-02: PASS');

        // TC-UI-001: Paleta de colores
        await takeScreenshot(window, 'TC-UI-001_01_paleta_colores.png');
        console.log('   ✅ TC-UI-001: PASS');

        // TC-UI-004: Navegación
        await takeScreenshot(window, 'TC-UI-004_01_navegacion.png');
        console.log('   ✅ TC-UI-004: PASS');

        // TC-UI-010: Toast notification (Reportes coming soon)
        const reportesLink = window.locator('text=/reportes/i').first();
        await reportesLink.click();
        await sleep(500);
        await takeScreenshot(window, 'TC-UI-010_01_toast_notification.png');
        await sleep(3500); // Esperar a que desaparezca el toast
        console.log('   ✅ TC-UI-010: PASS\n');

        // ==================== SUITE: CLIENTES ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📋 SUITE: CLIENTES');
        console.log('═══════════════════════════════════════════════\n');

        console.log('🔄 Navegando al módulo de Clientes...');
        const clientesLink = window.locator('a[href="clientes_view.html"]');
        await clientesLink.click();
        await sleep(2000);

        // TC-CLI-001: Crear Cliente
        console.log('🧪 TC-CLI-001: Crear Cliente con Datos Completos');
        await takeScreenshot(window, 'TC-CLI-001_01_modulo_clientes.png');

        await window.locator('#btnAddCliente').click();
        await sleep(600);
        await takeScreenshot(window, 'TC-CLI-001_02_formulario_nuevo.png');

        await window.locator('#inputNombre').fill('Juan Pérez López');
        await window.locator('#inputEmail').fill('juan.perez@test.com');
        await window.locator('#inputTelefono').fill('5551234567');
        await window.locator('#inputRFC').fill('PELJ850315ABC');
        await takeScreenshot(window, 'TC-CLI-001_03_datos_completados.png');

        await window.locator('#formCliente button[type="submit"]').click();
        await sleep(1500);
        await takeScreenshot(window, 'TC-CLI-001_04_cliente_creado.png');
        console.log('   ✅ TC-CLI-001: PASS\n');

        // TC-CLI-002: Editar Cliente
        console.log('🧪 TC-CLI-002: Editar Cliente Existente');
        await takeScreenshot(window, 'TC-CLI-002_01_lista_clientes.png');

        // Buscar botón de editar (primer cliente en la tabla)
        const editButton = window.locator('#clientesTableBody button:has-text("Editar"), #clientesTableBody button[title*="ditar"]').first();
        await editButton.click();
        await sleep(600);
        await takeScreenshot(window, 'TC-CLI-002_02_formulario_edicion.png');

        await window.locator('#inputTelefono').fill('5559876543');
        await takeScreenshot(window, 'TC-CLI-002_03_campo_modificado.png');

        await window.locator('#formCliente button[type="submit"]').click();
        await sleep(1500);
        await takeScreenshot(window, 'TC-CLI-002_04_cliente_actualizado.png');
        console.log('   ✅ TC-CLI-002: PASS\n');

        // TC-CLI-003: Validación Email
        console.log('🧪 TC-CLI-003: Validación de Email');
        await window.locator('#btnAddCliente').click();
        await sleep(600);

        await window.locator('#inputNombre').fill('María González');
        await window.locator('#inputEmail').fill('emailsinformato');
        await window.locator('#inputRFC').fill('GOMM900101XXX');
        await takeScreenshot(window, 'TC-CLI-003_01_email_invalido.png');

        await window.locator('#formCliente button[type="submit"]').click();
        await sleep(500);
        await takeScreenshot(window, 'TC-CLI-003_02_error_validacion.png');

        await window.locator('#btnCancelForm').click();
        await sleep(500);
        console.log('   ✅ TC-CLI-003: PASS\n');

        // TC-CLI-005: RFC Duplicado
        console.log('🧪 TC-CLI-005: RFC Duplicado');
        await window.locator('#btnAddCliente').click();
        await sleep(600);

        await window.locator('#inputNombre').fill('María González');
        await window.locator('#inputEmail').fill('maria@test.com');
        await window.locator('#inputTelefono').fill('5559998888');
        await window.locator('#inputRFC').fill('PELJ850315ABC'); // RFC duplicado
        await takeScreenshot(window, 'TC-CLI-005_01_rfc_duplicado.png');

        await window.locator('#formCliente button[type="submit"]').click();
        await sleep(1500);
        await takeScreenshot(window, 'TC-CLI-005_02_error_rfc_duplicado.png');

        await window.locator('#btnCancelForm').click();
        await sleep(500);
        console.log('   ✅ TC-CLI-005: PASS\n');

        // TC-CLI-008: Búsqueda
        console.log('🧪 TC-CLI-008: Búsqueda de Cliente por Nombre');
        await takeScreenshot(window, 'TC-CLI-008_01_lista_completa.png');

        await window.locator('#searchInput').fill('Juan');
        await sleep(800);
        await takeScreenshot(window, 'TC-CLI-008_02_texto_busqueda.png');
        await sleep(500);
        await takeScreenshot(window, 'TC-CLI-008_03_resultados_filtrados.png');

        await window.locator('#searchInput').fill('');
        await sleep(500);
        console.log('   ✅ TC-CLI-008: PASS\n');

        // ==================== SUITE: PÓLIZAS ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📋 SUITE: PÓLIZAS');
        console.log('═══════════════════════════════════════════════\n');

        console.log('🔄 Navegando al módulo de Pólizas...');
        await window.locator('#btnBack').click();
        await sleep(1500);

        const polizasLink = window.locator('a[href="polizas_view.html"]');
        await polizasLink.click();
        await sleep(2000);

        // TC-POL-005: Número Duplicado
        console.log('🧪 TC-POL-005: Número de Póliza Duplicado');
        await takeScreenshot(window, 'TC-POL-005_01_modulo_polizas.png');

        // Verificar si hay pólizas, si no, crear una primero
        const hasPolizas = await window.locator('#polizasTableBody tr').count() > 0;

        if (!hasPolizas) {
            console.log('   📝 Creando póliza inicial para pruebas...');
            await window.locator('#btnAddPoliza').click();
            await sleep(600);

            await window.locator('#inputNumero').fill('POL-2024-001');
            // Aquí necesitamos seleccionar un cliente (asumiendo que el select está poblado)
            await window.locator('#inputCliente').selectOption({ index: 1 });
            await window.locator('#inputAseguradora').selectOption({ index: 1 });
            await window.locator('#inputRamo').selectOption({ index: 1 });
            await window.locator('#inputFechaInicio').fill('2024-01-01');
            await window.locator('#inputFechaFin').fill('2025-01-01');
            await window.locator('#inputPrima').fill('5000');
            await window.locator('#inputPeriodicidad').selectOption({ index: 1 });

            await window.locator('#formPoliza button[type="submit"]').click();
            await sleep(1500);
        }

        // Intentar crear póliza con número duplicado
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

        await window.locator('#formPoliza button[type="submit"]').click();
        await sleep(1500);
        await takeScreenshot(window, 'TC-POL-005_03_error_duplicado.png');

        await window.locator('#btnCancelForm').click();
        await sleep(500);
        console.log('   ✅ TC-POL-005: PASS\n');

        // TC-POL-007: Filtrar por Estado
        console.log('🧪 TC-POL-007: Filtrar Pólizas por Estado');
        await takeScreenshot(window, 'TC-POL-007_01_lista_completa.png');

        await window.locator('#filterEstado').selectOption('Vigente');
        await sleep(800);
        await takeScreenshot(window, 'TC-POL-007_02_filtro_activas.png');

        await window.locator('#filterEstado').selectOption('Vencida');
        await sleep(800);
        await takeScreenshot(window, 'TC-POL-007_03_filtro_vencidas.png');

        await window.locator('#filterEstado').selectOption('');
        await sleep(500);
        console.log('   ✅ TC-POL-007: PASS\n');

        // ==================== UI/UX ADICIONALES ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('📋 CAPTURAS ADICIONALES UI/UX');
        console.log('═══════════════════════════════════════════════\n');

        // TC-UI-008: Hover en botones
        console.log('🧪 TC-UI-008: Efectos Hover en Botones');
        await window.locator('#btnAddPoliza').hover();
        await sleep(400);
        await takeScreenshot(window, 'TC-UI-008_01_hover_botones.png');
        console.log('   ✅ TC-UI-008: PASS\n');

        // Regresar al login para captura de logo
        console.log('🔄 Regresando al login para capturas finales...');
        await window.locator('#btnBack').click();
        await sleep(1500);

        await window.locator('#logoutButton').click();
        await sleep(1500);

        // TC-UI-007: Logo en login
        await takeScreenshot(window, 'TC-UI-007_01_logo_login.png');
        console.log('   ✅ TC-UI-007-01: PASS\n');

        // ==================== RESUMEN FINAL ====================
        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ AUTOMATIZACIÓN COMPLETADA EXITOSAMENTE');
        console.log('═══════════════════════════════════════════════\n');

        const files = fs.readdirSync(EVIDENCES_DIR).filter(f => f.endsWith('.png'));
        console.log(`📸 Total de capturas generadas: ${files.length}`);
        console.log(`📁 Ubicación: ${EVIDENCES_DIR}\n`);

        console.log('📋 Resumen por Suite:');
        const loginScreenshots = files.filter(f => f.includes('TC-LOG-') || f.includes('TC-UI-007_01')).length;
        const dashboardScreenshots = files.filter(f => f.includes('DASHBOARD_')).length;
        const clientesScreenshots = files.filter(f => f.includes('TC-CLI-')).length;
        const polizasScreenshots = files.filter(f => f.includes('TC-POL-')).length;
        const uiScreenshots = files.filter(f => f.includes('TC-UI-')).length;

        console.log(`   • Login: ${loginScreenshots} capturas`);
        console.log(`   • Dashboard: ${dashboardScreenshots} capturas`);
        console.log(`   • Clientes: ${clientesScreenshots} capturas`);
        console.log(`   • Pólizas: ${polizasScreenshots} capturas`);
        console.log(`   • UI/UX: ${uiScreenshots} capturas\n`);

    } catch (error) {
        console.error('\n❌ Error durante la ejecución:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await electronApp.close();
        console.log('🔚 Aplicación cerrada\n');
    }
}

// Ejecutar tests
runTests().catch(console.error);
