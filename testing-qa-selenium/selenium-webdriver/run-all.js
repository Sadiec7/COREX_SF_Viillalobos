// run-all.js - Script principal para ejecutar todas las suites de pruebas

const { runAuthTestSuite } = require('./tests/auth.test');

/**
 * Ejecuta todas las suites de pruebas en orden
 */
async function runAllTests() {
  console.log('\n' + '🎯'.repeat(40));
  console.log('🚀 EJECUTANDO TODAS LAS SUITES DE PRUEBAS - SELENIUM WEBDRIVER');
  console.log('🎯'.repeat(40));
  console.log(`\n📅 Inicio: ${new Date().toLocaleString()}`);
  console.log('📦 Sistema: Sistema de Seguros VILLALOBOS');
  console.log('🔧 Framework: Selenium WebDriver + Electron\n');

  const suites = [
    {
      name: 'Autenticación',
      function: runAuthTestSuite,
      enabled: true
    },
    // TODO: Agregar más suites cuando estén implementadas
    // {
    //   name: 'Clientes',
    //   function: runClientesTestSuite,
    //   enabled: false
    // },
    // {
    //   name: 'Pólizas',
    //   function: runPolizasTestSuite,
    //   enabled: false
    // }
  ];

  const results = {
    totalSuites: 0,
    passedSuites: 0,
    failedSuites: 0,
    startTime: Date.now(),
    endTime: null,
    suiteResults: []
  };

  // Ejecutar cada suite habilitada
  for (const suite of suites) {
    if (!suite.enabled) {
      console.log(`\n⏭️  Suite "${suite.name}" deshabilitada - omitiendo\n`);
      continue;
    }

    results.totalSuites++;

    try {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`🧪 Ejecutando suite: ${suite.name}`);
      console.log('='.repeat(80) + '\n');

      await suite.function();

      results.passedSuites++;
      results.suiteResults.push({
        name: suite.name,
        status: 'PASSED'
      });

      console.log(`\n✅ Suite "${suite.name}" completada exitosamente\n`);

    } catch (error) {
      results.failedSuites++;
      results.suiteResults.push({
        name: suite.name,
        status: 'FAILED',
        error: error.message
      });

      console.error(`\n❌ Suite "${suite.name}" falló:`, error.message);
      console.error('Stack trace:', error.stack);

      // Continuar con la siguiente suite (no detener todo)
      console.log('\n⏩ Continuando con la siguiente suite...\n');
    }
  }

  // Registrar tiempo final
  results.endTime = Date.now();
  const totalTime = ((results.endTime - results.startTime) / 1000).toFixed(2);

  // Imprimir resumen final
  printFinalSummary(results, totalTime);

  // Guardar resumen en archivo
  saveFinalReport(results, totalTime);

  // Retornar código de salida
  return results.failedSuites === 0 ? 0 : 1;
}

/**
 * Imprime el resumen final de todas las suites
 */
function printFinalSummary(results, totalTime) {
  console.log('\n\n' + '🏁'.repeat(40));
  console.log('📊 RESUMEN FINAL DE TODAS LAS SUITES');
  console.log('🏁'.repeat(40));

  console.log(`\n⏱️  Tiempo total de ejecución: ${totalTime}s`);
  console.log(`📦 Total de suites ejecutadas: ${results.totalSuites}`);
  console.log(`✅ Suites exitosas: ${results.passedSuites}`);
  console.log(`❌ Suites fallidas: ${results.failedSuites}`);

  if (results.totalSuites > 0) {
    const successRate = ((results.passedSuites / results.totalSuites) * 100).toFixed(2);
    console.log(`📊 Tasa de éxito: ${successRate}%`);
  }

  console.log(`\n📋 Detalle por suite:`);
  results.suiteResults.forEach(suite => {
    const icon = suite.status === 'PASSED' ? '✅' : '❌';
    console.log(`   ${icon} ${suite.name}: ${suite.status}`);
    if (suite.error) {
      console.log(`      💬 Error: ${suite.error}`);
    }
  });

  console.log('\n' + '🏁'.repeat(40));

  if (results.failedSuites === 0) {
    console.log('🎉 ¡TODAS LAS SUITES PASARON EXITOSAMENTE!');
  } else {
    console.log(`⚠️  ${results.failedSuites} suite(s) fallaron`);
  }

  console.log('🏁'.repeat(40) + '\n');
  console.log(`📅 Finalizado: ${new Date().toLocaleString()}\n`);
}

/**
 * Guarda el reporte final en un archivo JSON
 */
function saveFinalReport(results, totalTime) {
  const fs = require('fs');
  const path = require('path');

  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const filename = `final-report-${timestamp}.json`;
  const filepath = path.join(reportsDir, filename);

  const report = {
    project: 'Sistema de Seguros VILLALOBOS',
    framework: 'Selenium WebDriver + Electron',
    timestamp: new Date().toISOString(),
    executionTime: `${totalTime}s`,
    summary: {
      totalSuites: results.totalSuites,
      passedSuites: results.passedSuites,
      failedSuites: results.failedSuites,
      successRate: results.totalSuites > 0
        ? ((results.passedSuites / results.totalSuites) * 100).toFixed(2) + '%'
        : '0%'
    },
    suites: results.suiteResults
  };

  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`💾 Reporte final guardado en: ${filepath}\n`);
}

// ========== EJECUTAR ==========

if (require.main === module) {
  runAllTests()
    .then((exitCode) => {
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal en la ejecución:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };
