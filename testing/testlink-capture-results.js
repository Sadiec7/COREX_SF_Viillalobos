// testlink-capture-results.js
// Captura evidencias en TestLink después de reportar resultados por API.
const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = process.env.TESTLINK_BASE_URL || 'http://localhost/testlink';
const USER = process.env.TESTLINK_USER || 'devAngel';
const PASSWORD = process.env.TESTLINK_PASSWORD || 'Pass1234';
const EVIDENCES_DIR = path.join(__dirname, 'test-evidences');

const CASES = [
  { id: 'TC-LOG-001', nodeId: 228, versionId: 789, externalId: 'COREX-21' },
  { id: 'TC-LOG-002', nodeId: 229, versionId: 790, externalId: 'COREX-22' },
  { id: 'TC-LOG-003', nodeId: 230, versionId: 791, externalId: 'COREX-23' },
  { id: 'TC-LOG-005', nodeId: 232, versionId: 793, externalId: 'COREX-25' },
  { id: 'TC-LOG-006', nodeId: 233, versionId: 794, externalId: 'COREX-26' },
  { id: 'TC-LOG-009', nodeId: 236, versionId: 797, externalId: 'COREX-29' },
  { id: 'TC-LOG-010', nodeId: 237, versionId: 798, externalId: 'COREX-30' },
  { id: 'TC-CLI-001', nodeId: 208, versionId: 769, externalId: 'COREX-1' },
  { id: 'TC-CLI-002', nodeId: 209, versionId: 770, externalId: 'COREX-2' },
  { id: 'TC-CLI-003', nodeId: 210, versionId: 771, externalId: 'COREX-3' },
  { id: 'TC-CLI-005', nodeId: 212, versionId: 773, externalId: 'COREX-5' },
  { id: 'TC-POL-005', nodeId: 259, versionId: 820, externalId: 'COREX-52' },
  { id: 'TC-POL-007', nodeId: 261, versionId: 822, externalId: 'COREX-54' },
  { id: 'TC-UI-001', nodeId: 248, versionId: 809, externalId: 'COREX-41' },
  { id: 'TC-UI-004', nodeId: 251, versionId: 812, externalId: 'COREX-44' },
  { id: 'TC-UI-007', nodeId: 254, versionId: 815, externalId: 'COREX-47' },
  { id: 'TC-UI-008', nodeId: 255, versionId: 816, externalId: 'COREX-48' },
  { id: 'TC-UI-009', nodeId: 256, versionId: 817, externalId: 'COREX-49' },
  { id: 'TC-UI-010', nodeId: 257, versionId: 818, externalId: 'COREX-50' }
];

async function takeScreenshot(target, filename, options = {}) {
  await target.screenshot({
    path: path.join(EVIDENCES_DIR, filename),
    fullPage: true,
    ...options
  });
  console.log(`   📸 ${filename}`);
}

async function main() {
  console.log('🎥 Capturando evidencias gráficas en TestLink...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Paso 1: Login
  await page.goto(BASE_URL);
  await takeScreenshot(page, 'testlink_devAngel_step01_login.png');
  await page.fill('input[name="tl_login"]', USER);
  await page.fill('input[name="tl_password"]', PASSWORD);
  await takeScreenshot(page, 'testlink_devAngel_step02_credentials.png');
  await page.click('input[type="submit"]');
  await page.waitForTimeout(1500);
  await takeScreenshot(page, 'testlink_devAngel_step03_home.png');

  // Paso 2: Ir a la vista de ejecución
  const titlebar = page.frame({ name: 'titlebar' });
  await titlebar.click('a[href*="feature=executeTest"]');
  await page.waitForTimeout(2000);
  await takeScreenshot(page, 'testlink_devAngel_step04_execution_tab.png');

  // Paso 3: Aplicar filtros
  const treeframe = page.frame({ name: 'treeframe' });
  await treeframe.check('#filter_assigned_user_include_unassigned');
  await treeframe.click('#doUpdateTree');
  await page.waitForTimeout(1500);
  await takeScreenshot(page, 'testlink_devAngel_step05_filters.png');

  // Paso 4: Capturar cada caso
  for (const tc of CASES) {
    console.log(`   ▶ ${tc.id} (${tc.externalId})`);
    await treeframe.evaluate(
      ({ nodeId, versionId }) => {
        // ST -> función global definida por TestLink para seleccionar nodos en el árbol
        window.ST(nodeId, versionId);
      },
      { nodeId: tc.nodeId, versionId: tc.versionId }
    );
    await page.waitForTimeout(1500);
    const workframe = page.frame({ name: 'workframe' });
    await workframe.waitForSelector('#main_content', { timeout: 5000 });
    const bodyHandle = workframe.locator('body');
    const filename = `testlink_result_${tc.externalId}.png`;
    await takeScreenshot(bodyHandle, filename, { fullPage: false });
  }

  await browser.close();
  console.log('✅ Capturas completadas');
}

main().catch((err) => {
  console.error('❌ Error capturando evidencias:', err);
  process.exit(1);
});
