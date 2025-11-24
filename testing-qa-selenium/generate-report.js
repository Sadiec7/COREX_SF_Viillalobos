#!/usr/bin/env node
// generate-report.js - Generador de Reportes de Testing en Typst

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directorios
const REPORTS_DIR = path.join(__dirname, 'reports');
const DOCS_DIR = path.join(__dirname, 'docs');

// Función para leer el JSON más reciente de cada módulo
function getLatestTestResults() {
  const modules = ['clientes', 'polizas', 'catalogos', 'recibos', 'documentos', 'config'];
  const results = [];

  modules.forEach(module => {
    const files = fs.readdirSync(REPORTS_DIR)
      .filter(f => f.startsWith(`${module}-test-results`) && f.endsWith('.json'))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(REPORTS_DIR, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 0) {
      const content = JSON.parse(
        fs.readFileSync(path.join(REPORTS_DIR, files[0].name), 'utf-8')
      );
      results.push(content);
    }
  });

  return results;
}

// Función para calcular totales
function calculateTotals(results) {
  return results.reduce((acc, r) => ({
    total: acc.total + r.total,
    passed: acc.passed + r.passed,
    failed: acc.failed + r.failed
  }), { total: 0, passed: 0, failed: 0 });
}

// Función para generar tabla de módulos en Typst
function generateModulesTable(results) {
  let table = `#table(
  columns: (2fr, 1fr, 1fr, 1fr, 1fr),
  align: (left, center, center, center, center),
  table.header(
    [*Módulo*], [*Total*], [*Pasando*], [*Fallando*], [*Estado*]
  ),\n`;

  results.forEach(r => {
    const percentage = ((r.passed / r.total) * 100).toFixed(0);
    const status = r.failed === 0 ? '✅' : percentage >= 90 ? '⚠️' : '❌';

    table += `  [${r.suite}], [${r.total}], [${r.passed}], [${r.failed}], [${status}],\n`;
  });

  table += ')';
  return table;
}

// Función para generar sección de tests fallando
function generateFailedTests(results) {
  const failedResults = results.filter(r => r.failed > 0);

  if (failedResults.length === 0) {
    return `== Tests Fallando

No hay tests fallando. ✅ Todos los tests están pasando correctamente.
`;
  }

  let section = `== Tests Fallando

Los siguientes tests requieren atención:

`;

  failedResults.forEach(module => {
    const failedTests = module.results.filter(t => !t.passed);

    section += `=== ${module.suite} (${failedTests.length} ${failedTests.length === 1 ? 'fallo' : 'fallos'})

`;

    failedTests.forEach(test => {
      section += `*${test.testId}*: ${test.description}

_Error_: ${test.message}

`;
    });
  });

  return section;
}

// Función principal para generar el documento Typst
function generateTypstReport() {
  console.log('📊 Generando reporte de testing...\n');

  // Leer resultados
  const results = getLatestTestResults();
  const totals = calculateTotals(results);
  const percentage = ((totals.passed / totals.total) * 100).toFixed(1);

  // Fecha actual
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  // Generar contenido Typst
  let typstContent = `// Reporte de Testing Automatizado
// Generado automáticamente: ${dateStr} ${timeStr}

#set document(
  title: "Reporte de Testing - Sistema de Seguros VILLALOBOS",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
)

#set text(
  font: "Arial",
  size: 12pt,
  lang: "es",
)

#set heading(numbering: "1.")

// ========== PORTADA ==========

#align(center)[
  #v(3cm)

  #text(size: 24pt, weight: "bold")[
    Reporte de Testing Automatizado
  ]

  #v(1cm)

  #text(size: 18pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(2cm)

  #text(size: 14pt)[
    Framework: Selenium WebDriver + Electron
  ]

  #v(1cm)

  #text(size: 12pt)[
    Generado: ${dateStr} ${timeStr}
  ]

  #v(4cm)

  #text(size: 11pt, style: "italic")[
    Documento generado automáticamente
  ]
]

#pagebreak()

// ========== TABLA DE CONTENIDO ==========

#outline(
  title: "Índice",
  indent: auto,
)

#pagebreak()

// ========== RESUMEN EJECUTIVO ==========

= Resumen Ejecutivo

Este documento presenta los resultados de la ejecución de la suite completa de testing automatizado para el Sistema de Seguros VILLALOBOS.

== Métricas Globales

#table(
  columns: (3fr, 1fr),
  align: (left, right),
  table.header(
    [*Métrica*], [*Valor*]
  ),
  [Total de Tests Implementados], [${totals.total}],
  [Tests Pasando], [${totals.passed} (${percentage}%)],
  [Tests Fallando], [${totals.failed} (${(100 - percentage).toFixed(1)}%)],
  [Última Ejecución], [${dateStr} ${timeStr}],
)

== Estado del Proyecto

`;

  if (totals.failed === 0) {
    typstContent += `✅ *EXCELENTE* - Todos los tests están pasando correctamente.

`;
  } else if (percentage >= 95) {
    typstContent += `⚠️ *BUENO* - La mayoría de los tests están pasando. Fallos: ${totals.failed} (no críticos).

`;
  } else {
    typstContent += `❌ *REQUIERE ATENCIÓN* - ${totals.failed} tests fallando requieren revisión inmediata.

`;
  }

  typstContent += `
#pagebreak()

// ========== RESULTADOS POR MÓDULO ==========

= Resultados por Módulo

${generateModulesTable(results)}

#pagebreak()

${generateFailedTests(results)}

#pagebreak()

// ========== DETALLES DE EJECUCIÓN ==========

= Detalles de Ejecución

== Tests Ejecutados por Módulo

`;

  results.forEach(module => {
    typstContent += `=== ${module.suite}

*Total*: ${module.total} tests \
*Pasando*: ${module.passed} \
*Fallando*: ${module.failed} \
*Fecha de ejecución*: ${new Date(module.timestamp).toLocaleString('es-MX')}

`;
  });

  typstContent += `
#pagebreak()

// ========== CONCLUSIONES ==========

= Conclusiones

== Cobertura de Testing

El sistema cuenta con ${totals.total} tests automatizados que cubren los siguientes módulos:

`;

  results.forEach(module => {
    typstContent += `- *${module.suite}*: ${module.total} tests\n`;
  });

  typstContent += `
== Calidad del Sistema

`;

  if (percentage >= 95) {
    typstContent += `El sistema demuestra una excelente calidad con ${percentage}% de tests pasando. `;
  } else if (percentage >= 85) {
    typstContent += `El sistema demuestra buena calidad con ${percentage}% de tests pasando. `;
  } else {
    typstContent += `El sistema requiere atención con ${percentage}% de tests pasando. `;
  }

  if (totals.failed > 0) {
    typstContent += `Los ${totals.failed} tests fallando deben ser revisados y corregidos.`;
  } else {
    typstContent += `Todos los tests están pasando correctamente.`;
  }

  typstContent += `

== Recomendaciones

1. Ejecutar la suite de tests antes de cada release
2. Revisar y corregir tests fallando prioritariamente
3. Mantener la cobertura de tests actualizada
4. Integrar tests en el pipeline de CI/CD

---

_Reporte generado automáticamente el ${dateStr} a las ${timeStr}_
`;

  return typstContent;
}

// Función principal
function main() {
  try {
    // Generar contenido Typst
    const typstContent = generateTypstReport();

    // Guardar archivo .typ
    const dateStr = new Date().toISOString().split('T')[0];
    const typFile = path.join(REPORTS_DIR, `test-report-${dateStr}.typ`);
    const pdfFile = path.join(REPORTS_DIR, `test-report-${dateStr}.pdf`);

    fs.writeFileSync(typFile, typstContent);
    console.log(`✅ Archivo Typst generado: ${typFile}\n`);

    // Compilar a PDF con Typst
    console.log('📄 Compilando a PDF con Typst...\n');

    try {
      execSync(`typst compile "${typFile}" "${pdfFile}"`, { stdio: 'inherit' });
      console.log(`\n✅ PDF generado exitosamente: ${pdfFile}`);
      console.log(`\n🎉 Reporte completo!`);

      // Abrir PDF automáticamente (macOS)
      if (process.platform === 'darwin') {
        execSync(`open "${pdfFile}"`);
      }
    } catch (error) {
      console.error('❌ Error al compilar con Typst. Asegúrate de tener Typst instalado:');
      console.error('   brew install typst');
      console.error('\n📄 Archivo .typ generado. Puedes compilarlo manualmente con:');
      console.error(`   typst compile "${typFile}"`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
main();
