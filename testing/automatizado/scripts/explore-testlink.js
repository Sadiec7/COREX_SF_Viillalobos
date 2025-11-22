// explore-testlink.js - Explorar estructura de TestLink
const { chromium } = require('playwright');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function exploreTestLink() {
    console.log('🔍 Explorando TestLink...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Login
        console.log('📝 Haciendo login...');
        await page.goto('http://localhost:8080');
        await sleep(1000);

        await page.fill('input[name="tl_login"]', 'devAngel');
        await page.fill('input[name="tl_password"]', 'Pass1234');
        await page.click('input[type="submit"]');
        await sleep(2000);
        console.log('✅ Login exitoso\n');

        // Screenshot para debug
        await page.screenshot({ path: 'testlink-home.png' });
        console.log('📸 Screenshot guardado: testlink-home.png\n');

        // Listar todos los links de navegación
        const navLinks = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => a.textContent.trim()).filter(t => t.length > 0 && t.length < 50);
        });
        console.log('🔗 Links disponibles:');
        navLinks.forEach(link => console.log(`   - ${link}`));
        console.log('');

        // Intentar encontrar estructura
        console.log('🔍 Extrayendo estructura del proyecto...\n');

        // Obtener el HTML del árbol de navegación
        const treeHTML = await page.evaluate(() => {
            // Buscar el div/frame que contiene el árbol de test cases
            const tree = document.querySelector('#tree, .tree, iframe[name="treeframe"]');
            if (tree) {
                return tree.innerHTML || 'Tree found but no innerHTML';
            }
            return 'No tree found';
        });

        console.log('HTML del árbol:', treeHTML.substring(0, 500), '...\n');

        // Listar todos los links visibles
        const links = await page.evaluate(() => {
            const allLinks = Array.from(document.querySelectorAll('a'));
            return allLinks.map(a => ({
                text: a.textContent.trim(),
                href: a.href,
                id: a.id,
                class: a.className
            })).filter(l => l.text.length > 0).slice(0, 30);
        });

        console.log('═══════════════════════════════════════════════');
        console.log('🔗 Links encontrados:');
        console.log('═══════════════════════════════════════════════');
        links.forEach(link => {
            console.log(`• ${link.text}`);
            if (link.text.includes('COREX') || link.text.includes('TC-')) {
                console.log(`  └─ ID: ${link.id}, Class: ${link.class}`);
            }
        });

        // Buscar frames
        console.log('\n═══════════════════════════════════════════════');
        console.log('🖼️  Frames encontrados:');
        console.log('═══════════════════════════════════════════════');
        const frames = page.frames();
        frames.forEach((frame, index) => {
            console.log(`Frame ${index}: ${frame.name()} - ${frame.url()}`);
        });

        console.log('\n⏸️  Navegador abierto para inspección manual.');
        console.log('   Navega al proyecto COREX y observa la estructura.');
        console.log('   Presiona Ctrl+C cuando termines.\n');

        // Mantener abierto
        await sleep(600000);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await browser.close();
    }
}

exploreTestLink().catch(console.error);
