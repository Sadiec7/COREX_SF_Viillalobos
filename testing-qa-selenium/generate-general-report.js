const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directorios
const REPORTS_DIR = path.join(__dirname, 'reports');
const SCREENSHOTS_DIR = path.join(REPORTS_DIR, 'screenshots');

// Configuración de módulos
const MODULES = [
  {
    name: 'Clientes',
    key: 'clientes',
    jsonPattern: 'clientes-test-results',
    author: 'Michell Sanchez',
    description: 'Gestión de clientes, contactos y agentes'
  },
  {
    name: 'Pólizas',
    key: 'polizas',
    jsonPattern: 'polizas-test-results',
    author: 'Angel Salinas',
    description: 'Administración completa de pólizas de seguros'
  },
  {
    name: 'Catálogos',
    key: 'catalogos',
    jsonPattern: 'catalogos-test-results',
    author: 'Angel Flores',
    description: 'Gestión de aseguradoras, ramos, formas de pago y tipos de documento'
  },
  {
    name: 'Recibos',
    key: 'recibos',
    jsonPattern: 'recibos-test-results',
    author: 'Salvador Camacho',
    description: 'Control de recibos de pago y estado de cuenta'
  },
  {
    name: 'Documentos',
    key: 'documentos',
    jsonPattern: 'documentos-test-results',
    author: 'Sebastian Rivera',
    description: 'Sistema de gestión documental y archivo digital'
  },
  {
    name: 'Configuración',
    key: 'config',
    jsonPattern: 'config-test-results',
    author: 'Angel Salinas',
    description: 'Configuración de cuenta, perfil y seguridad'
  }
];

/**
 * Escapar caracteres especiales de Typst
 */
function escapeTypst(text) {
  if (!text) return '';
  let escaped = String(text);

  // Remover HTML tags
  escaped = escaped.replace(/<[^>]+>/g, '');
  escaped = escaped.replace(/<[^>]*$/g, '');
  escaped = escaped.replace(/^[^<]*>/g, '');
  escaped = escaped.replace(/&[a-z]+;/gi, ' ');

  // Escapar caracteres especiales de Typst
  escaped = escaped
    .replace(/\\/g, '\\\\')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/@/g, '\\@')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>');

  return escaped;
}

/**
 * Buscar el archivo JSON más reciente para un módulo
 */
function findLatestTestResults(jsonPattern) {
  const files = fs.readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith(jsonPattern) && f.endsWith('.json'))
    .map(f => ({
      name: f,
      path: path.join(REPORTS_DIR, f),
      mtime: fs.statSync(path.join(REPORTS_DIR, f)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0].path : null;
}

/**
 * Cargar resultados de todos los módulos
 */
function loadAllModuleResults() {
  const results = {};

  for (const module of MODULES) {
    const jsonPath = findLatestTestResults(module.jsonPattern);
    if (jsonPath) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      results[module.key] = {
        ...module,
        tests: data.results || [],
        timestamp: data.timestamp,
        passed: data.results.filter(t => t.passed).length,
        failed: data.results.filter(t => !t.passed).length,
        total: data.results.length
      };
    } else {
      console.warn(`⚠️  No se encontraron resultados para ${module.name}`);
      results[module.key] = {
        ...module,
        tests: [],
        passed: 0,
        failed: 0,
        total: 0
      };
    }
  }

  return results;
}

/**
 * Generar sección de resumen ejecutivo
 */
function generateExecutiveSummary(moduleResults) {
  const totalTests = Object.values(moduleResults).reduce((sum, m) => sum + m.total, 0);
  const totalPassed = Object.values(moduleResults).reduce((sum, m) => sum + m.passed, 0);
  const totalFailed = Object.values(moduleResults).reduce((sum, m) => sum + m.failed, 0);
  const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : 0;

  const status = successRate >= 90 ? 'EXCELENTE' :
                 successRate >= 75 ? 'BUENO' :
                 successRate >= 60 ? 'ACEPTABLE' : 'REQUIERE ATENCIÓN';

  const statusColor = successRate >= 90 ? 'rgb("#d4edda")' :
                      successRate >= 75 ? 'rgb("#fff3cd")' :
                      successRate >= 60 ? 'rgb("#ffe5cc")' : 'rgb("#f8d7da")';

  return `
= Resumen Ejecutivo

El presente documento consolida los resultados de las pruebas automatizadas realizadas sobre los 6 módulos principales del sistema de gestión de seguros. La suite de testing fue ejecutada utilizando Selenium WebDriver 4.27.0 con el patrón Page Object Model.

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Test Cases Ejecutados*], [${totalTests}],
    [*Tests Exitosos*], [#text(fill: green)[${totalPassed} ✓]],
    [*Tests Fallidos*], [#text(fill: red)[${totalFailed} ✗]],
    [*Tasa de Éxito Global*], [#box(fill: ${statusColor}, inset: 5pt, radius: 3pt)[*${successRate}%*]],
    [*Estado General*], [#box(fill: ${statusColor}, inset: 5pt, radius: 3pt)[*${status}*]],
  ),
  caption: [Métricas Generales del Testing]
)

== Equipo de Testing

El proceso de testing automatizado fue desarrollado y ejecutado por:

${MODULES.map(m => `- *${m.author}*: Responsable del módulo de ${m.name}`).join('\n')}

== Cobertura por Módulo

La siguiente tabla muestra la distribución de pruebas por módulo:

#figure(
  table(
    columns: (2.5fr, 1fr, 1fr, 1fr, 1.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") } else if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center, center, center, center),
    table.header(
      [*Módulo*], [*Total*], [*Exitosos*], [*Fallidos*], [*Tasa Éxito*]
    ),
${Object.values(moduleResults).map(m => {
  const rate = m.total > 0 ? ((m.passed / m.total) * 100).toFixed(1) : 0;
  return `    [${m.name}], [${m.total}], [#text(fill: green)[${m.passed}]], [#text(fill: red)[${m.failed}]], [${rate}%],`;
}).join('\n')}
  ),
  caption: [Distribución de Pruebas por Módulo]
)
`;
}

/**
 * Generar sección de módulo individual
 */
function generateModuleSection(moduleKey, moduleData) {
  if (!moduleData || moduleData.total === 0) {
    return `
== Módulo: ${moduleData.name}

No se encontraron resultados de pruebas para este módulo.
`;
  }

  const successRate = ((moduleData.passed / moduleData.total) * 100).toFixed(2);
  const failing = moduleData.tests.filter(t => !t.passed);
  const critical = failing.filter(t =>
    t.testId.includes('-001') ||
    t.testId.includes('-002') ||
    t.description.toLowerCase().includes('crear') ||
    t.description.toLowerCase().includes('validación')
  );

  return `
== Módulo: ${moduleData.name}

*Responsable*: ${moduleData.author}

*Descripción*: ${moduleData.description}

=== Resultados del Módulo

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Tests*], [${moduleData.total}],
    [*Tests Exitosos*], [#text(fill: green)[${moduleData.passed} ✓]],
    [*Tests Fallidos*], [#text(fill: red)[${moduleData.failed} ✗]],
    [*Tasa de Éxito*], [*${successRate}%*],
    [*Fecha de Ejecución*], [${new Date(moduleData.timestamp).toLocaleString('es-MX')}],
  ),
  caption: [Métricas del Módulo ${moduleData.name}]
)

${failing.length > 0 ? `
=== Análisis de Fallos

Se identificaron ${failing.length} test(s) con fallos en este módulo:

${critical.length > 0 ? `
*Tests Críticos Fallando*:

${critical.map(t => `- *${escapeTypst(t.testId)}*: ${escapeTypst(t.description)}
  Error: ${escapeTypst(t.message || 'No especificado')}`).join('\n\n')}
` : ''}

${failing.length > critical.length ? `
*Otros Tests Fallando*:

${failing.filter(t => !critical.includes(t)).map(t => `- *${escapeTypst(t.testId)}*: ${escapeTypst(t.description)}`).join('\n')}
` : ''}
` : `
=== Estado

#box(fill: rgb("#d4edda"), inset: 10pt, radius: 5pt, width: 100%)[
  ✓ Todos los tests de este módulo pasaron exitosamente.
]
`}

=== Tests Documentados

${moduleData.tests.slice(0, 5).map(t => {
  const status = t.passed ? '[PASS ✓]' : '[FAIL ✗]';
  const statusColor = t.passed ? 'rgb("#d4edda")' : 'rgb("#f8d7da")';
  return `
*${escapeTypst(t.testId)}*: ${escapeTypst(t.description)}

Estado: #box(fill: ${statusColor}, inset: 3pt, radius: 3pt)[${status}]
${!t.passed ? `\nError: ${escapeTypst(t.message || 'No especificado')}` : ''}
`;
}).join('\n')}

${moduleData.total > 5 ? `\n_... y ${moduleData.total - 5} tests más. Ver reporte detallado del módulo para información completa._\n` : ''}
`;
}

/**
 * Generar conclusiones y recomendaciones
 */
function generateConclusions(moduleResults) {
  const totalTests = Object.values(moduleResults).reduce((sum, m) => sum + m.total, 0);
  const totalPassed = Object.values(moduleResults).reduce((sum, m) => sum + m.passed, 0);
  const totalFailed = Object.values(moduleResults).reduce((sum, m) => sum + m.failed, 0);
  const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : 0;

  const modulesWithFailures = Object.values(moduleResults).filter(m => m.failed > 0);
  const criticalModules = modulesWithFailures.filter(m => (m.passed / m.total) < 0.75);

  return `
= Conclusiones y Recomendaciones

== Conclusiones Generales

- Se ejecutaron un total de *${totalTests} test cases* distribuidos en 6 módulos funcionales
- La tasa de éxito global es del *${successRate}%* (${totalPassed}/${totalTests} tests aprobados)
- Se identificaron *${totalFailed} casos de fallo* que requieren atención

${modulesWithFailures.length > 0 ? `
== Módulos que Requieren Atención

${modulesWithFailures.map(m => {
  const rate = ((m.passed / m.total) * 100).toFixed(1);
  const priority = rate < 75 ? 'ALTA' : rate < 90 ? 'MEDIA' : 'BAJA';
  return `
=== ${m.name} (${rate}% éxito) - Prioridad: ${priority}

- Tests fallidos: ${m.failed}/${m.total}
- Responsable: ${m.author}
- ${priority === 'ALTA' ? 'Requiere atención inmediata' : priority === 'MEDIA' ? 'Revisión recomendada' : 'Mejoras menores requeridas'}
`;
}).join('\n')}
` : `
== Estado General

#box(fill: rgb("#d4edda"), inset: 10pt, radius: 5pt, width: 100%)[
  ✓ Todos los módulos han completado sus pruebas exitosamente. El sistema muestra un nivel de calidad excelente.
]
`}

== Recomendaciones Técnicas

${successRate >= 90 ? `
1. *Mantenimiento*: Continuar con el esquema actual de pruebas automatizadas
2. *Expansión*: Considerar agregar pruebas de rendimiento y carga
3. *Documentación*: Actualizar la documentación técnica con los casos de éxito
` : `
1. *Corrección de Fallos*: Priorizar la resolución de tests fallidos según criticidad
2. *Análisis de Root Cause*: Investigar las causas raíz de los fallos identificados
3. *Refactorización*: Revisar el código de los módulos con tasas de éxito < 75%
4. *Testing Adicional*: Agregar casos de prueba para escenarios edge cases
`}

== Próximos Pasos

1. Revisión de los reportes detallados por módulo
2. Corrección de defectos identificados por orden de prioridad
3. Re-ejecución de tests fallidos después de las correcciones
4. Actualización de la documentación técnica
5. Planificación de próxima iteración de testing

== Metodología

*Framework*: Selenium WebDriver 4.27.0
*Patrón de Diseño*: Page Object Model (POM)
*Lenguaje*: JavaScript (Node.js)
*Navegador*: Chrome (modo headless)
*Sistema Operativo*: ${process.platform}

*Fecha de Generación del Reporte*: ${new Date().toLocaleString('es-MX', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
`;
}

/**
 * Generar el documento Typst completo
 */
function generateGeneralReport(moduleResults) {
  const today = new Date().toISOString().split('T')[0];
  const totalTests = Object.values(moduleResults).reduce((sum, m) => sum + m.total, 0);
  const totalPassed = Object.values(moduleResults).reduce((sum, m) => sum + m.passed, 0);
  const totalFailed = Object.values(moduleResults).reduce((sum, m) => sum + m.failed, 0);
  const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;

  const status = successRate >= 90 ? 'EXCELENTE - Calidad superior' :
                 successRate >= 75 ? 'BUENO - Mayoría de tests pasando' :
                 successRate >= 60 ? 'ACEPTABLE - Requiere mejoras' : 'CRÍTICO - Atención inmediata';

  const fillColor = successRate >= 90 ? 'rgb("#d4edda")' :
                    successRate >= 75 ? 'rgb("#fff3cd")' :
                    successRate >= 60 ? 'rgb("#ffe5cc")' : 'rgb("#f8d7da")';

  return `// Reporte General de Testing
// Generado automáticamente: ${new Date().toLocaleString('es-MX')}

#set document(
  title: "Reporte General de Testing",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte General de Testing - Sistema de Seguros_
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
    Reporte General de Testing
  ]

  #v(0.5cm)

  #text(size: 22pt, weight: "bold")[
    Suite Completa de Pruebas Automatizadas
  ]

  #v(2cm)

  #text(size: 16pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(1.5cm)

  #rect(
    fill: ${fillColor},
    width: 75%,
    radius: 10pt,
    inset: 20pt,
    stroke: 1pt,
  )[
    #text(size: 16pt, weight: "bold")[
      ${totalTests} Test Cases Totales
    ]

    #v(0.5cm)

    #grid(
      columns: (1fr, 1fr),
      gutter: 15pt,
      [
        #text(size: 13pt)[
          *Pasando*: ${totalPassed}
        ]
      ],
      [
        #text(size: 13pt)[
          *Fallando*: ${totalFailed}
        ]
      ],
    )

    #v(0.3cm)

    #text(size: 12pt)[
      *Tasa de Éxito*: ${successRate}%
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
    [*Módulos Testeados*:], [${Object.keys(moduleResults).length}],
    [*Fecha de Generación*:], [${new Date().toLocaleDateString('es-MX')}],
  )

  #v(2cm)

  #text(size: 10pt)[
    Generado automáticamente: ${new Date().toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
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

${generateExecutiveSummary(moduleResults)}

#pagebreak()

= Detalle por Módulo

${Object.entries(moduleResults).map(([key, data]) =>
  generateModuleSection(key, data)
).join('\n#pagebreak()\n')}

#pagebreak()

${generateConclusions(moduleResults)}

#pagebreak()

= Apéndice: Información Técnica

== Configuración del Entorno

*Node Version*: ${process.version}
*Sistema Operativo*: ${process.platform}
*Arquitectura*: ${process.arch}

== Estructura de Módulos Testeados

${MODULES.map(m => `
=== ${m.name}

*Autor del Testing*: ${m.author}

*Descripción*: ${m.description}

*Tests Ejecutados*: ${moduleResults[m.key]?.total || 0}

*Archivo de Resultados*: \`${m.jsonPattern}-[timestamp].json\`
`).join('\n')}

== Repositorio y Documentación

Para acceder a los reportes detallados de cada módulo, consultar:

${MODULES.map(m => `- \`reports/modulo-${m.key}-report-${today}.pdf\``).join('\n')}

#v(2em)

#align(center)[
  #text(10pt, style: "italic")[
    Este reporte fue generado automáticamente por el sistema de testing

    Framework: Selenium WebDriver 4.27.0
  ]
]
`;
}

/**
 * Main
 */
function main() {
  try {
    console.log('📊 Generando Reporte General Consolidado...\n');

    // Cargar resultados de todos los módulos
    const moduleResults = loadAllModuleResults();

    // Mostrar resumen
    console.log('Módulos cargados:');
    Object.entries(moduleResults).forEach(([key, data]) => {
      console.log(`  - ${data.name}: ${data.passed}/${data.total} tests (${data.author})`);
    });
    console.log('');

    // Generar documento Typst
    const typstContent = generateGeneralReport(moduleResults);

    const today = new Date().toISOString().split('T')[0];
    const typstPath = path.join(REPORTS_DIR, `reporte-general-testing-${today}.typ`);
    const pdfPath = path.join(REPORTS_DIR, `reporte-general-testing-${today}.pdf`);

    // Escribir archivo Typst
    fs.writeFileSync(typstPath, typstContent, 'utf-8');
    console.log(`✓ Archivo Typst generado: ${typstPath}`);

    // Compilar a PDF con Typst
    console.log('\n🔨 Compilando a PDF...');
    execSync(`typst compile "${typstPath}" "${pdfPath}"`, { stdio: 'inherit' });

    // Verificar PDF generado
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log(`\n✅ REPORTE GENERAL GENERADO EXITOSAMENTE!`);
      console.log(`📄 Archivo: ${pdfPath}`);
      console.log(`📦 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);

      // Calcular totales
      const totalTests = Object.values(moduleResults).reduce((sum, m) => sum + m.total, 0);
      const totalPassed = Object.values(moduleResults).reduce((sum, m) => sum + m.passed, 0);
      const successRate = ((totalPassed / totalTests) * 100).toFixed(2);

      console.log(`\n📊 Resumen Global:`);
      console.log(`   Total Tests: ${totalTests}`);
      console.log(`   Exitosos: ${totalPassed}`);
      console.log(`   Fallidos: ${totalTests - totalPassed}`);
      console.log(`   Tasa de Éxito: ${successRate}%`);
    } else {
      console.error('❌ Error: El PDF no se generó correctamente');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error al generar el reporte:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar
main();
