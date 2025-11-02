/**
 * testing/ui_smoke.test.js
 *
 * Recorre los módulos principales de la aplicación con Playwright / Electron
 * verificando que no aparezcan errores en consola ni excepciones.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { _electron: electron } = require('playwright');

async function openModuleFromDashboard(page, linkText, selector) {
    await page.click(`a:has-text("${linkText}")`);
    await page.waitForSelector(selector, { state: 'attached', timeout: 15000 });
    await page.waitForTimeout(500);

    const backButton = await page.$('#btnBack');
    if (backButton) {
        await backButton.click();
        await page.waitForSelector('text=Panel de control', { timeout: 15000 });
        await page.waitForTimeout(300);
    }
}

async function run() {
    // Forzar regeneración de la base para asegurar el schema más reciente
    const dbPath = path.join(__dirname, '..', 'gestor_polizas_v2.sqlite');
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }

    const errors = [];
    const electronApp = await electron.launch({ args: ['.'] });

    try {
        const page = await electronApp.firstWindow();

        page.on('console', (msg) => {
            const text = msg.text();
            if (msg.type() === 'error') {
                errors.push(new Error(text));
            }
        });

        page.on('pageerror', (err) => {
            errors.push(err);
        });

        await page.waitForSelector('#loginForm', { timeout: 20000 });
        await page.fill('#userInput', 'admin');
        await page.fill('#passInput', 'admin123');
        await page.click('#loginButton');

        await page.waitForSelector('text=Dashboard', { timeout: 20000 });

        // Navegar por cada módulo principal
        await openModuleFromDashboard(page, 'Clientes', '#clientesTableBody');
        await openModuleFromDashboard(page, 'Pólizas', '#polizasTableBody');
        await openModuleFromDashboard(page, 'Recibos', '#recibosTableBody');
        await openModuleFromDashboard(page, 'Catálogos', '#aseguradorasTableBody');

        // Filtrar errores ignorando las advertencias de seguridad de Electron
        const relevantErrors = errors.filter(
            (err) => !/Electron Security Warning/i.test(err.message)
        );

        assert.strictEqual(
            relevantErrors.length,
            0,
            `Se detectaron errores en la navegación: ${relevantErrors.map((e) => e.message).join(' | ')}`
        );

        console.log('✅ Navegación básica por módulos completada sin errores en consola.');
    } finally {
        await electronApp.close();
    }
}

run().catch((err) => {
    console.error('❌ Falla en la prueba de navegación:', err);
    process.exit(1);
});
