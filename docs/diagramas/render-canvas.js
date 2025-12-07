const puppeteer = require('puppeteer');
const path = require('path');

async function renderCanvas(version) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1500, height: 900 });

    const htmlFile = version ? `canvas-v${version}.html` : 'canvas.html';
    const pngFile = version ? `canvas-v${version}.png` : 'canvas.png';

    const htmlPath = path.join(__dirname, htmlFile);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Esperar a que carguen los iconos de Font Awesome
    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.screenshot({
        path: path.join(__dirname, pngFile),
        fullPage: true
    });

    console.log(`Canvas renderizado: ${pngFile}`);
    await browser.close();
}

async function renderAll() {
    // Renderizar las 3 versiones
    await renderCanvas('1');
    await renderCanvas('2');
    await renderCanvas('3');
    console.log('\nTodas las versiones renderizadas!');
}

// Si se pasa argumento, renderiza esa version, sino todas
const version = process.argv[2];
if (version) {
    renderCanvas(version).catch(console.error);
} else {
    renderAll().catch(console.error);
}
