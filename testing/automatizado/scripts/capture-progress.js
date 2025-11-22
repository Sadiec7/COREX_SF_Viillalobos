// testing/automatizado/scripts/capture-progress.js
// Script para capturar el estado actual del proyecto para documentación

const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuración
const SCREENSHOTS_DIR = path.join(__dirname, '..', '..', '..', 'Documentacion', 'imagenes_progreso');
const CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Crear directorio de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log(`📁 Directorio creado: ${SCREENSHOTS_DIR}`);
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureProgress() {
    console.log('🎬 Iniciando captura de progreso del proyecto...\n');

    let electronApp;
    let window;

    try {
        // 1. Lanzar aplicación
        console.log('🚀 Lanzando aplicación Electron...');
        electronApp = await electron.launch({
            args: ['.'],
            timeout: 30000
        });

        window = await electronApp.firstWindow({ timeout: 30000 });
        console.log('✅ Aplicación iniciada\n');

        await delay(2000);

        // 2. LOGIN
        console.log('🔐 Realizando login...');

        await window.fill('input[type="text"]', CREDENTIALS.username);
        await delay(300);

        await window.fill('input[type="password"]', CREDENTIALS.password);
        await delay(300);

        // Capturar pantalla de login
        await window.screenshot({
            path: path.join(SCREENSHOTS_DIR, '01_login.png'),
            fullPage: true
        });
        console.log('📸 Captura: 01_login.png');

        await window.click('button[type="submit"]');
        await delay(3000);

        // 3. DASHBOARD
        console.log('\n📊 Capturando Dashboard...');
        await delay(2000);

        await window.screenshot({
            path: path.join(SCREENSHOTS_DIR, '02_dashboard.png'),
            fullPage: true
        });
        console.log('📸 Captura: 02_dashboard.png');

        // 4. CLIENTES
        console.log('\n👥 Capturando módulo de Clientes...');
        await window.click('[data-view="clientes"]');
        await delay(2000);

        await window.screenshot({
            path: path.join(SCREENSHOTS_DIR, '03_clientes_lista.png'),
            fullPage: true
        });
        console.log('📸 Captura: 03_clientes_lista.png');

        // Capturar formulario de nuevo cliente
        try {
            await window.click('button:has-text("Nuevo Cliente")');
            await delay(1500);

            await window.screenshot({
                path: path.join(SCREENSHOTS_DIR, '04_clientes_nuevo.png'),
                fullPage: true
            });
            console.log('📸 Captura: 04_clientes_nuevo.png');

            // Cerrar modal
            await window.click('button:has-text("Cancelar")');
            await delay(500);
        } catch (error) {
            console.log('⚠️  No se pudo capturar formulario de cliente');
        }

        // 5. PÓLIZAS
        console.log('\n📋 Capturando módulo de Pólizas...');
        await window.click('[data-view="polizas"]');
        await delay(2000);

        await window.screenshot({
            path: path.join(SCREENSHOTS_DIR, '05_polizas_lista.png'),
            fullPage: true
        });
        console.log('📸 Captura: 05_polizas_lista.png');

        // Capturar formulario de nueva póliza
        try {
            await window.click('button:has-text("Nueva Póliza")');
            await delay(1500);

            await window.screenshot({
                path: path.join(SCREENSHOTS_DIR, '06_polizas_nueva.png'),
                fullPage: true
            });
            console.log('📸 Captura: 06_polizas_nueva.png');

            // Cerrar modal
            await window.click('button:has-text("Cancelar")');
            await delay(500);
        } catch (error) {
            console.log('⚠️  No se pudo capturar formulario de póliza');
        }

        // 6. RECIBOS
        console.log('\n💰 Capturando módulo de Recibos...');
        await window.click('[data-view="recibos"]');
        await delay(2000);

        await window.screenshot({
            path: path.join(SCREENSHOTS_DIR, '07_recibos_lista.png'),
            fullPage: true
        });
        console.log('📸 Captura: 07_recibos_lista.png');

        // 7. DOCUMENTOS
        console.log('\n📄 Capturando módulo de Documentos...');
        await window.click('[data-view="documentos"]');
        await delay(2000);

        await window.screenshot({
            path: path.join(SCREENSHOTS_DIR, '08_documentos.png'),
            fullPage: true
        });
        console.log('📸 Captura: 08_documentos.png');

        // 8. CATÁLOGOS
        console.log('\n🗂️  Capturando módulo de Catálogos...');
        await window.click('[data-view="catalogos"]');
        await delay(2000);

        await window.screenshot({
            path: path.join(SCREENSHOTS_DIR, '09_catalogos.png'),
            fullPage: true
        });
        console.log('📸 Captura: 09_catalogos.png');

        // 9. Regresar al Dashboard para captura final
        console.log('\n🏠 Regresando al Dashboard...');
        await window.click('[data-view="dashboard"]');
        await delay(2000);

        await window.screenshot({
            path: path.join(SCREENSHOTS_DIR, '10_dashboard_final.png'),
            fullPage: true
        });
        console.log('📸 Captura: 10_dashboard_final.png');

        console.log('\n✅ Capturas completadas exitosamente');
        console.log(`📁 Ubicación: ${SCREENSHOTS_DIR}`);
        console.log('📊 Total de capturas: 10');

    } catch (error) {
        console.error('\n❌ Error durante la captura:', error.message);
        console.error(error.stack);

        // Intentar capturar screenshot de error
        if (window) {
            try {
                await window.screenshot({
                    path: path.join(SCREENSHOTS_DIR, 'ERROR.png'),
                    fullPage: true
                });
                console.log('📸 Screenshot de error guardado');
            } catch (e) {
                console.error('No se pudo capturar screenshot de error');
            }
        }
    } finally {
        // Cerrar aplicación
        if (electronApp) {
            console.log('\n🔒 Cerrando aplicación...');
            await electronApp.close();
        }
    }
}

// Ejecutar
captureProgress()
    .then(() => {
        console.log('\n🎉 Proceso completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Error fatal:', error);
        process.exit(1);
    });
