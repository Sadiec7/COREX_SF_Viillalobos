// testlink-assign.js
// Asigna todos los casos de prueba del plan activo al usuario indicado (por defecto devAngel).
const xmlrpc = require('xmlrpc');

const TESTLINK_URL = process.env.TESTLINK_URL || 'http://localhost/testlink/lib/api/xmlrpc/v1/xmlrpc.php';
const TESTLINK_DEVKEY = process.env.TESTLINK_DEVKEY || 'DEVANGEL-API-KEY-20251013';
const TEST_PLAN_ID = parseInt(process.env.TESTLINK_PLAN_ID || '768', 10);
const BUILD_ID = parseInt(process.env.TESTLINK_BUILD_ID || '1', 10);
const TARGET_LOGIN = process.env.TESTLINK_TARGET_USER || 'devAngel';
const OVERWRITE = process.env.TESTLINK_ASSIGN_OVERWRITE !== 'false';
const REQUEST_TIMEOUT = parseInt(process.env.TESTLINK_TIMEOUT || '10000', 10);

const client = xmlrpc.createClient({ url: TESTLINK_URL, timeout: REQUEST_TIMEOUT });

function call(method, params) {
  return new Promise((resolve, reject) => {
    client.methodCall(method, [params], (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
}

async function fetchTester(login) {
  const response = await call('tl.getUserByLogin', {
    devKey: TESTLINK_DEVKEY,
    user: login
  });
  const tester = Array.isArray(response) ? response[0] : response;
  if (!tester || !tester.id) {
    throw new Error(`No se encontró el usuario ${login} (respuesta: ${JSON.stringify(response)})`);
  }
  tester.id = parseInt(tester.id, 10);
  return tester;
}

async function fetchTestCases() {
  const response = await call('tl.getTestCasesForTestPlan', {
    devKey: TESTLINK_DEVKEY,
    testplanid: TEST_PLAN_ID,
    buildid: BUILD_ID,
    details: 'minimal'
  });

  if (!response) {
    throw new Error('TestLink devolvió una respuesta vacía al solicitar los test cases.');
  }

  const cases = [];
  const payload = Array.isArray(response) ? response : Object.values(response);
  payload.forEach((group) => {
    if (!group) {
      return;
    }
    const entries = Array.isArray(group) ? group : [group];
    entries.forEach((tc) => {
      if (!tc) {
        return;
      }
      cases.push({
        id: tc.id || tc.testcase_id,
        name: tc.name || tc.tc_name,
        externalId: tc.full_external_id || tc.tc_full_external_id || tc.testcaseexternalid,
        versionId: tc.version_id || tc.version || tc.tcversion_id
      });
    });
  });

  const deduped = [];
  const seen = new Set();
  for (const tc of cases) {
    const key = `${tc.externalId || tc.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(tc);
    }
  }

  if (!deduped.length) {
    throw new Error('No se encontraron casos de prueba en el plan especificado.');
  }

  return deduped;
}

async function assignCase(tc, tester) {
  if (!tc.externalId) {
    throw new Error(`El caso ${tc.name || tc.id} no posee externalId (respuesta incompleta).`);
  }

  const payload = {
    devKey: TESTLINK_DEVKEY,
    testplanid: TEST_PLAN_ID,
    buildid: BUILD_ID,
    testcaseexternalid: tc.externalId,
    userid: tester.id,
    user: TARGET_LOGIN,
    overwrite: OVERWRITE ? 1 : 0
  };

  const result = await call('tl.assignTestCaseExecutionTask', payload);
  return Array.isArray(result) ? result[0] : result;
}

async function main() {
  console.log('🧭 Iniciando asignación de casos en TestLink');
  console.log(`   • Servidor: ${TESTLINK_URL}`);
  console.log(`   • Test Plan ID: ${TEST_PLAN_ID}`);
  console.log(`   • Build ID: ${BUILD_ID}`);
  console.log(`   • Usuario destino: ${TARGET_LOGIN}`);

  const tester = await fetchTester(TARGET_LOGIN);
  console.log(`   ✓ Usuario encontrado (id=${tester.id})`);

  const cases = await fetchTestCases();
  console.log(`   ✓ Casos recuperados: ${cases.length}`);

  let success = 0;
  const failures = [];

  for (const tc of cases) {
    const label = `${tc.externalId} (${tc.name || tc.id})`;
    process.stdout.write(`   → Asignando ${label} ... `);
    try {
      await assignCase(tc, tester);
      success += 1;
      process.stdout.write('OK\n');
    } catch (error) {
      process.stdout.write('ERROR\n');
      failures.push({ test: label, message: error.message });
    }
  }

  console.log(`\n✅ Asignaciones exitosas: ${success}`);
  if (failures.length) {
    console.log('⚠️  Casos con error:');
    failures.forEach((f) => {
      console.log(`   • ${f.test}: ${f.message}`);
    });
    process.exitCode = 1;
  } else {
    console.log('🎉 Todos los casos fueron asignados al usuario indicado.');
  }
}

main().catch((err) => {
  console.error('❌ Error crítico durante la asignación:', err && err.message ? err.message : err);
  if (err && err.code) {
    console.error(`   Código: ${err.code}`);
  }
  if (err && err.stack) {
    console.error(err.stack);
  }
  process.exit(1);
});
