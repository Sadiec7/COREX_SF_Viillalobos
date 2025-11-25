#!/usr/bin/env node
// generate-module-reports.js - Generador de reportes detallados por módulo

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseTypstFile } = require('../parsers/parse-test-docs');

const REPORTS_DIR = path.join(__dirname, '../../reports');
const TEST_RESULTS_DIR = path.join(REPORTS_DIR, 'test-results');
const SCREENSHOTS_DIR = path.join(REPORTS_DIR, 'screenshots');
const DOCS_DIR = path.join(__dirname, '../../docs');

// Escapar caracteres especiales para Typst
function escapeTypst(text) {
  if (!text) return '';

  // Convertir a string y escapar caracteres problemáticos
  let escaped = String(text);

  // Remover etiquetas HTML y fragmentos de HTML
  // Primero las completas, luego las incompletas
  escaped = escaped.replace(/<[^>]+>/g, '');      // Tags completos <div>...</div>
  escaped = escaped.replace(/<[^>]*$/g, '');      // Tags incompletos al final <button...
  escaped = escaped.replace(/^[^<]*>/g, '');      // Tags incompletos al inicio ...>
  escaped = escaped.replace(/&[a-z]+;/gi, ' ');   // HTML entities &nbsp; &gt; etc

  // Ahora escapar caracteres especiales de Typst
  escaped = escaped
    .replace(/\\/g, '\\\\')  // Escapar backslashes
    .replace(/\$/g, '\\$')   // Escapar $ (math mode)
    .replace(/#/g, '\\#')    // Escapar hash
    .replace(/\*/g, '\\*')   // Escapar asteriscos
    .replace(/_/g, '\\_')    // Escapar underscores
    .replace(/\[/g, '\\[')   // Escapar corchetes abiertos
    .replace(/\]/g, '\\]')   // Escapar corchetes cerrados
    .replace(/@/g, '\\@')    // Escapar @ para evitar referencias
    .replace(/</g, '\\<')    // Escapar < sobrantes
    .replace(/>/g, '\\>');   // Escapar > sobrantes

  return escaped;
}

// Configuración de módulos
const MODULE_CONFIG = {
  'polizas': {
    title: 'Pólizas',
    jsonPattern: 'polizas-test-results',
    docsPath: path.join(DOCS_DIR, '04-plan-polizas.typ'),
    description: 'Gestión completa de pólizas de seguros, incluyendo creación, modificación, búsqueda y validaciones de datos.',
    author: 'Angel Salinas'
  },
  'clientes': {
    title: 'Clientes',
    jsonPattern: 'clientes-test-results',
    docsPath: path.join(DOCS_DIR, '03-plan-clientes.typ'),
    description: 'Administración de clientes y contactos del sistema de seguros.',
    author: 'Michell Sanchez'
  },
  'catalogos': {
    title: 'Catálogos',
    jsonPattern: 'catalogos-test-results',
    docsPath: path.join(DOCS_DIR, '06-plan-catalogos.typ'),
    description: 'Gestión de catálogos: Aseguradoras, Ramos, Métodos de Pago y Periodicidades.',
    author: 'Angel Flores'
  },
  'recibos': {
    title: 'Recibos',
    jsonPattern: 'recibos-test-results',
    docsPath: path.join(DOCS_DIR, '05-plan-recibos.typ'),
    description: 'Control de recibos de pago, cobros y seguimiento de vencimientos.',
    author: 'Salvador Camacho'
  },
  'documentos': {
    title: 'Documentos',
    jsonPattern: 'documentos-test-results',
    docsPath: path.join(DOCS_DIR, '06-plan-documentos-FINAL.typ'),
    description: 'Sistema de gestión documental para archivos relacionados con pólizas.',
    author: 'Sebastian Rivera'
  },
  'config': {
    title: 'Configuración',
    jsonPattern: 'config-test-results',
    docsPath: path.join(DOCS_DIR, '07-plan-config-FINAL.typ'),
    description: 'Configuración de cuenta de usuario y ajustes de seguridad.',
    author: 'Angel Salinas'
  }
};

// Obtener último archivo JSON de resultados
function getLatestJSON(moduleName) {
  const config = MODULE_CONFIG[moduleName];
  const files = fs.readdirSync(TEST_RESULTS_DIR)
    .filter(f => f.startsWith(config.jsonPattern) && f.endsWith('.json'))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(TEST_RESULTS_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    throw new Error(`No se encontraron resultados JSON para ${moduleName}`);
  }

  const jsonPath = path.join(TEST_RESULTS_DIR, files[0].name);
  return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
}

// Buscar screenshot para un test (prioriza el más representativo del resultado)
function findScreenshot(testId) {
  const screenshots = fs.readdirSync(SCREENSHOTS_DIR)
    .filter(f => f.startsWith(testId) && f.endsWith('.png'));

  if (screenshots.length === 0) return null;
  if (screenshots.length === 1) return screenshots[0];

  // Orden de prioridad para seleccionar el screenshot más representativo
  const priorities = [
    'CREATED', 'EDITED', 'DELETED', 'UPDATED',  // Acciones completadas
    'VALIDATION', 'ERROR', 'INVALID',           // Validaciones
    'SEARCH', 'FILTER', 'STATS',                // Búsquedas y estadísticas
    'CANCELLED', 'CLEARED',                     // Cancelaciones
    'AFTER-SUBMIT', 'AFTER-CLOSE',              // Estados finales
    'DUPLICATE', 'NO-RESULTS',                  // Estados específicos
    'ACTIVATED', 'DEACTIVATED',                 // Cambios de estado
    'FORM-FILLED',                              // Formularios completos
    'MODAL-OPENED'                              // Modales abiertos
  ];

  // Buscar por prioridad
  for (const suffix of priorities) {
    const match = screenshots.find(s => s.includes(`-${suffix}.png`));
    if (match) return match;
  }

  // Si no hay coincidencia específica, excluir FAILED y retornar el primero disponible
  const nonFailed = screenshots.filter(s => !s.includes('-FAILED.png'));
  return nonFailed.length > 0 ? nonFailed[0] : screenshots[0];
}

// Formatear lista con bullets
function formatList(items) {
  if (!items || items.length === 0) return 'No especificado';
  return items.map(item => `- ${escapeTypst(item)}`).join('\n      ');
}

// Formatear pasos como tabla (estilo TestLink)
function formatStepsTable(steps, expectedResults) {
  if (!steps || steps.length === 0) return 'No especificado';

  // Si tenemos resultados esperados como array, usarlos; si no, usar el primero para todos
  const results = Array.isArray(expectedResults) && expectedResults.length > 0
    ? expectedResults
    : [expectedResults || 'Verificar resultado correcto'];

  let table = `#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\\#*], [*Acciones*], [*Salida Esperada*]
    ),\n`;

  steps.forEach((step, idx) => {
    const expectedResult = results[idx] || results[0] || 'Verificar paso completado';
    // Wrap content in #[] to force it as content, not code (fixes "Tabla" being interpreted as variable)
    table += `    [${idx + 1}], [#[${escapeTypst(step)}]], [#[${escapeTypst(expectedResult)}]],\n`;
  });

  table += `  ),
  caption: [Pasos de ejecución detallados]
)\n`;

  return table;
}

// Formatear código o datos de prueba
function formatTestData(data) {
  if (!data || data.trim() === '') return 'No especificado';

  // Escapar el contenido
  const escaped = escapeTypst(data);

  // Si tiene saltos de línea, usar bloque de código
  if (escaped.includes('\n')) {
    return `\`\`\`\n      ${escaped.split('\n').join('\n      ')}\n      \`\`\``;
  }

  return escaped;
}

// Generar tabla TestLink para un test case
function generateTestLinkTable(test, details, screenshot, moduleAuthor) {
  const actualResult = test.passed
    ? 'PASS: Todos los criterios esperados se cumplieron correctamente.'
    : `FAIL: ${escapeTypst(test.message || 'Error no especificado')}`;

  const estado = test.passed ? '[PASS ✓]' : '[FAIL ✗]';
  const estadoColor = test.passed ? 'rgb("#d4edda")' : 'rgb("#f8d7da")';
  const author = moduleAuthor || 'No especificado';

  return `
==== ${escapeTypst(test.testId)}: ${escapeTypst(details?.title || test.description)}

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [${escapeTypst(test.testId)}],
    [*Descripción*], [${escapeTypst(details?.description || test.description)}],
    [*Autor*], [${author}],
    [*Estado*], [#box(fill: ${estadoColor}, inset: 5pt, radius: 3pt)[${estado}]],
    [*Fecha de Ejecución*], [${new Date(test.timestamp).toLocaleString('es-MX')}],

    [*Precondiciones*], [
      ${formatList(details?.preconditions)}
    ],

    [*Datos de Prueba*], [
      ${formatTestData(details?.testData)}
    ],
  ),
  caption: [Información general - ${test.testId}]
)

${formatStepsTable(details?.steps, details?.expectedResult)}

${screenshot ? `
#figure(
  image("screenshots/${screenshot}", width: 85%),
  caption: [Evidencia visual - ${test.testId}]
)
` : ''}

*Resultado Obtenido*:

#box(
  fill: ${estadoColor},
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  ${actualResult}
]

---
`;
}

// Generar reporte completo de un módulo
function generateModuleReport(moduleName) {
  console.log(`\nGenerando reporte para módulo: ${moduleName}...`);

  const config = MODULE_CONFIG[moduleName];
  if (!config) {
    throw new Error(`Módulo desconocido: ${moduleName}`);
  }

  // Cargar datos
  console.log('  Cargando resultados JSON...');
  const jsonResults = getLatestJSON(moduleName);

  console.log('  Cargando documentación...');
  const testDocs = parseTypstFile(config.docsPath);

  const dateStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  const percentage = ((jsonResults.passed / jsonResults.total) * 100).toFixed(1);
  const status = jsonResults.failed === 0 ? 'PERFECTO - Todos los tests pasando'
    : percentage >= 90 ? 'BUENO - Mayoría de tests pasando'
    : 'REQUIERE ATENCIÓN';

  // Generar contenido Typst
  let content = `// Reporte de Testing - Módulo ${config.title}
// Generado automáticamente: ${dateStr} ${timeStr}

#set document(
  title: "Reporte de Testing - Módulo ${config.title}",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte de Testing - Módulo ${config.title}_
  ],
)

#set text(
  font: "Arial",
  size: 12pt,
  lang: "es",
)

#set heading(numbering: "1.")
#set par(justify: true)

// ========== PORTADA ==========

#align(center)[
  #v(2cm)

  #text(size: 26pt, weight: "bold")[
    Reporte de Testing Automatizado
  ]

  #v(0.5cm)

  #text(size: 22pt, weight: "bold")[
    Módulo de ${config.title}
  ]

  #v(2cm)

  #text(size: 16pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(1.5cm)

  #rect(
    fill: ${jsonResults.failed === 0 ? 'rgb("#d4edda")' : percentage >= 90 ? 'rgb("#fff3cd")' : 'rgb("#f8d7da")'},
    width: 75%,
    radius: 10pt,
    inset: 20pt,
    stroke: 1pt,
  )[
    #text(size: 16pt, weight: "bold")[
      ${jsonResults.total} Test Cases
    ]

    #v(0.5cm)

    #grid(
      columns: (1fr, 1fr),
      gutter: 15pt,
      [
        #text(size: 13pt)[
          *Pasando*: ${jsonResults.passed}
        ]
      ],
      [
        #text(size: 13pt)[
          *Fallando*: ${jsonResults.failed}
        ]
      ],
    )

    #v(0.3cm)

    #text(size: 12pt)[
      *Cobertura*: ${percentage}%
    ]

    #v(0.3cm)

    #text(size: 11pt, weight: "bold")[
      Estado: ${status}
    ]
  ]

  #v(2cm)

  #table(
    columns: (2fr, 3fr),
    align: left,
    stroke: none,
    [*Framework*:], [Selenium WebDriver 4.27.0],
    [*Patrón*:], [Page Object Pattern],
    [*Última Ejecución*:], [${new Date(jsonResults.timestamp).toLocaleString('es-MX')}],
  )

  #v(2cm)

  #text(size: 10pt)[
    Generado automáticamente: ${dateStr} - ${timeStr}
  ]
]

#pagebreak()

// ========== ÍNDICE ==========

#outline(
  title: "Índice",
  indent: auto,
  depth: 3,
)

#pagebreak()

// ========== RESUMEN DEL MÓDULO ==========

= Resumen del Módulo

== Descripción Funcional

${config.description}

== Cobertura de Testing

Este reporte documenta la ejecución de ${jsonResults.total} test cases automatizados que validan la funcionalidad crítica del módulo de ${config.title}.

== Métricas de Ejecución

#figure(
  table(
    columns: (3fr, 1.5fr),
    align: (left, center),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*Métrica*], [*Valor*]
    ),
    [Total de Tests], [${jsonResults.total}],
    [Tests Pasando], [${jsonResults.passed} (${percentage}%)],
    [Tests Fallando], [${jsonResults.failed}],
    [Fecha de Ejecución], [${new Date(jsonResults.timestamp).toLocaleString('es-MX')}],
    [Estado General], [${status}],
  ),
  caption: [Resumen de métricas - Módulo ${config.title}]
)

#pagebreak()

// ========== DETALLE DE TEST CASES ==========

= Detalle de Test Cases

Esta sección presenta cada test case ejecutado con su información completa estilo TestLink, incluyendo:
- Precondiciones requeridas
- Datos de prueba utilizados
- Pasos de ejecución detallados
- Resultados esperados vs obtenidos
- Evidencia visual (screenshots)

`;

  // Agrupar tests por estado
  const passing = jsonResults.results.filter(t => t.passed);
  const failing = jsonResults.results.filter(t => !t.passed);

  // Tests pasando
  if (passing.length > 0) {
    content += `
== Tests Pasando (${passing.length}/${jsonResults.total})

Los siguientes tests se ejecutaron correctamente sin errores:

`;

    passing.forEach((test) => {
      const details = testDocs[test.testId];
      const screenshot = findScreenshot(test.testId);
      content += generateTestLinkTable(test, details, screenshot, config.author);
    });
  }

  // Tests fallando
  if (failing.length > 0) {
    content += `
#pagebreak()

== Tests Fallando (${failing.length}/${jsonResults.total})

Los siguientes tests requieren atención:

`;

    failing.forEach((test) => {
      const details = testDocs[test.testId];
      const screenshot = findScreenshot(test.testId);
      content += generateTestLinkTable(test, details, screenshot, config.author);
    });
  }

  // Análisis de resultados
  content += `
#pagebreak()

= Análisis de Resultados

== Evaluación General

${jsonResults.failed === 0
  ? `El módulo de ${config.title} demuestra una calidad excepcional con el 100% de tests pasando. Todos los casos de prueba se ejecutaron exitosamente.`
  : percentage >= 90
    ? `El módulo de ${config.title} muestra una buena calidad con ${percentage}% de tests pasando. Los ${jsonResults.failed} test(s) fallando requieren revisión pero no son críticos.`
    : `El módulo de ${config.title} tiene ${jsonResults.failed} test(s) fallando que requieren atención prioritaria antes de considerar el módulo como completo.`
}

${failing.length > 0 ? `
== Tests Críticos Fallando

${failing.map(t => `- *${escapeTypst(t.testId)}*: ${escapeTypst(t.description)}\n  Error: ${escapeTypst(t.message || 'No especificado')}`).join('\n\n')}
` : ''}

== Recomendaciones

${jsonResults.failed === 0
  ? `- Mantener la suite de tests actualizada
- Ejecutar tests antes de cada deployment
- Considerar agregar tests de regresión adicionales
- Integrar en pipeline de CI/CD`
  : `- Corregir tests fallando identificados
- Revisar causas raíz de los fallos
- Re-ejecutar suite después de correcciones
- Documentar hallazgos para evitar regresiones`
}

#pagebreak()

= Apéndice

== Ubicación de Archivos

*Código Fuente del Test*:
\`testing-qa-selenium/selenium-webdriver/tests/${moduleName}.test.js\`

*Page Object*:
\`testing-qa-selenium/selenium-webdriver/page-objects/${config.title}Page.js\`

*Resultados JSON*:
\`testing-qa-selenium/reports/${config.jsonPattern}-*.json\`

*Screenshots*:
\`testing-qa-selenium/reports/screenshots/\`

== Scripts de Ejecución

*Ejecutar este módulo*:
\`\`\`bash
npm run test:${moduleName}
\`\`\`

*Generar este reporte*:
\`\`\`bash
npm run report:module:${moduleName}
\`\`\`

---

_Reporte generado automáticamente el ${dateStr} a las ${timeStr}_
`;

  // Guardar archivo Typst
  const typFile = path.join(REPORTS_DIR, `modulo-${moduleName}-report-${dateStr}.typ`);
  const pdfFile = path.join(REPORTS_DIR, `modulo-${moduleName}-report-${dateStr}.pdf`);

  fs.writeFileSync(typFile, content);
  console.log(`  ✓ Archivo Typst generado: ${typFile}`);

  // Compilar a PDF
  console.log('  Compilando a PDF con Typst...');
  try {
    execSync(`typst compile "${typFile}" "${pdfFile}"`, { stdio: 'inherit' });

    const stats = fs.statSync(pdfFile);
    console.log(`  ✓ PDF generado: ${pdfFile}`);
    console.log(`  Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`  Tests documentados: ${jsonResults.total}`);

    return pdfFile;
  } catch (error) {
    console.error(`  ✗ Error al compilar PDF: ${error.message}`);
    throw error;
  }
}

// Main
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Uso: node generate-module-reports.js <modulo>');
    console.log('\nMódulos disponibles:');
    Object.keys(MODULE_CONFIG).forEach(m => console.log(`  - ${m}`));
    console.log('\nO usar "all" para generar todos los reportes');
    process.exit(1);
  }

  const moduleName = args[0];

  if (moduleName === 'all') {
    console.log('Generando reportes para todos los módulos...\n');
    const modules = Object.keys(MODULE_CONFIG);

    modules.forEach(mod => {
      try {
        generateModuleReport(mod);
      } catch (error) {
        console.error(`Error generando reporte de ${mod}:`, error.message);
      }
    });

    console.log('\n✓ Todos los reportes generados');
  } else {
    if (!MODULE_CONFIG[moduleName]) {
      console.error(`Módulo desconocido: ${moduleName}`);
      console.log('\nMódulos disponibles:');
      Object.keys(MODULE_CONFIG).forEach(m => console.log(`  - ${m}`));
      process.exit(1);
    }

    const pdfFile = generateModuleReport(moduleName);

    if (process.platform === 'darwin') {
      console.log('\nAbriendo PDF...');
      execSync(`open "${pdfFile}"`);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateModuleReport, MODULE_CONFIG };
